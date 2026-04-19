const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "인증 토큰이 없습니다." });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "유효하지 않거나 만료된 토큰입니다." });
        }

        req.user = decoded; // { id, email, nickname } 가 담겨있음
        next();
    });
};

module.exports = { verifyToken };