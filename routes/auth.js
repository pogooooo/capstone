var express = require('express');
const { saveUser, updateRefreshToken, getUserByRefreshToken, removeRefreshToken,
        getUserByEmail, updateUser, deleteUser } = require("../database");
const axios = require('axios');
const { verifyToken } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
var router = express.Router();

const validateUserInfo = (info) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!info.email || !emailRegex.test(info.email)) return "유효하지 않은 이메일 형식입니다.";
    if (!info.name || info.name.length < 1) return "이름은 1자 이상이어야 합니다.";
    if (!info.nickname || info.nickname.length < 1) return "닉네임은 1자 이상이어야 합니다.";

    return null;
};

router.get('/', verifyToken, async (req, res) => {
    /* #swagger.tags = ['auth'] */
    try {
        const user = await getUserByEmail(req.user.email);
        if (!user) {
            return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "프로필 조회 중 서버 에러가 발생했습니다." });
    }
});

router.patch('/', verifyToken, async (req, res) => {
    /* #swagger.tags = ['auth'] */
    const { name, nickname } = req.body;

    if (!name && !nickname) {
        return res.status(400).json({ message: "변경할 이름이나 닉네임을 입력해주세요." });
    }
    if (name && name.length < 1) return res.status(400).json({ message: "이름은 1자 이상이어야 합니다." });
    if (nickname && nickname.length < 1) return res.status(400).json({ message: "닉네임은 1자 이상이어야 합니다." });

    try {
        await updateUser(req.user.email, name, nickname);

        res.status(200).json({
            message: "프로필이 성공적으로 수정되었습니다.",
            updated: { name, nickname }
        });
    } catch (error) {
        res.status(500).json({ message: "프로필 수정 중 서버 에러가 발생했습니다." });
    }
});

router.get('/login', function(req, res, next) {
    /* #swagger.tags = ['auth'] */
    const provider = req.headers.provider || req.query.provider;

    if (!provider) {
        return res.status(400).json({ message: "provider 값(google 또는 github)이 필요합니다." });
    }

    let redirectUrl = "";

    if (provider === 'google') {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;

        redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
    }
    else if (provider === 'github') {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const redirectUri = process.env.GITHUB_REDIRECT_URI;

        redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
    }
    else {
        return res.status(400).json({ message: "지원하지 않는 소셜 로그인입니다." });
    }

    res.redirect(302, redirectUrl);
});

router.get('/callback/:provider', async (req, res) => {
    /* #swagger.tags = ['auth'] */
    const code = req.headers.code || req.query.code;
    const provider = req.params.provider;

    if (!code) {
        return res.status(400).json({ message: "인가 코드(code)가 제공되지 않았습니다." });
    }

    try {
        let socialUserInfo = {};

        if (provider === 'google') {
            const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            }).toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            const tokenData = tokenResponse.data;

            const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            const userData = userResponse.data;

            socialUserInfo = {
                email: userData.email,
                name: userData.name || "구글유저",
                nickname: userData.name || "user"
                // nickname: userData.given_name || `user_${Date.now()}`
            };
        }

        else if (provider === 'github') {
            const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.GITHUB_REDIRECT_URI,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const tokenData = tokenResponse.data;
            if (tokenData.error) throw new Error(tokenData.error_description || "깃허브 토큰 발급 실패");

            const userResponse = await axios.get('https://api.github.com/user', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            const userData = userResponse.data;

            let email = userData.email;
            if (!email) {
                const emailResponse = await axios.get('https://api.github.com/user/emails', {
                    headers: { Authorization: `Bearer ${tokenData.access_token}` },
                });
                const emails = emailResponse.data;
                const primaryEmail = emails.find(e => e.primary);
                email = primaryEmail ? primaryEmail.email : null;
            }

            socialUserInfo = {
                email: email,
                name: userData.name || userData.login,
                nickname: userData.login
            };
        }

        else {
            return res.status(400).json({ message: "지원하지 않는 provider입니다." });
        }

        const validationError = validateUserInfo(socialUserInfo);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const userId = await saveUser(socialUserInfo);

        const accessToken = jwt.sign(
            { id: userId, email: socialUserInfo.email, nickname: socialUserInfo.nickname },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { email: socialUserInfo.email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '14d' }
        );

        await updateRefreshToken(socialUserInfo.email, refreshToken);

        res.status(200).json({
            id: userId,
            access_token: accessToken,
            message: "로그인 및 회원가입 성공",
            user: socialUserInfo
        });

    } catch (error) {
        console.error("Callback Error Details:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "소셜 로그인 처리 중 에러가 발생했습니다." });
    }
});

router.post('/refresh', async (req, res) => {
    /* #swagger.tags = ['auth'] */
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "엑세스 토큰이 제공되지 않았습니다." });
    }

    const accessToken = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET, { ignoreExpiration: true });

        const user = await getUserByEmail(decoded.email);

        if (!user || !user.refresh_token) {
            return res.status(403).json({ message: "리프레시 토큰이 존재하지 않습니다. 다시 로그인하세요." });
        }

        jwt.verify(user.refresh_token, process.env.JWT_REFRESH_SECRET, (err) => {
            if (err) {
                return res.status(403).json({ message: "리프레시 토큰이 만료되었습니다. 다시 로그인하세요." });
            }

            const newAccessToken = jwt.sign(
                { id: user.id, email: user.email, nickname: user.nickname },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ access_token: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: "토큰 재발급 중 서버 에러가 발생했습니다." });
    }
});

router.post('/logout', verifyToken, async (req, res) => {
    /* #swagger.tags = ['auth'] */
    try {
        await removeRefreshToken(req.user.email);
        res.status(204).send();
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "로그아웃 처리 중 서버 에러가 발생했습니다." });
    }
});

router.delete('/withdraw', verifyToken, async (req, res) => {
    /* #swagger.tags = ['auth'] */
    try {
        const deletedRows = await deleteUser(req.user.email);

        if (deletedRows === 0) {
            return res.status(404).json({ message: "존재하지 않거나 이미 탈퇴한 유저입니다." });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Withdraw Error:", error);
        res.status(500).json({ message: "회원탈퇴 처리 중 서버 에러가 발생했습니다." });
    }
});

module.exports = router;