import { pool } from "../database/dbConnection.js";

const TIMELINE_FIELDS = `
    id,
    id AS "_id",
    title,
    description,
    timeline,
    created_at AS "createdAt"
`;

export class TimelineInstance {
    constructor(data = {}) {
        Object.assign(this, data);
        if (this.id && !this._id) {
            this._id = this.id;
        }
    }

    async deleteOne() {
        const query = `DELETE FROM timelines WHERE id = $1 RETURNING ${TIMELINE_FIELDS};`;
        const result = await pool.query(query, [this.id || this._id]);
        return formatTimelineRow(result.rows[0]);
    }
}

const formatTimelineRow = (row) => {
    if (!row) return null;
    return new TimelineInstance({
        id: row.id,
        _id: row.id,
        title: row.title,
        description: row.description,
        timeline: typeof row.timeline === "string" ? JSON.parse(row.timeline) : (row.timeline || { from: "", to: "" }),
        createdAt: row.createdAt ?? row.created_at,
    });
};

export const Timeline = {
    async create({ title, description, timeline }) {
        const timelineJson = typeof timeline === "string" ? timeline : JSON.stringify(timeline || { from: "", to: "" });
        const query = `
            INSERT INTO timelines (title, description, timeline)
            VALUES ($1, $2, $3)
            RETURNING ${TIMELINE_FIELDS};
        `;
        const result = await pool.query(query, [title, description, timelineJson]);
        return formatTimelineRow(result.rows[0]);
    },

    async find() {
        const query = `
            SELECT ${TIMELINE_FIELDS}
            FROM timelines
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows.map(formatTimelineRow);
    },

    async findById(id) {
        const query = `
            SELECT ${TIMELINE_FIELDS}
            FROM timelines
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);
        return formatTimelineRow(result.rows[0]);
    },

    async findByIdAndDelete(id) {
        const query = `
            DELETE FROM timelines
            WHERE id = $1
            RETURNING ${TIMELINE_FIELDS};
        `;
        const result = await pool.query(query, [id]);
        return formatTimelineRow(result.rows[0]);
    },
};

export default Timeline;
