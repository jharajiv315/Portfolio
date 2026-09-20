import { pool } from "../database/dbConnection.js";

const SKILL_FIELDS = `
    id,
    id AS "_id",
    title,
    proficiency,
    svg,
    created_at AS "createdAt"
`;

export class SkillInstance {
    constructor(data = {}) {
        Object.assign(this, data);
        if (this.id && !this._id) {
            this._id = this.id;
        }
    }

    async deleteOne() {
        const query = `DELETE FROM skills WHERE id = $1 RETURNING ${SKILL_FIELDS};`;
        const result = await pool.query(query, [this.id || this._id]);
        return formatSkillRow(result.rows[0]);
    }
}

const formatSkillRow = (row) => {
    if (!row) return null;
    return new SkillInstance({
        id: row.id,
        _id: row.id,
        title: row.title,
        proficiency: row.proficiency,
        svg: typeof row.svg === "string" ? JSON.parse(row.svg) : (row.svg || {}),
        createdAt: row.createdAt ?? row.created_at,
    });
};

export const Skill = {
    async create({ title, proficiency, svg }) {
        const svgJson = typeof svg === "string" ? svg : JSON.stringify(svg || {});
        const query = `
            INSERT INTO skills (title, proficiency, svg)
            VALUES ($1, $2, $3)
            RETURNING ${SKILL_FIELDS};
        `;
        const result = await pool.query(query, [title, proficiency, svgJson]);
        return formatSkillRow(result.rows[0]);
    },

    async find() {
        const query = `
            SELECT ${SKILL_FIELDS}
            FROM skills
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows.map(formatSkillRow);
    },

    async findById(id) {
        const query = `
            SELECT ${SKILL_FIELDS}
            FROM skills
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);
        return formatSkillRow(result.rows[0]);
    },

    async findByIdAndUpdate(id, updates = {}, options = {}) {
        const fields = [];
        const values = [];

        if (updates.title !== undefined) {
            values.push(updates.title);
            fields.push(`title = $${values.length}`);
        }
        if (updates.proficiency !== undefined) {
            values.push(updates.proficiency);
            fields.push(`proficiency = $${values.length}`);
        }
        if (updates.svg !== undefined) {
            const svgJson = typeof updates.svg === "string" ? updates.svg : JSON.stringify(updates.svg || {});
            values.push(svgJson);
            fields.push(`svg = $${values.length}`);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        values.push(id);
        const query = `
            UPDATE skills
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING ${SKILL_FIELDS};
        `;
        const result = await pool.query(query, values);
        return formatSkillRow(result.rows[0]);
    },

    async findByIdAndDelete(id) {
        const query = `
            DELETE FROM skills
            WHERE id = $1
            RETURNING ${SKILL_FIELDS};
        `;
        const result = await pool.query(query, [id]);
        return formatSkillRow(result.rows[0]);
    },
};

export default Skill;
