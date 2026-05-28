// database.js (Vercel 배포용 100% 무에러 InMemory DB)
// 서버가 깨어있는 동안에는 실제 DB처럼 완벽하게 데이터가 저장되고 조회됩니다!

// ===================== 초기 임시 데이터 세팅 =====================
let users = [
    { id: 1, email: 'leader@test.com', name: '김팀장', nickname: '캡틴', joined_at: '2024-01-01T10:00:00.000Z', refresh_token: null },
    { id: 2, email: 'front@test.com', name: '이프론트', nickname: '리액트장인', joined_at: '2024-01-02T10:00:00.000Z', refresh_token: null },
    { id: 3, email: 'back@test.com', name: '박백엔드', nickname: '스프링러버', joined_at: '2024-01-03T10:00:00.000Z', refresh_token: null },
    { id: 4, email: 'design@test.com', name: '최디자인', nickname: '피그마신', joined_at: '2024-01-04T10:00:00.000Z', refresh_token: null },
    { id: 5, email: 'data@test.com', name: '정데이터', nickname: '파이썬왕', joined_at: '2024-01-05T10:00:00.000Z', refresh_token: null }
];

let portfolios = [];

let projects = [
    { PJ_ID: 1, PJ_EXPLAIN: '대학생 시간표 관리 앱 서비스 (프론트/백엔드 구함)', PJ_PROGRESS: '모집중', PJ_PROCEDURE: '오프라인 주 2회 (강남역)', PJ_VIEW_COUNT: 150, PJ_START_DE: '2024-06-01', PJ_END_DT: '2024-12-31' },
    { PJ_ID: 2, PJ_EXPLAIN: 'AI 기반 맞춤형 영양제 추천 플랫폼', PJ_PROGRESS: '진행중', PJ_PROCEDURE: '온라인 디스코드 회의', PJ_VIEW_COUNT: 85, PJ_START_DE: '2024-05-01', PJ_END_DT: '2024-10-31' },
    { PJ_ID: 3, PJ_EXPLAIN: '블록체인 스마트 컨트랙트 투표 시스템', PJ_PROGRESS: '모집완료', PJ_PROCEDURE: '온/오프라인 하이브리드', PJ_VIEW_COUNT: 42, PJ_START_DE: '2024-07-01', PJ_END_DT: '2024-11-30' },
    { PJ_ID: 4, PJ_EXPLAIN: '반려동물 산책 메이트 매칭 커뮤니티', PJ_PROGRESS: '모집중', PJ_PROCEDURE: '주말 오프라인 모임', PJ_VIEW_COUNT: 210, PJ_START_DE: '2024-06-15', PJ_END_DT: '2025-01-15' },
    { PJ_ID: 5, PJ_EXPLAIN: 'React 기반 오픈소스 UI 컴포넌트 라이브러리 제작', PJ_PROGRESS: '진행중', PJ_PROCEDURE: '비동기 깃허브 PR 방식', PJ_VIEW_COUNT: 330, PJ_START_DE: '2024-03-01', PJ_END_DT: '2024-09-30' }
];

let participants = [
    { PP_ID: 1, PJ_ID: 1, USER_ID: 1, PP_NAME: '캡틴', PP_ROLE: '팀장(기획)', PP_LEADER: 1, PP_JOIN_DT: '2024-05-01T10:00:00.000Z', PP_LEAVE_DT: null },
    { PP_ID: 2, PJ_ID: 1, USER_ID: 2, PP_NAME: '리액트장인', PP_ROLE: '프론트엔드', PP_LEADER: 0, PP_JOIN_DT: '2024-05-02T10:00:00.000Z', PP_LEAVE_DT: null },
    { PP_ID: 3, PJ_ID: 2, USER_ID: 3, PP_NAME: '스프링러버', PP_ROLE: '팀장(백엔드)', PP_LEADER: 1, PP_JOIN_DT: '2024-04-15T10:00:00.000Z', PP_LEAVE_DT: null },
    { PP_ID: 4, PJ_ID: 2, USER_ID: 5, PP_NAME: '파이썬왕', PP_ROLE: 'AI 데이터분석', PP_LEADER: 0, PP_JOIN_DT: '2024-04-16T10:00:00.000Z', PP_LEAVE_DT: null },
    { PP_ID: 5, PJ_ID: 4, USER_ID: 4, PP_NAME: '피그마신', PP_ROLE: '팀장(UI/UX)', PP_LEADER: 1, PP_JOIN_DT: '2024-06-01T10:00:00.000Z', PP_LEAVE_DT: null },
];

let likes = [
    { LIKE_ID: 1, USER_ID: 2, PJ_ID: 1 },
    { LIKE_ID: 2, USER_ID: 3, PJ_ID: 1 },
    { LIKE_ID: 3, USER_ID: 1, PJ_ID: 2 },
    { LIKE_ID: 4, USER_ID: 4, PJ_ID: 4 },
    { LIKE_ID: 5, USER_ID: 5, PJ_ID: 4 }
];

let comments = [
    // 1번 프로젝트 댓글 (1 -> 2 -> 3 뎁스 테스트용)
    { CMT_ID: 1, PJ_ID: 1, USER_ID: 3, CMT_REPLY: '프론트엔드 자리 아직 남았나요? 지원하고 싶습니다!', CMT_PA_ID: null, CMT_TIME: '2024-05-10T10:00:00.000Z' },
    { CMT_ID: 2, PJ_ID: 1, USER_ID: 1, CMT_REPLY: '네 아직 모집 중입니다! 포트폴리오 링크 주시면 확인하겠습니다.', CMT_PA_ID: 1, CMT_TIME: '2024-05-10T11:00:00.000Z' },
    { CMT_ID: 3, PJ_ID: 1, USER_ID: 3, CMT_REPLY: '감사합니다. 방금 메일로 보내드렸습니다.', CMT_PA_ID: 2, CMT_TIME: '2024-05-10T12:00:00.000Z' },
    // 기타 프로젝트 댓글
    { CMT_ID: 4, PJ_ID: 2, USER_ID: 2, CMT_REPLY: '영양제 데이터 수집은 어떤 방식으로 진행하시나요?', CMT_PA_ID: null, CMT_TIME: '2024-05-11T10:00:00.000Z' },
    { CMT_ID: 5, PJ_ID: 4, USER_ID: 5, CMT_REPLY: '아이디어가 너무 좋네요! 런칭하시면 꼭 써보겠습니다.', CMT_PA_ID: null, CMT_TIME: '2024-05-12T10:00:00.000Z' }
];

// 데이터가 5개씩 들어갔으므로, 다음 ID는 6부터 시작하도록 설정합니다.
let userIdCounter = 6;
let portfolioIdCounter = 1;
let projectIdCounter = 6;
let participantIdCounter = 6;
let likeIdCounter = 6;
let commentIdCounter = 6;


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
    return Promise.resolve(participants.some(p => p.PJ_ID == projectId && p.USER_ID == userId && p.PP_LEADER === 1));
};

const createProject = (userId, nickname, data) => {
    return new Promise((resolve) => {
        const newProject = {
            PJ_ID: projectIdCounter++,
            PJ_EXPLAIN: data.PJ_EXPLAIN || '',
            PJ_PROGRESS: data.PJ_PROGRESS || '모집중',
            PJ_PROCEDURE: data.PJ_PROCEDURE || '',
            PJ_VIEW_COUNT: 0,
            PJ_START_DE: data.PJ_START_DE || null,
            PJ_END_DT: data.PJ_END_DT || null
        };
        projects.push(newProject);

        participants.push({
            PP_ID: participantIdCounter++,
            PJ_ID: newProject.PJ_ID,
            USER_ID: userId,
            PP_NAME: nickname,
            PP_ROLE: '팀장',
            PP_LEADER: 1,
            PP_JOIN_DT: new Date().toISOString(),
            PP_LEAVE_DT: null
        });

        resolve(newProject.PJ_ID);
    });
};

const getAllProjects = () => {
    return Promise.resolve([...projects].reverse());
};

const updateProject = async (projectId, userId, updateData) => {
    const isLeader = await checkIsLeader(projectId, userId);
    if (!isLeader) throw new Error("FORBIDDEN: 팀장만 프로젝트를 수정할 수 있습니다.");

    return new Promise((resolve) => {
        const project = projects.find(p => p.PJ_ID == projectId);
        if (project) {
            if (updateData.PJ_EXPLAIN !== undefined) project.PJ_EXPLAIN = updateData.PJ_EXPLAIN;
            if (updateData.PJ_PROGRESS !== undefined) project.PJ_PROGRESS = updateData.PJ_PROGRESS;
            if (updateData.PJ_PROCEDURE !== undefined) project.PJ_PROCEDURE = updateData.PJ_PROCEDURE;
            if (updateData.PJ_START_DE !== undefined) project.PJ_START_DE = updateData.PJ_START_DE;
            if (updateData.PJ_END_DT !== undefined) project.PJ_END_DT = updateData.PJ_END_DT;
            resolve(1);
        } else resolve(0);
    });
};

const deleteProject = async (projectId, userId) => {
    const isLeader = await checkIsLeader(projectId, userId);
    if (!isLeader) throw new Error("FORBIDDEN: 팀장만 프로젝트를 삭제할 수 있습니다.");

    return new Promise((resolve) => {
        const initialLength = projects.length;
        projects = projects.filter(p => p.PJ_ID != projectId);
        participants = participants.filter(p => p.PJ_ID != projectId);
        likes = likes.filter(l => l.PJ_ID != projectId);
        comments = comments.filter(c => c.PJ_ID != projectId);
        resolve(initialLength - projects.length);
    });
};

const joinProject = (projectId, userId, nickname, role) => {
    return new Promise((resolve) => {
        const newParticipant = {
            PP_ID: participantIdCounter++,
            PJ_ID: projectId,
            USER_ID: userId,
            PP_NAME: nickname,
            PP_ROLE: role,
            PP_LEADER: 0,
            PP_JOIN_DT: new Date().toISOString(),
            PP_LEAVE_DT: null
        };
        participants.push(newParticipant);
        resolve(newParticipant.PP_ID);
    });
};

const leaveProject = (projectId, userId) => {
    return new Promise((resolve) => {
        const initialLength = participants.length;
        participants = participants.filter(p => !(p.PJ_ID == projectId && p.USER_ID == userId));
        resolve(initialLength - participants.length);
    });
};

// ===================== Likes =====================
const toggleLike = (userId, projectId) => {
    return new Promise((resolve) => {
        const existingIndex = likes.findIndex(l => l.USER_ID == userId && l.PJ_ID == projectId);
        if (existingIndex !== -1) {
            likes.splice(existingIndex, 1);
            resolve({ isLiked: false });
        } else {
            likes.push({ LIKE_ID: likeIdCounter++, USER_ID: userId, PJ_ID: projectId });
            resolve({ isLiked: true });
        }
    });
};

const getProjectLikeCount = (projectId) => {
    return Promise.resolve(likes.filter(l => l.PJ_ID == projectId).length);
};

// ===================== Comments =====================
const addComment = (projectId, userId, cmtReply, parentId = null) => {
    return new Promise((resolve, reject) => {
        if (parentId) {
            const parent = comments.find(c => c.CMT_ID == parentId);
            if (!parent) return reject(new Error("부모 댓글이 존재하지 않습니다."));

            if (parent.CMT_PA_ID) {
                const grandParent = comments.find(c => c.CMT_ID == parent.CMT_PA_ID);
                if (grandParent && grandParent.CMT_PA_ID) {
                    return reject(new Error("DEPTH_LIMIT: 댓글은 최대 3단계(대대댓글)까지만 작성할 수 있습니다."));
                }
            }
        }

        const newComment = {
            CMT_ID: commentIdCounter++,
            PJ_ID: projectId,
            USER_ID: userId,
            CMT_REPLY: cmtReply,
            CMT_PA_ID: parentId,
            CMT_TIME: new Date().toISOString()
        };
        comments.push(newComment);
        resolve(newComment.CMT_ID);
    });
};

const getCommentsByProjectId = (projectId) => {
    return new Promise((resolve) => {
        const projectComments = comments.filter(c => c.PJ_ID == projectId).map(c => {
            const user = users.find(u => u.id == c.USER_ID);
            return { ...c, nickname: user ? user.nickname : "알 수 없음" };
        });
        resolve(projectComments);
    });
};

const deleteComment = (commentId, userId) => {
    return new Promise((resolve) => {
        const initialLength = comments.length;
        comments = comments.filter(c => !(c.CMT_ID == commentId && c.USER_ID == userId));
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