// database.js (Vercel 배포용 100% 무에러 InMemory DB)
// 서버가 깨어있는 동안에는 실제 DB처럼 완벽하게 데이터가 저장되고 조회됩니다!

let users = [];
let portfolios = [];
let projects = [];
let participants = [];
let likes = [];
let comments = [];

let userIdCounter = 1;
let portfolioIdCounter = 1;
let projectIdCounter = 1;
let participantIdCounter = 1;
let likeIdCounter = 1;
let commentIdCounter = 1;

// ===================== Users =====================
const saveUser = (userData) => {
    return new Promise((resolve) => {
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            existingUser.name = userData.name;
            existingUser.nickname = userData.nickname;
            resolve(existingUser.id);
        } else {
            const newUser = { id: userIdCounter++, ...userData, joined_at: new Date().toISOString() };
            users.push(newUser);
            resolve(newUser.id);
        }
    });
};

const updateRefreshToken = (email, token) => {
    return new Promise((resolve) => {
        const user = users.find(u => u.email === email);
        if (user) user.refresh_token = token;
        resolve();
    });
};

const getUserByRefreshToken = (token) => {
    return Promise.resolve(users.find(u => u.refresh_token === token));
};

const removeRefreshToken = (email) => {
    return new Promise((resolve) => {
        const user = users.find(u => u.email === email);
        if (user) user.refresh_token = null;
        resolve();
    });
};

const getUserByEmail = (email) => {
    return Promise.resolve(users.find(u => u.email === email));
};

const updateUser = (email, name, nickname) => {
    return new Promise((resolve) => {
        const user = users.find(u => u.email === email);
        if (user) {
            if (name) user.name = name;
            if (nickname) user.nickname = nickname;
            resolve(1);
        } else resolve(0);
    });
};

const deleteUser = (email) => {
    return new Promise((resolve) => {
        const initialLength = users.length;
        users = users.filter(u => u.email !== email);
        resolve(initialLength - users.length);
    });
};

// ===================== Portfolios =====================
const getPortfolioByUserId = (userId) => {
    return Promise.resolve(portfolios.find(p => p.user_id == userId));
};

const upsertPortfolio = (userId, data) => {
    return new Promise((resolve) => {
        const existing = portfolios.find(p => p.user_id == userId);
        if (existing) {
            Object.assign(existing, data);
            resolve(existing.id);
        } else {
            const newPortfolio = { id: portfolioIdCounter++, user_id: userId, trust_score: 50.0, ...data };
            portfolios.push(newPortfolio);
            resolve(newPortfolio.id);
        }
    });
};

const updateTrustScore = (userId, scoreToAdd) => {
    return new Promise((resolve) => {
        const existing = portfolios.find(p => p.user_id == userId);
        if (existing) {
            existing.trust_score += scoreToAdd;
            resolve(1);
        } else resolve(0);
    });
};

const deletePortfolio = (userId) => {
    return new Promise((resolve) => {
        const initialLength = portfolios.length;
        portfolios = portfolios.filter(p => p.user_id != userId);
        resolve(initialLength - portfolios.length);
    });
};

// ===================== Projects =====================
const checkIsLeader = (projectId, userId) => {
    return Promise.resolve(participants.some(p => p.project_id == projectId && p.user_id == userId && p.is_leader === 1));
};

const createProject = (userId, nickname, data) => {
    return new Promise((resolve) => {
        const newProject = {
            id: projectIdCounter++,
            views: 0,
            ...data
        };
        projects.push(newProject);

        participants.push({
            id: participantIdCounter++,
            project_id: newProject.id,
            user_id: userId,
            nickname: nickname,
            role: '팀장',
            is_leader: 1,
            joined_at: new Date().toISOString()
        });

        resolve(newProject.id);
    });
};

const getAllProjects = () => {
    // 최신순으로 정렬해서 반환
    return Promise.resolve([...projects].reverse());
};

const updateProject = async (projectId, userId, updateData) => {
    const isLeader = await checkIsLeader(projectId, userId);
    if (!isLeader) throw new Error("FORBIDDEN: 팀장만 프로젝트를 수정할 수 있습니다.");

    return new Promise((resolve) => {
        const project = projects.find(p => p.id == projectId);
        if (project) {
            Object.assign(project, updateData);
            resolve(1);
        } else resolve(0);
    });
};

const deleteProject = async (projectId, userId) => {
    const isLeader = await checkIsLeader(projectId, userId);
    if (!isLeader) throw new Error("FORBIDDEN: 팀장만 프로젝트를 삭제할 수 있습니다.");

    return new Promise((resolve) => {
        const initialLength = projects.length;
        projects = projects.filter(p => p.id != projectId);
        participants = participants.filter(p => p.project_id != projectId);
        likes = likes.filter(l => l.project_id != projectId);
        comments = comments.filter(c => c.project_id != projectId);
        resolve(initialLength - projects.length);
    });
};

const joinProject = (projectId, userId, nickname, role) => {
    return new Promise((resolve) => {
        const newParticipant = {
            id: participantIdCounter++,
            project_id: projectId,
            user_id: userId,
            nickname: nickname,
            role: role,
            is_leader: 0,
            joined_at: new Date().toISOString()
        };
        participants.push(newParticipant);
        resolve(newParticipant.id);
    });
};

const leaveProject = (projectId, userId) => {
    return new Promise((resolve) => {
        const initialLength = participants.length;
        participants = participants.filter(p => !(p.project_id == projectId && p.user_id == userId));
        resolve(initialLength - participants.length);
    });
};

// ===================== Likes =====================
const toggleLike = (userId, projectId) => {
    return new Promise((resolve) => {
        const existingIndex = likes.findIndex(l => l.user_id == userId && l.project_id == projectId);
        if (existingIndex !== -1) {
            likes.splice(existingIndex, 1);
            resolve({ isLiked: false });
        } else {
            likes.push({ id: likeIdCounter++, user_id: userId, project_id: projectId });
            resolve({ isLiked: true });
        }
    });
};

const getProjectLikeCount = (projectId) => {
    return Promise.resolve(likes.filter(l => l.project_id == projectId).length);
};

// ===================== Comments =====================
const addComment = (projectId, userId, content, parentId = null) => {
    return new Promise((resolve) => {
        const newComment = {
            id: commentIdCounter++,
            project_id: projectId,
            user_id: userId,
            content: content,
            parent_id: parentId,
            created_at: new Date().toISOString()
        };
        comments.push(newComment);
        resolve(newComment.id);
    });
};

const getCommentsByProjectId = (projectId) => {
    return new Promise((resolve) => {
        const projectComments = comments.filter(c => c.project_id == projectId).map(c => {
            const user = users.find(u => u.id == c.user_id);
            return { ...c, nickname: user ? user.nickname : "알 수 없음" };
        });
        resolve(projectComments);
    });
};

const deleteComment = (commentId, userId) => {
    return new Promise((resolve) => {
        const initialLength = comments.length;
        comments = comments.filter(c => !(c.id == commentId && c.user_id == userId));
        resolve(initialLength - comments.length);
    });
};

module.exports = {
    saveUser, updateRefreshToken, getUserByRefreshToken, removeRefreshToken,
    getUserByEmail, updateUser, deleteUser,
    getPortfolioByUserId, upsertPortfolio, updateTrustScore, deletePortfolio,
    createProject, getAllProjects, updateProject, deleteProject, joinProject, leaveProject,
    toggleLike, getProjectLikeCount,
    addComment, getCommentsByProjectId, deleteComment
};