const express = require('express');

const {
    createProject, getAllProjects, getProjectById, getProjectLeader,
    updateProject, deleteProject, joinProject, leaveProject,
    addComment, getCommentsByProjectId, deleteComment,
    toggleLike, getProjectLikeCount
} = require('../oracle_database');

const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            USER_ID: req.user.id,
            USER_NICKNAME: req.user.nickname
        };
        const result = await createProject(projectData);
        res.status(201).json({ message: "프로젝트가 생성되었습니다.", projectId: result.projectId });
    } catch (error) {
        console.error("Project Create Error:", error);
        res.status(500).json({ message: "프로젝트 생성 중 서버 에러가 발생했습니다." });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const projects = await getAllProjects(req.user.id);
        res.status(200).json(projects);
    } catch (error) {
        console.error("Project Get Error:", error);
        res.status(500).json({ message: "프로젝트 조회 중 서버 에러가 발생했습니다." });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const project = await getProjectById(req.params.id, req.user.id);

        if (!project) {
            return res.status(404).json({ message: "해당 프로젝트를 찾을 수 없습니다." });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("Project Detail Get Error:", error);
        res.status(500).json({ message: "프로젝트 상세 조회 중 에러가 발생했습니다." });
    }
});

router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const changes = await updateProject(req.params.id, req.user.id, req.body);
        if (changes === 0) {
            return res.status(400).json({ message: "수정할 내용이 없거나 프로젝트가 존재하지 않습니다." });
        }
        res.status(200).json({ message: "프로젝트가 수정되었습니다." });
    } catch (error) {
        if (error.message.includes("FORBIDDEN")) {
            return res.status(403).json({ message: error.message });
        }
        console.error("Project Update Error:", error);
        res.status(500).json({ message: "프로젝트 수정 중 서버 에러가 발생했습니다." });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const changes = await deleteProject(req.params.id, req.user.id);
        if (changes === 0) {
            return res.status(404).json({ message: "삭제할 프로젝트가 존재하지 않습니다." });
        }
        res.status(204).send();
    } catch (error) {
        if (error.message.includes("FORBIDDEN")) {
            return res.status(403).json({ message: error.message });
        }
        console.error("Project Delete Error:", error);
        res.status(500).json({ message: "프로젝트 삭제 중 서버 에러가 발생했습니다." });
    }
});

router.post('/:id/join', verifyToken, async (req, res) => {
    try {
        const { role } = req.body;
        await joinProject(req.params.id, req.user.id, req.user.nickname, role);
        res.status(200).json({ message: "프로젝트에 참가했습니다." });
    } catch (error) {
        console.error("Project Join Error:", error);
        res.status(500).json({ message: "프로젝트 참가 중 서버 에러가 발생했습니다." });
    }
});

router.delete('/:id/leave', verifyToken, async (req, res) => {
    try {
        const changes = await leaveProject(req.params.id, req.user.id);
        if (changes === 0) {
            return res.status(404).json({ message: "참가 중인 프로젝트가 아니거나 이미 탈퇴했습니다." });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Project Leave Error:", error);
        res.status(500).json({ message: "프로젝트 탈퇴 중 서버 에러가 발생했습니다." });
    }
});

router.post('/:id/like', verifyToken, async (req, res) => {
    try {
        const result = await toggleLike(req.user.id, req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Like Toggle Error:", error);
        res.status(500).json({ message: "스크랩 처리 중 서버 에러가 발생했습니다." });
    }
});

router.get('/:id/likes', verifyToken, async (req, res) => {
    try {
        const count = await getProjectLikeCount(req.params.id);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Like Count Get Error:", error);
        res.status(500).json({ message: "좋아요 개수 조회 중 서버 에러가 발생했습니다." });
    }
});

router.post('/:id/comments', verifyToken, async (req, res) => {
    try {
        const { CMT_REPLY, CMT_PA_ID } = req.body;

        if (!CMT_REPLY || CMT_REPLY.trim() === '') {
            return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
        }

        const commentId = await addComment(req.params.id, req.user.id, CMT_REPLY, CMT_PA_ID || null);
        res.status(201).json({ message: "댓글이 작성되었습니다.", commentId });
    } catch (error) {
        if (error.message.includes("DEPTH_LIMIT")) {
            return res.status(400).json({ message: "댓글은 최대 3단계까지만 작성할 수 있습니다." });
        }
        console.error("Comment Add Error:", error);
        res.status(500).json({ message: "댓글 작성 중 서버 에러가 발생했습니다." });
    }
});

router.get('/:id/comments', verifyToken, async (req, res) => {
    try {
        const comments = await getCommentsByProjectId(req.params.id);
        res.status(200).json(comments);
    } catch (error) {
        console.error("Comment Get Error:", error);
        res.status(500).json({ message: "댓글 조회 중 서버 에러가 발생했습니다." });
    }
});

router.delete('/:id/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const changes = await deleteComment(req.params.commentId, req.user.id);

        if (changes === 0) {
            return res.status(403).json({ message: "삭제 권한이 없거나 존재하지 않는 댓글입니다." });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Comment Delete Error:", error);
        res.status(500).json({ message: "댓글 삭제 중 서버 에러가 발생했습니다." });
    }
});

module.exports = router;