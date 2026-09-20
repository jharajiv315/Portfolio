import { pool } from "../database/dbConnection.js";

const PROJECT_FIELDS = `
    id,
    id AS "_id",
    title,
    description,
    git_repo_link AS "gitRepoLink",
    project_link AS "projectLink",
    technologies,
    stack,
    deployed,
    project_banner AS "projectBanner",
    created_at AS "createdAt"
`;

export class ProjectInstance {
    constructor(data = {}) {
        Object.assign(this, data);
        if (this.id && !this._id) {
            this._id = this.id;
        }
    }

    async deleteOne() {
        const query = `DELETE FROM projects WHERE id = $1 RETURNING ${PROJECT_FIELDS};`;
        const result = await pool.query(query, [this.id || this._id]);
        return formatProjectRow(result.rows[0]);
    }
}

const formatProjectRow = (row) => {
    if (!row) return null;
    return new ProjectInstance({
        id: row.id,
        _id: row.id,
        title: row.title,
        description: row.description,
        gitRepoLink: row.gitRepoLink ?? row.git_repo_link,
        projectLink: row.projectLink ?? row.project_link,
        technologies: row.technologies,
        stack: row.stack,
        deployed: row.deployed,
        projectBanner: typeof row.projectBanner === "string" 
            ? JSON.parse(row.projectBanner) 
            : typeof row.project_banner === "string" 
                ? JSON.parse(row.project_banner) 
                : (row.projectBanner || row.project_banner || {}),
        createdAt: row.createdAt ?? row.created_at,
    });
};

export const Project = {
    async create({ title, description, gitRepoLink, projectLink, technologies, stack, deployed, projectBanner }) {
        const bannerJson = typeof projectBanner === "string" ? projectBanner : JSON.stringify(projectBanner || {});
        const query = `
            INSERT INTO projects (
                title,
                description,
                git_repo_link,
                project_link,
                technologies,
                stack,
                deployed,
                project_banner
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING ${PROJECT_FIELDS};
        `;
        const values = [
            title,
            description,
            gitRepoLink,
            projectLink,
            technologies,
            stack,
            deployed,
            bannerJson,
        ];
        const result = await pool.query(query, values);
        return formatProjectRow(result.rows[0]);
    },

    async find() {
        const query = `
            SELECT ${PROJECT_FIELDS}
            FROM projects
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows.map(formatProjectRow);
    },

    async findById(id) {
        const query = `
            SELECT ${PROJECT_FIELDS}
            FROM projects
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);
        return formatProjectRow(result.rows[0]);
    },

    async findByIdAndUpdate(id, updates = {}, options = {}) {
        const fields = [];
        const values = [];

        if (updates.title !== undefined) {
            values.push(updates.title);
            fields.push(`title = $${values.length}`);
        }
        if (updates.description !== undefined) {
            values.push(updates.description);
            fields.push(`description = $${values.length}`);
        }
        if (updates.gitRepoLink !== undefined) {
            values.push(updates.gitRepoLink);
            fields.push(`git_repo_link = $${values.length}`);
        }
        if (updates.projectLink !== undefined) {
            values.push(updates.projectLink);
            fields.push(`project_link = $${values.length}`);
        }
        if (updates.technologies !== undefined) {
            values.push(updates.technologies);
            fields.push(`technologies = $${values.length}`);
        }
        if (updates.stack !== undefined) {
            values.push(updates.stack);
            fields.push(`stack = $${values.length}`);
        }
        if (updates.deployed !== undefined) {
            values.push(updates.deployed);
            fields.push(`deployed = $${values.length}`);
        }
        if (updates.projectBanner !== undefined) {
            const bannerJson = typeof updates.projectBanner === "string" 
                ? updates.projectBanner 
                : JSON.stringify(updates.projectBanner || {});
            values.push(bannerJson);
            fields.push(`project_banner = $${values.length}`);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        values.push(id);
        const query = `
            UPDATE projects
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING ${PROJECT_FIELDS};
        `;
        const result = await pool.query(query, values);
        return formatProjectRow(result.rows[0]);
    },

    async findByIdAndDelete(id) {
        const query = `
            DELETE FROM projects
            WHERE id = $1
            RETURNING ${PROJECT_FIELDS};
        `;
        const result = await pool.query(query, [id]);
        return formatProjectRow(result.rows[0]);
    },
};

export default Project;
