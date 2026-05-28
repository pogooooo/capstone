const express = require('express');
const { getPortfolioByUserId, upsertPortfolio, deletePortfolio } = require('../oracle_database');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.use(verifyToken);

// 1. 포트폴리오 읽기 (GET)
router.get('/', async (req, res) => {
    try {
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
router.put('/', async (req, res) => {
    /* #swagger.tags = ['Portfolio']
       #swagger.summary = '내 포트폴리오 추가 및 수정 (Upsert)'
       #swagger.description = '새로운 데이터베이스 구조(TBL_AWARD_INFO 분리)에 맞게 포트폴리오 정보를 저장합니다.'
       #swagger.security = [{ "bearerAuth": [] }] */

    // 🔥 req.body에서 새로 추가된 introduction 필드도 수신
    const { external_link, awards, tech_stack, image_1, image_2, image_3, award_detail, introduction } = req.body;

    try {
        await upsertPortfolio(req.user.id, {
            external_link, awards, tech_stack, image_1, image_2, image_3, award_detail, introduction
        });

        res.status(200).json({ message: "포트폴리오가 성공적으로 저장되었습니다." });
    } catch (error) {
        console.error("Portfolio Update Error:", error);
        res.status(500).json({ message: "포트폴리오 저장 중 서버 에러가 발생했습니다." });
    }
});

// 3. 포트폴리오 삭제 (DELETE)
router.delete('/', async (req, res) => {
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

// 4. 타 유저 포트폴리오 조회 (GET)
router.get('/:userId', async (req, res) => {
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