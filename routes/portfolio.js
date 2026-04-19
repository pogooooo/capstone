const express = require('express');
const { getPortfolioByUserId, upsertPortfolio, deletePortfolio } = require('../database');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

// 포트폴리오는 모두 로그인한 본인만 다루므로 맨 위에 문지기를 세워둡니다.
router.use(verifyToken);

// 1. 포트폴리오 읽기 (GET)
router.get('/', async (req, res) => {
    /* #swagger.tags = ['Portfolio']
       #swagger.summary = '내 포트폴리오 조회'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        // verifyToken이 해독해 준 req.user.id를 사용해 조회합니다.
        const portfolio = await getPortfolioByUserId(req.user.id);

        if (!portfolio) {
            return res.status(404).json({ message: "등록된 포트폴리오가 없습니다." });
        }
        res.status(200).json(portfolio);
    } catch (error) {
        console.error("Portfolio Get Error:", error);
        res.status(500).json({ message: "포트폴리오 조회 중 서버 에러가 발생했습니다." });
    }
});

// 2. 포트폴리오 추가 및 수정 (PUT)
// (없으면 만들고, 있으면 덮어쓰는 Upsert 방식입니다)
router.put('/', async (req, res) => {
    /* #swagger.tags = ['Portfolio']
       #swagger.summary = '내 포트폴리오 추가 및 수정 (Upsert)'
       #swagger.description = '신뢰도 점수를 제외한 포트폴리오 정보를 저장합니다.'
       #swagger.security = [{ "bearerAuth": [] }] */
    const { external_link, awards, tech_stack, image_1, image_2, image_3 } = req.body;

    try {
        await upsertPortfolio(req.user.id, {
            external_link, awards, tech_stack, image_1, image_2, image_3
        });

        res.status(200).json({ message: "포트폴리오가 성공적으로 저장되었습니다." });
    } catch (error) {
        console.error("Portfolio Update Error:", error);
        res.status(500).json({ message: "포트폴리오 저장 중 서버 에러가 발생했습니다." });
    }
});

// 3. 포트폴리오 삭제 (DELETE)
router.delete('/', async (req, res) => {
    /* #swagger.tags = ['Portfolio']
       #swagger.summary = '내 포트폴리오 삭제'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const deletedRows = await deletePortfolio(req.user.id);

        if (deletedRows === 0) {
            return res.status(404).json({ message: "삭제할 포트폴리오가 없습니다." });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Portfolio Delete Error:", error);
        res.status(500).json({ message: "포트폴리오 삭제 중 서버 에러가 발생했습니다." });
    }
});

router.get('/:userId', async (req, res) => {
    /* #swagger.tags = ['Portfolio']
       #swagger.summary = '다른 사람의 포트폴리오 조회'
       #swagger.description = '특정 유저의 ID를 입력하여 해당 유저의 포트폴리오를 조회합니다.'
       #swagger.security = [{ "bearerAuth": [] }] */

    const targetUserId = req.params.userId;

    try {
        const portfolio = await getPortfolioByUserId(targetUserId);

        if (!portfolio) {
            return res.status(404).json({ message: "해당 유저의 포트폴리오가 존재하지 않습니다." });
        }

        res.status(200).json(portfolio);
    } catch (error) {
        console.error("Other Portfolio Get Error:", error);
        res.status(500).json({ message: "포트폴리오 조회 중 서버 에러가 발생했습니다." });
    }
});

module.exports = router;