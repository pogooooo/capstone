const express = require('express');
const {
    createProject, getAllProjects, updateProject, deleteProject,
    joinProject, leaveProject,
    toggleLike, getProjectLikeCount,
    addComment, getCommentsByProjectId, deleteComment
} = require('../database');
const { verifyToken } = require('../middlewares/auth');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 생성'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const projectId = await createProject(req.user.id, req.user.nickname, req.body);
        res.status(201).json({ message: "프로젝트가 생성되었습니다.", projectId });
    } catch (error) {
        res.status(500).json({ message: "프로젝트 생성 중 서버 에러가 발생했습니다." });
    }
});

router.get('/', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '전체 프로젝트 조회'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const projects = await getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "프로젝트 조회 중 서버 에러가 발생했습니다." });
    }
});

router.patch('/:id', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 수정 (팀장 전용)'
       #swagger.security = [{ "bearerAuth": [] }] */
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
        res.status(500).json({ message: "프로젝트 수정 중 서버 에러가 발생했습니다." });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 삭제 (팀장 전용)'
       #swagger.security = [{ "bearerAuth": [] }] */
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
        res.status(500).json({ message: "프로젝트 삭제 중 서버 에러가 발생했습니다." });
    }
});

router.post('/:id/join', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 참가'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const { role } = req.body;
        await joinProject(req.params.id, req.user.id, req.user.nickname, role);
        res.status(200).json({ message: "프로젝트에 참가했습니다." });
    } catch (error) {
        res.status(500).json({ message: "프로젝트 참가 중 서버 에러가 발생했습니다." });
    }
});

router.delete('/:id/leave', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 탈퇴'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const changes = await leaveProject(req.params.id, req.user.id);
        if (changes === 0) {
            return res.status(404).json({ message: "참가 중인 프로젝트가 아니거나 이미 탈퇴했습니다." });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "프로젝트 탈퇴 중 서버 에러가 발생했습니다." });
    }
});

router.post('/:id/like', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 좋아요 추가/취소 토글'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const result = await toggleLike(req.user.id, req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "좋아요 처리 중 서버 에러가 발생했습니다." });
    }
});

router.get('/:id/likes', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 좋아요 개수 조회'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const count = await getProjectLikeCount(req.params.id);
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "좋아요 개수 조회 중 서버 에러가 발생했습니다." });
    }
});

router.post('/:id/comments', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 댓글 작성 (대댓글 포함)'
       #swagger.description = '대댓글인 경우 parent_id에 부모 댓글의 id를 같이 보냅니다.'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const { content, parent_id } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
        }

        const commentId = await addComment(req.params.id, req.user.id, content, parent_id || null);
        res.status(201).json({ message: "댓글이 작성되었습니다.", commentId });
    } catch (error) {
        console.error("Comment Add Error:", error);
        res.status(500).json({ message: "댓글 작성 중 서버 에러가 발생했습니다." });
    }
});

router.get('/:id/comments', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 댓글 전체 조회'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        const comments = await getCommentsByProjectId(req.params.id);
        res.status(200).json(comments);
    } catch (error) {
        console.error("Comment Get Error:", error);
        res.status(500).json({ message: "댓글 조회 중 서버 에러가 발생했습니다." });
    }
});

router.delete('/:id/comments/:commentId', verifyToken, async (req, res) => {
    /* #swagger.tags = ['Projects']
       #swagger.summary = '프로젝트 댓글 삭제'
       #swagger.description = '본인이 작성한 댓글만 삭제할 수 있습니다.'
       #swagger.security = [{ "bearerAuth": [] }] */
    try {
        // req.user.id를 함께 넘겨서 본인이 쓴 댓글인지 DB에서 확인합니다.
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