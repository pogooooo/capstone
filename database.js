const sqlite3 = require('sqlite3').verbose();
// const path = require('path');
//
// const dbPath = path.resolve(__dirname, 'database.sqlite');
// const db = new sqlite3.Database(dbPath);

const db = new sqlite3.Database(':memory:');

db.serialize(() => {

    db.run("PRAGMA foreign_keys = ON");

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        nickname TEXT NOT NULL,
        password TEXT,
        refresh_token TEXT,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP)
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS portfolios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER UNIQUE NOT NULL,
          external_link TEXT,
          trust_score REAL DEFAULT 50.0,
          awards TEXT,
          tech_stack TEXT,
          image_1 TEXT,
          image_2 TEXT,
          image_3 TEXT,
          FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT,
            budget TEXT,
            work_method TEXT,
            views INTEGER DEFAULT 0,
            start_date TEXT,
            end_date TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS project_participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            nickname TEXT NOT NULL,
            role TEXT,
            is_leader INTEGER DEFAULT 0,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            left_at DATETIME,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS likes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            project_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
            UNIQUE(user_id, project_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS project_comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            parent_id INTEGER,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(parent_id) REFERENCES project_comments(id) ON DELETE CASCADE
        )
    `);
});

const saveUser = (userData) => {
    return new Promise((resolve, reject) => {
        const { email, name, nickname } = userData;

        const query = `
      INSERT INTO users (email, name, nickname)
      VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        nickname = excluded.nickname
    `;

        db.run(query, [email, name, nickname], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

const updateRefreshToken = (email, token) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE users SET refresh_token = ? WHERE email = ?`;
        db.run(query, [token, email], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const getUserByRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM users WHERE refresh_token = ?`;
        db.get(query, [token], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const removeRefreshToken = (email) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE users SET refresh_token = NULL WHERE email = ?`;
        db.run(query, [email], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT id, email, name, nickname, joined_at, refresh_token FROM users WHERE email = ?`;
        db.get(query, [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const updateUser = (email, name, nickname) => {
    return new Promise((resolve, reject) => {
        let fields = [];
        let params = [];

        if (name) {
            fields.push("name = ?");
            params.push(name);
        }
        if (nickname) {
            fields.push("nickname = ?");
            params.push(nickname);
        }

        if (fields.length === 0) return resolve(0); // 수정할 내용이 없으면 패스

        const query = `UPDATE users SET ${fields.join(', ')} WHERE email = ?`;
        params.push(email);

        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

const deleteUser = (email) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM users WHERE email = ?`;
        db.run(query, [email], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

const getPortfolioByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM portfolios WHERE user_id = ?`;
        db.get(query, [userId], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const upsertPortfolio = (userId, portfolioData) => {
    return new Promise((resolve, reject) => {
        const { external_link, awards, tech_stack, image_1, image_2, image_3 } = portfolioData;

        const query = `
            INSERT INTO portfolios (user_id, external_link, awards, tech_stack, image_1, image_2, image_3)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                external_link = excluded.external_link,
                awards = excluded.awards,
                tech_stack = excluded.tech_stack,
                image_1 = excluded.image_1,
                image_2 = excluded.image_2,
                image_3 = excluded.image_3
        `;

        db.run(query, [userId, external_link, awards, tech_stack, image_1, image_2, image_3], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

const updateTrustScore = (userId, scoreToAdd) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE portfolios SET trust_score = trust_score + ? WHERE user_id = ?`;
        db.run(query, [scoreToAdd, userId], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

const deletePortfolio = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM portfolios WHERE user_id = ?`;
        db.run(query, [userId], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

const checkIsLeader = (projectId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT is_leader FROM project_participants WHERE project_id = ? AND user_id = ?`;
        db.get(query, [projectId, userId], (err, row) => {
            if (err) reject(err);
            else resolve(row ? row.is_leader === 1 : false);
        });
    });
};

const createProject = (userId, nickname, projectData) => {
    return new Promise((resolve, reject) => {
        const { title, description, status, budget, work_method, start_date, end_date } = projectData;

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // 프로젝트 정보 저장
            const projectQuery = `
                INSERT INTO projects (title, description, status, budget, work_method, start_date, end_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(projectQuery, [title, description, status, budget, work_method, start_date, end_date], function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return reject(err);
                }

                const projectId = this.lastID;

                // 생성자를 팀장(is_leader: 1)으로 참가자 테이블에 추가
                const participantQuery = `
                    INSERT INTO project_participants (project_id, user_id, nickname, role, is_leader)
                    VALUES (?, ?, ?, '팀장', 1)
                `;

                db.run(participantQuery, [projectId, userId, nickname], function(err2) {
                    if (err2) {
                        db.run('ROLLBACK');
                        return reject(err2);
                    }
                    db.run('COMMIT');
                    resolve(projectId);
                });
            });
        });
    });
};

const getAllProjects = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM projects ORDER BY id DESC`;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const updateProject = async (projectId, userId, updateData) => {
    const isLeader = await checkIsLeader(projectId, userId);
    if (!isLeader) {
        throw new Error("FORBIDDEN: 팀장만 프로젝트를 수정할 수 있습니다.");
    }

    return new Promise((resolve, reject) => {
        let fields = [];
        let params = [];

        const allowedFields = ['title', 'description', 'status', 'budget', 'work_method', 'views', 'start_date', 'end_date'];

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                fields.push(`${field} = ?`);
                params.push(updateData[field]);
            }
        });

        if (fields.length === 0) return resolve(0);

        const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;
        params.push(projectId);

        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

const deleteProject = async (projectId, userId) => {
    const isLeader = await checkIsLeader(projectId, userId);
    if (!isLeader) {
        throw new Error("FORBIDDEN: 팀장만 프로젝트를 삭제할 수 있습니다.");
    }

    return new Promise((resolve, reject) => {
        const query = `DELETE FROM projects WHERE id = ?`;
        db.run(query, [projectId], function(err) {
            if (err) reject(err);
            else resolve(this.changes); // PRAGMA foreign_keys = ON 에 의해 참가자 목록도 연쇄 삭제됨
        });
    });
};

const joinProject = (projectId, userId, nickname, role) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO project_participants (project_id, user_id, nickname, role, is_leader)
            VALUES (?, ?, ?, ?, 0)
        `;
        db.run(query, [projectId, userId, nickname, role], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

const leaveProject = (projectId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM project_participants WHERE project_id = ? AND user_id = ?`;
        db.run(query, [projectId, userId], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

const toggleLike = (userId, projectId) => {
    return new Promise((resolve, reject) => {
        const checkQuery = `SELECT id FROM likes WHERE user_id = ? AND project_id = ?`;

        db.get(checkQuery, [userId, projectId], (err, row) => {
            if (err) return reject(err);

            if (row) {
                const deleteQuery = `DELETE FROM likes WHERE user_id = ? AND project_id = ?`;
                db.run(deleteQuery, [userId, projectId], function(err) {
                    if (err) reject(err);
                    else resolve({ isLiked: false });
                });
            } else {
                const insertQuery = `INSERT INTO likes (user_id, project_id) VALUES (?, ?)`;
                db.run(insertQuery, [userId, projectId], function(err) {
                    if (err) reject(err);
                    else resolve({ isLiked: true });
                });
            }
        });
    });
};

const getProjectLikeCount = (projectId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT COUNT(*) as count FROM likes WHERE project_id = ?`;
        db.get(query, [projectId], (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });
};

const addComment = (projectId, userId, content, parentId = null) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO project_comments (project_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)`;
        db.run(query, [projectId, userId, content, parentId], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

const getCommentsByProjectId = (projectId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT c.*, u.nickname 
            FROM project_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.project_id = ?
            ORDER BY c.created_at ASC
        `;
        db.all(query, [projectId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const deleteComment = (commentId, userId) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM project_comments WHERE id = ? AND user_id = ?`;
        db.run(query, [commentId, userId], function(err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
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