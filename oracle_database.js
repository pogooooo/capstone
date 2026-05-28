require('dotenv').config();
const oracledb = require('oracledb');

oracledb.fetchAsBuffer = [oracledb.BLOB];

process.env.TNS_ADMIN = process.env.ORACLE_WALLET_LOCATION;

const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_URI,
    walletLocation: process.env.ORACLE_WALLET_LOCATION,
    configDir: process.env.ORACLE_WALLET_LOCATION,
    walletPassword: process.env.ORACLE_WALLET_PASSWORD
};

const saveUser = async (userData) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const checkUser = await connection.execute(
            `SELECT USER_ID FROM ADMIN.TBL_USER WHERE USER_EMAIL = :email`,
            { email: userData.email },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        if (checkUser.rows.length > 0) return checkUser.rows[0].USER_ID;

        let finalNickname = userData.nickname;
        let isUnique = false;
        let counter = 0;

        while (!isUnique) {
            const checkNick = await connection.execute(
                `SELECT 1 FROM ADMIN.TBL_USER WHERE USER_NICK = :nick`,
                { nick: finalNickname }
            );
            if (checkNick.rows.length === 0) {
                isUnique = true;
            } else {
                counter++;
                finalNickname = `${userData.nickname}${counter}`;
            }
        }

        const tempUserId = Math.floor(Math.random() * 1000000).toString();
        const sql = `
            INSERT INTO ADMIN.TBL_USER (USER_ID, USER_NAME, USER_NICK, USER_SIGNON_DT, USER_EMAIL, USER_CPU)
            VALUES (:id, :name, :nick, TO_CHAR(SYSDATE, 'YYYYMMDD'), :email, 50.0)
        `;
        await connection.execute(sql, {
            id: tempUserId,
            name: userData.name,
            nick: finalNickname,
            email: userData.email
        }, { autoCommit: true });

        return tempUserId;
    } catch (err) {
        throw err;
    } finally {
        if (connection) await connection.close();
    }
};

const updateRefreshToken = async (email, token) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `UPDATE ADMIN.TBL_USER SET USER_JWT = :token WHERE USER_EMAIL = :email`;
        await connection.execute(sql, { token: token, email: email }, { autoCommit: true });
    } finally {
        if (connection) await connection.close();
    }
};

const getUserByRefreshToken = async (token) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT USER_ID, USER_NAME, USER_NICK, USER_EMAIL, USER_JWT, USER_CPU FROM ADMIN.TBL_USER WHERE USER_JWT = :token`;
        const result = await connection.execute(sql, { token: token }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if (result.rows.length > 0) {
            const row = result.rows[0];
            return { id: row.USER_ID, email: row.USER_EMAIL, name: row.USER_NAME, nickname: row.USER_NICK, refresh_token: row.USER_JWT, cpu: row.USER_CPU };
        }
        return null;
    } finally {
        if (connection) await connection.close();
    }
};

const removeRefreshToken = async (email) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `UPDATE ADMIN.TBL_USER SET USER_JWT = NULL WHERE USER_EMAIL = :email`;
        await connection.execute(sql, { email: email }, { autoCommit: true });
    } finally {
        if (connection) await connection.close();
    }
};

const getUserByEmail = async (email) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT USER_ID, USER_NAME, USER_NICK, USER_EMAIL, USER_JWT, USER_CPU FROM ADMIN.TBL_USER WHERE USER_EMAIL = :email`;
        const result = await connection.execute(sql, { email: email }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if (result.rows.length > 0) {
            const row = result.rows[0];
            return { id: row.USER_ID, email: row.USER_EMAIL, name: row.USER_NAME, nickname: row.USER_NICK, refresh_token: row.USER_JWT, cpu: row.USER_CPU };
        }
        return null;
    } finally {
        if (connection) await connection.close();
    }
};

const updateUser = async (email, name, nickname) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        if (nickname) {
            const checkNick = await connection.execute(
                `SELECT USER_EMAIL FROM ADMIN.TBL_USER WHERE USER_NICK = :nick`,
                { nick: nickname }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );
            if (checkNick.rows.length > 0 && checkNick.rows[0].USER_EMAIL !== email) throw new Error("DUPLICATE_NICKNAME");
        }
        const sql = `UPDATE ADMIN.TBL_USER SET USER_NAME = NVL(:name, USER_NAME), USER_NICK = NVL(:nick, USER_NICK) WHERE USER_EMAIL = :email`;
        const result = await connection.execute(sql, { name: name || null, nick: nickname || null, email: email }, { autoCommit: true });
        return result.rowsAffected;
    } finally {
        if (connection) await connection.close();
    }
};

const deleteUser = async (email) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `DELETE FROM ADMIN.TBL_USER WHERE USER_EMAIL = :email`;
        const result = await connection.execute(sql, { email: email }, { autoCommit: true });
        return result.rowsAffected;
    } finally {
        if (connection) await connection.close();
    }
};

const checkIsLeader = async (projectId, userId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT 1 FROM ADMIN.TBL_PARTICIPANT WHERE PJ_ID = :pjId AND USER_ID = :userId AND PP_LEADER = 1`;
        const result = await connection.execute(sql, { pjId: projectId, userId: userId });
        return result.rows.length > 0;
    } finally {
        if (connection) await connection.close();
    }
};

const convertToBuffer = (imgData) => {
    if (!imgData) return null;
    if (typeof imgData === 'string' && imgData.startsWith('data:image')) {
        const base64Data = imgData.split(',')[1];
        return Buffer.from(base64Data, 'base64');
    }
    return null;
};

const createProject = async (projectData) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const newProjectId = Math.floor(Math.random() * 10000000);
        const newParticipantId = Math.floor(Math.random() * 10000000);

        const projectSql = `
            INSERT INTO ADMIN.TBL_PROJECT 
            (PJ_ID, PJ_TITLE, PJ_INTRODUCE, PJ_EXPLAIN, PJ_PROGRESS, PJ_BUDGET, PJ_PROCEDURE, PJ_START_DT, PJ_DEADLINE, PJ_END_DT, PJ_VIEW_COUNT) 
            VALUES (:new_id, :title, :introduce, :explain, :progress, :budget, :procedure, :startDt, :deadline, :endDt, 0)
        `;

        const binds = {
            new_id: newProjectId,
            title: projectData.PJ_TITLE,
            introduce: projectData.PJ_INTRODUCE || null,
            explain: projectData.PJ_EXPLAIN,
            progress: projectData.PJ_PROGRESS,
            budget: projectData.PJ_BUDGET || 0,
            procedure: projectData.PJ_PROCEDURE,
            startDt: projectData.PJ_START_DT,
            deadline: projectData.PJ_DEADLINE || null,
            endDt: projectData.PJ_END_DT || null
        };

        await connection.execute(projectSql, binds, { autoCommit: false });

        const participantSql = `
            INSERT INTO ADMIN.TBL_PARTICIPANT (PP_ID, PJ_ID, PP_NAME, PP_LEADER, PP_JOIN_DT, USER_ID, PP_ROLE) 
            VALUES (:ppId, :pjId, :name, 1, TO_CHAR(SYSDATE, 'YYYYMMDD'), :userId, '팀장')
        `;
        await connection.execute(participantSql, {
            ppId: newParticipantId,
            pjId: newProjectId,
            name: projectData.USER_NICKNAME,
            userId: projectData.USER_ID
        }, { autoCommit: false });

        if (projectData.positions && projectData.positions.length > 0) {
            const roleSql = `
                INSERT INTO ADMIN.TBL_PROJECT_ROLE (PJ_ID, PR_ROLE, PR_HEADCOUNT, PR_SHORT_COMMENT, UR_JOB_ID)
                VALUES (:pjId, :role, :headcount, :shortComment, :jobId)
            `;

            for (const pos of projectData.positions) {
                await connection.execute(roleSql, {
                    pjId: newProjectId,
                    role: pos.role,
                    headcount: pos.count,
                    shortComment: pos.description,
                    jobId: pos.ur_job_id || null // 프론트에서 콤마(,)로 연결된 아이디 문자열 수신
                }, { autoCommit: false });
            }
        }

        await connection.commit();
        return { projectId: newProjectId };

    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

const getAllProjects = async (userId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `
            SELECT P.PJ_ID, P.PJ_TITLE, P.PJ_INTRODUCE, P.PJ_EXPLAIN, P.PJ_PROGRESS, P.PJ_BUDGET, P.PJ_PROCEDURE, 
                   P.PJ_VIEW_COUNT, P.PJ_START_DT, P.PJ_END_DT, P.PJ_DEADLINE, P.PJ_IMAGE,
                   CASE WHEN S.SCRAP_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_LIKED,
                   CASE WHEN PP.PP_ID IS NOT NULL THEN 1 ELSE 0 END AS IS_PARTICIPATING,
                   PP.PP_ROLE AS MY_ROLE
            FROM ADMIN.TBL_PROJECT P
                     LEFT JOIN ADMIN.TBL_SCRAP S ON P.PJ_ID = S.PJ_ID AND S.USER_ID = :userId
                     LEFT JOIN ADMIN.TBL_PARTICIPANT PP ON P.PJ_ID = PP.PJ_ID AND PP.USER_ID = :userId
            ORDER BY P.PJ_ID DESC
        `;
        const result = await connection.execute(sql, { userId: String(userId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows.map(row => {
            if (row.PJ_IMAGE && Buffer.isBuffer(row.PJ_IMAGE)) {
                row.PJ_IMAGE = `data:image/jpeg;base64,${row.PJ_IMAGE.toString('base64')}`;
            }
            return row;
        });
    } finally {
        if (connection) await connection.close();
    }
};

const getProjectById = async (projectId, userId = null) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const projectSql = `SELECT * FROM ADMIN.TBL_PROJECT WHERE PJ_ID = :id`;
        const projectResult = await connection.execute(projectSql, { id: Number(projectId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (projectResult.rows.length === 0) return null;
        const project = projectResult.rows[0];

        if (project.PJ_IMAGE && Buffer.isBuffer(project.PJ_IMAGE)) {
            project.PJ_IMAGE = `data:image/jpeg;base64,${project.PJ_IMAGE.toString('base64')}`;
        }

        const leaderSql = `SELECT * FROM ADMIN.TBL_PARTICIPANT P JOIN ADMIN.TBL_USER U ON P.USER_ID = U.USER_ID WHERE P.PJ_ID = :id AND P.PP_LEADER = 1`;
        const leaderResult = await connection.execute(leaderSql, { id: Number(projectId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        project.leader = leaderResult.rows.length > 0 ? leaderResult.rows[0] : null;

        // 🔥 JOIN을 제거하고, 콤마로 연결된 데이터를 그대로 가져오도록 수정
        const roleSql = `
            SELECT
                PR_ROLE AS "role",
                PR_HEADCOUNT AS "count",
                PR_SHORT_COMMENT AS "description",
                UR_JOB_ID AS "ur_job_id"
            FROM ADMIN.TBL_PROJECT_ROLE
            WHERE PJ_ID = :id
        `;
        const roleResult = await connection.execute(roleSql, { id: Number(projectId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        project.positions = roleResult.rows;

        if (userId) {
            const likeSql = `SELECT COUNT(*) AS IS_LIKED FROM ADMIN.TBL_SCRAP WHERE PJ_ID = :pjId AND USER_ID = :userId`;
            const likeResult = await connection.execute(likeSql, { pjId: Number(projectId), userId: String(userId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
            project.IS_LIKED = likeResult.rows[0].IS_LIKED;
        }

        return project;
    } finally {
        if (connection) await connection.close();
    }
};

const getProjectLeader = async (projectId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `
            SELECT P.PP_NAME, P.PP_ROLE, U.USER_CPU, U.USER_EMAIL
            FROM ADMIN.TBL_PARTICIPANT P
            JOIN ADMIN.TBL_USER U ON P.USER_ID = U.USER_ID
            WHERE P.PJ_ID = :pjId AND P.PP_LEADER = 1
        `;
        const result = await connection.execute(sql, { pjId: Number(projectId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        if (result.rows && result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } finally {
        if (connection) await connection.close();
    }
};

const updateProject = async (projectId, userId, updateData) => {
    const isLeader = await checkIsLeader(projectId, userId);
    if (!isLeader) throw new Error("FORBIDDEN: 팀장만 프로젝트를 수정할 수 있습니다.");

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        let setClauses = [];
        let binds = { id: projectId };

        if (updateData.PJ_TITLE !== undefined) { setClauses.push('PJ_TITLE = :title'); binds.title = updateData.PJ_TITLE; }
        if (updateData.PJ_INTRODUCE !== undefined) { setClauses.push('PJ_INTRODUCE = :introduce'); binds.introduce = updateData.PJ_INTRODUCE; }
        if (updateData.PJ_DEADLINE !== undefined) {
            setClauses.push('PJ_DEADLINE = :deadline');
            binds.deadline = updateData.PJ_DEADLINE ? updateData.PJ_DEADLINE.replace(/-/g, '') : null;
        }
        if (updateData.PJ_IMAGE !== undefined) {
            setClauses.push('PJ_IMAGE = :image');
            binds.image = convertToBuffer(updateData.PJ_IMAGE);
        }

        if (updateData.PJ_EXPLAIN !== undefined) { setClauses.push('PJ_EXPLAIN = :explain'); binds.explain = updateData.PJ_EXPLAIN; }
        if (updateData.PJ_PROGRESS !== undefined) { setClauses.push('PJ_PROGRESS = :progress'); binds.progress = updateData.PJ_PROGRESS; }
        if (updateData.PJ_BUDGET !== undefined) { setClauses.push('PJ_BUDGET = :budget'); binds.budget = updateData.PJ_BUDGET; }
        if (updateData.PJ_PROCEDURE !== undefined) { setClauses.push('PJ_PROCEDURE = :procedure'); binds.procedure = updateData.PJ_PROCEDURE; }
        if (updateData.PJ_START_DT !== undefined) {
            setClauses.push('PJ_START_DT = :startDt');
            binds.startDt = updateData.PJ_START_DT ? updateData.PJ_START_DT.replace(/-/g, '') : null;
        }
        if (updateData.PJ_END_DT !== undefined) {
            setClauses.push('PJ_END_DT = :endDt');
            binds.endDt = updateData.PJ_END_DT ? updateData.PJ_END_DT.replace(/-/g, '') : null;
        }

        if (setClauses.length === 0) return 0;

        const sql = `UPDATE ADMIN.TBL_PROJECT SET ${setClauses.join(', ')} WHERE PJ_ID = :id`;
        const result = await connection.execute(sql, binds, { autoCommit: true });
        return result.rowsAffected;
    } finally {
        if (connection) await connection.close();
    }
};

const deleteProject = async (projectId, userId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        await connection.execute(`DELETE FROM ADMIN.TBL_PARTICIPANT WHERE PJ_ID = :id`, { id: projectId }, { autoCommit: false });
        await connection.execute(`DELETE FROM ADMIN.TBL_SCRAP WHERE PJ_ID = :id`, { id: projectId }, { autoCommit: false });
        await connection.execute(`DELETE FROM ADMIN.TBL_COMMENT WHERE PJ_ID = :id`, { id: projectId }, { autoCommit: false });
        await connection.execute(`DELETE FROM ADMIN.TBL_PROJECT_ROLE WHERE PJ_ID = :id`, { id: projectId }, { autoCommit: false });

        const sql = `DELETE FROM ADMIN.TBL_PROJECT WHERE PJ_ID = :id`;
        const result = await connection.execute(sql, { id: projectId }, { autoCommit: false });

        await connection.commit();
        return result.rowsAffected;
    } catch (error) {
        if (connection) await connection.rollback();
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

const joinProject = async (projectId, userId, nickname, role) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const tempParticipantId = Math.floor(Math.random() * 1000000);
        const sql = `
            INSERT INTO ADMIN.TBL_PARTICIPANT 
            (PP_ID, PJ_ID, USER_ID, PP_NAME, PP_ROLE, PP_LEADER, PP_JOIN_DT)
            VALUES 
            (:ppId, :pjId, :userId, :ppName, :role, 0, TO_CHAR(SYSDATE, 'YYYYMMDD'))
        `;
        await connection.execute(sql, {
            ppId: tempParticipantId,
            pjId: projectId,
            userId: userId,
            ppName: nickname,
            role: role
        }, { autoCommit: true });

        return tempParticipantId;
    } finally {
        if (connection) await connection.close();
    }
};

const leaveProject = async (projectId, userId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `DELETE FROM ADMIN.TBL_PARTICIPANT WHERE PJ_ID = :pjId AND USER_ID = :userId`;
        const result = await connection.execute(sql, { pjId: projectId, userId: userId }, { autoCommit: true });
        return result.rowsAffected;
    } finally {
        if (connection) await connection.close();
    }
};

const addComment = async (projectId, userId, cmtReply, parentId = null) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        if (parentId) {
            const sqlCheckParent = `SELECT CMT_PA_ID FROM ADMIN.TBL_COMMENT WHERE CMT_ID = :parentId`;
            const parentResult = await connection.execute(sqlCheckParent, { parentId: parentId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

            if (parentResult.rows.length === 0) {
                throw new Error("부모 댓글이 존재하지 않습니다.");
            }

            const grandParentId = parentResult.rows[0].CMT_PA_ID;
            if (grandParentId) {
                const sqlCheckGrandParent = `SELECT CMT_PA_ID FROM ADMIN.TBL_COMMENT WHERE CMT_ID = :grandParentId`;
                const grandParentResult = await connection.execute(sqlCheckGrandParent, { grandParentId: grandParentId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

                if (grandParentResult.rows.length > 0 && grandParentResult.rows[0].CMT_PA_ID) {
                    throw new Error("DEPTH_LIMIT");
                }
            }
        }

        const tempCommentId = Math.floor(Math.random() * 1000000);

        const sql = `
            INSERT INTO ADMIN.TBL_COMMENT 
            (CMT_ID, PJ_ID, USER_ID, CMT_REPLY, CMT_TIME, CMT_PA_ID)
            VALUES 
            (:cmtId, :pjId, :userId, :reply, SYSDATE, :parentId)
        `;

        await connection.execute(sql, {
            cmtId: tempCommentId,
            pjId: projectId,
            userId: userId,
            reply: cmtReply,
            parentId: parentId
        }, { autoCommit: true });

        return tempCommentId;
    } finally {
        if (connection) await connection.close();
    }
};

const getCommentsByProjectId = async (projectId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `
            SELECT C.CMT_ID, C.PJ_ID, C.USER_ID, C.CMT_REPLY, C.CMT_TIME, C.CMT_PA_ID, U.USER_NICK AS nickname
            FROM ADMIN.TBL_COMMENT C
            LEFT JOIN ADMIN.TBL_USER U ON C.USER_ID = U.USER_ID
            WHERE C.PJ_ID = :pjId
            ORDER BY C.CMT_TIME ASC
        `;
        const result = await connection.execute(sql, { pjId: Number(projectId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
};

const deleteComment = async (commentId, userId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `DELETE FROM ADMIN.TBL_COMMENT WHERE CMT_ID = :cmtId AND USER_ID = :userId`;
        const result = await connection.execute(sql, { cmtId: commentId, userId: userId }, { autoCommit: true });
        return result.rowsAffected;
    } finally {
        if (connection) await connection.close();
    }
};

const toggleLike = async (userId, projectId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const checkSql = `SELECT SCRAP_ID FROM ADMIN.TBL_SCRAP WHERE USER_ID = :userId AND PJ_ID = :pjId`;
        const checkResult = await connection.execute(checkSql, {
            userId: String(userId),
            pjId: Number(projectId)
        });

        if (checkResult.rows.length > 0) {
            const deleteSql = `DELETE FROM ADMIN.TBL_SCRAP WHERE USER_ID = :userId AND PJ_ID = :pjId`;
            await connection.execute(deleteSql, {
                userId: String(userId),
                pjId: Number(projectId)
            }, { autoCommit: true });

            return { isLiked: false };
        } else {
            const tempScrapId = Math.floor(Math.random() * 1000000);
            const insertSql = `
                INSERT INTO ADMIN.TBL_SCRAP (SCRAP_ID, USER_ID, PJ_ID) 
                VALUES (:scrapId, :userId, :pjId)
            `;
            await connection.execute(insertSql, {
                scrapId: tempScrapId,
                userId: String(userId),
                pjId: Number(projectId)
            }, { autoCommit: true });

            return { isLiked: true };
        }
    } finally {
        if (connection) await connection.close();
    }
};

const getProjectLikeCount = async (projectId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT COUNT(*) AS SCRAP_COUNT FROM ADMIN.TBL_SCRAP WHERE PJ_ID = :pjId`;
        const result = await connection.execute(sql, {
            pjId: Number(projectId)
        }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows[0].SCRAP_COUNT;
    } finally {
        if (connection) await connection.close();
    }
};

const getPortfolioByUserId = async (userId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `
            SELECT PF_ID, USER_ID, PF_URL, PF_TECH, PF_IMG1, PF_IMG2, PF_IMG3, PF_INTRODUCTION
            FROM ADMIN.TBL_PORTFOLIO
            WHERE USER_ID = :userId
        `;
        const result = await connection.execute(sql, { userId: String(userId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows && result.rows.length > 0) {
            const row = result.rows[0];

            if (row.PF_IMG1 && Buffer.isBuffer(row.PF_IMG1)) row.PF_IMG1 = `data:image/jpeg;base64,${row.PF_IMG1.toString('base64')}`;
            if (row.PF_IMG2 && Buffer.isBuffer(row.PF_IMG2)) row.PF_IMG2 = `data:image/jpeg;base64,${row.PF_IMG2.toString('base64')}`;
            if (row.PF_IMG3 && Buffer.isBuffer(row.PF_IMG3)) row.PF_IMG3 = `data:image/jpeg;base64,${row.PF_IMG3.toString('base64')}`;

            const awardSql = `
                SELECT PF_AWARD, PF_AWARD_DETAIL 
                FROM ADMIN.TBL_AWARD_INFO 
                WHERE PF_ID = :pfId 
                ORDER BY AW_ID ASC
            `;
            const awardResult = await connection.execute(awardSql, { pfId: row.PF_ID }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

            if (awardResult.rows && awardResult.rows.length > 0) {
                row.PF_AWARD = awardResult.rows.map(a => a.PF_AWARD).join('|');
                row.PF_AWARD_DETAIL = awardResult.rows.map(a => a.PF_AWARD_DETAIL).join('|');
            } else {
                row.PF_AWARD = '';
                row.PF_AWARD_DETAIL = '';
            }

            const projectSql = `
                SELECT P.PJ_TITLE, P.PJ_START_DT, P.PJ_END_DT, PP.PP_ROLE
                FROM ADMIN.TBL_PROJECT P
                JOIN ADMIN.TBL_PARTICIPANT PP ON P.PJ_ID = PP.PJ_ID
                WHERE PP.USER_ID = :userId
                ORDER BY P.PJ_START_DT DESC
            `;
            const projectResult = await connection.execute(projectSql, { userId: String(userId) }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

            row.participatedProjects = projectResult.rows;

            return row;
        }
        return null;
    } finally {
        if (connection) await connection.close();
    }
};

const upsertPortfolio = async (userId, data) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const checkSql = `SELECT PF_ID FROM ADMIN.TBL_PORTFOLIO WHERE USER_ID = :userId`;
        const checkResult = await connection.execute(checkSql, { userId: String(userId) });

        const convertToBuffer = (imgData) => {
            if (!imgData) return null;
            if (typeof imgData === 'string' && imgData.startsWith('data:image')) {
                const base64Data = imgData.split(',')[1];
                return Buffer.from(base64Data, 'base64');
            }
            return null;
        };

        const img1Buf = convertToBuffer(data.image_1);
        const img2Buf = convertToBuffer(data.image_2);
        const img3Buf = convertToBuffer(data.image_3);

        let currentPfId;

        if (checkResult.rows.length > 0) {
            currentPfId = checkResult.rows[0][0];

            const updateSql = `
                UPDATE ADMIN.TBL_PORTFOLIO 
                SET PF_URL = :url, PF_TECH = :tech, 
                    PF_IMG1 = :img1, PF_IMG2 = :img2, PF_IMG3 = :img3,
                    PF_INTRODUCTION = :introduction
                WHERE USER_ID = :userId
            `;
            await connection.execute(updateSql, {
                userId: String(userId),
                url: data.external_link || null,
                tech: data.tech_stack || null,
                img1: img1Buf,
                img2: img2Buf,
                img3: img3Buf,
                introduction: data.introduction || null
            }, { autoCommit: false });

            await connection.execute(
                `DELETE FROM ADMIN.TBL_AWARD_INFO WHERE PF_ID = :pfId`,
                { pfId: currentPfId },
                { autoCommit: false }
            );

        } else {
            currentPfId = Math.floor(Math.random() * 1000000);
            const insertSql = `
                INSERT INTO ADMIN.TBL_PORTFOLIO 
                (PF_ID, USER_ID, PF_URL, PF_TECH, PF_IMG1, PF_IMG2, PF_IMG3, PF_INTRODUCTION)
                VALUES 
                (:pfId, :userId, :url, :tech, :img1, :img2, :img3, :introduction)
            `;
            await connection.execute(insertSql, {
                pfId: currentPfId,
                userId: String(userId),
                url: data.external_link || null,
                tech: data.tech_stack || null,
                img1: img1Buf,
                img2: img2Buf,
                img3: img3Buf,
                introduction: data.introduction || null
            }, { autoCommit: false });
        }

        if (data.awards) {
            const titles = data.awards.split('|');
            const details = data.award_detail ? data.award_detail.split('|') : [];

            for (let i = 0; i < titles.length; i++) {
                const title = titles[i].trim();
                if (title) {
                    const tempAwId = Math.floor(Math.random() * 10000000);
                    const detail = details[i] || '';

                    await connection.execute(`
                        INSERT INTO ADMIN.TBL_AWARD_INFO (AW_ID, PF_ID, USER_ID, PF_AWARD, PF_AWARD_DETAIL)
                        VALUES (:awId, :pfId, :userId, :award, :detail)
                    `, {
                        awId: tempAwId,
                        pfId: currentPfId,
                        userId: String(userId),
                        award: title,
                        detail: detail
                    }, { autoCommit: false });
                }
            }
        }

        await connection.commit();
        return currentPfId;
    } catch (error) {
        if (connection) {
            try { await connection.rollback(); } catch (e) { console.error(e); }
        }
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

const deletePortfolio = async (userId) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(`DELETE FROM ADMIN.TBL_AWARD_INFO WHERE USER_ID = :userId`, { userId: String(userId) }, { autoCommit: false });
        const result = await connection.execute(`DELETE FROM ADMIN.TBL_PORTFOLIO WHERE USER_ID = :userId`, { userId: String(userId) }, { autoCommit: true });

        return result.rowsAffected;
    } catch (error) {
        if (connection) {
            try { await connection.rollback(); } catch (e) { console.error(e); }
        }
        throw error;
    } finally {
        if (connection) await connection.close();
    }
};

const getAllTechRoles = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql = `SELECT * FROM ADMIN.TBL_USER_ROLE`;
        const result = await connection.execute(sql, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows;
    } finally {
        if (connection) await connection.close();
    }
};

module.exports = {
    saveUser, updateRefreshToken, getUserByRefreshToken, removeRefreshToken,
    getUserByEmail, updateUser, deleteUser,
    createProject, getAllProjects, getProjectById, getProjectLeader,
    updateProject, deleteProject, joinProject, leaveProject,
    addComment, getCommentsByProjectId, deleteComment,
    toggleLike, getProjectLikeCount,
    getPortfolioByUserId, upsertPortfolio, deletePortfolio,
    getAllTechRoles
};