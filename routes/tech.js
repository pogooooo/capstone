const express = require('express');
const { getAllTechRoles } = require('../oracle_database');
const router = express.Router();

router.get('/roles', async (req, res) => {
    try {
        const roles = await getAllTechRoles();
        res.status(200).json(roles);
    } catch (error) {
        console.error("Tech Roles Fetch Error:", error);
        res.status(500).json({ message: "기술 스택 데이터를 불러오는 중 에러가 발생했습니다." });
    }
});

module.exports = router;