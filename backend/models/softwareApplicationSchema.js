import { pool } from "../database/dbConnection.js";

const SOFTWARE_APPLICATION_FIELDS = `
    id,
    id AS "_id",
    name,
    svg,
    created_at AS "createdAt"
`;

export class SoftwareApplicationInstance {
    constructor(data = {}) {
        Object.assign(this, data);
        if (this.id && !this._id) {
            this._id = this.id;
        }
    }

    async deleteOne() {
        const query = `DELETE FROM software_applications WHERE id = $1 RETURNING ${SOFTWARE_APPLICATION_FIELDS};`;
        const result = await pool.query(query, [this.id || this._id]);
        return formatSoftwareApplicationRow(result.rows[0]);
    }
}

const formatSoftwareApplicationRow = (row) => {
    if (!row) return null;
    return new SoftwareApplicationInstance({
        id: row.id,
        _id: row.id,
        name: row.name,
        svg: typeof row.svg === "string" ? JSON.parse(row.svg) : (row.svg || {}),
        createdAt: row.createdAt ?? row.created_at,
    });
};

export const SoftwareApplication = {
    async create({ name, svg }) {
        const svgJson = typeof svg === "string" ? svg : JSON.stringify(svg || {});
        const query = `
            INSERT INTO software_applications (name, svg)
            VALUES ($1, $2)
            RETURNING ${SOFTWARE_APPLICATION_FIELDS};
        `;
        const result = await pool.query(query, [name, svgJson]);
        return formatSoftwareApplicationRow(result.rows[0]);
    },

    async find() {
        const query = `
            SELECT ${SOFTWARE_APPLICATION_FIELDS}
            FROM software_applications
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows.map(formatSoftwareApplicationRow);
    },

    async findById(id) {
        const query = `
            SELECT ${SOFTWARE_APPLICATION_FIELDS}
            FROM software_applications
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);
        return formatSoftwareApplicationRow(result.rows[0]);
    },

    async findByIdAndDelete(id) {
        const query = `
            DELETE FROM software_applications
            WHERE id = $1
            RETURNING ${SOFTWARE_APPLICATION_FIELDS};
        `;
        const result = await pool.query(query, [id]);
        return formatSoftwareApplicationRow(result.rows[0]);
    },
};

export default SoftwareApplication;
