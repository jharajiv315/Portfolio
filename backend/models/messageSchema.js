import { pool } from "../database/dbConnection.js";

const MESSAGE_FIELDS = `
    id,
    id AS "_id",
    sender_name AS "senderName",
    email,
    subject,
    message,
    replied,
    reply_message AS "replyMessage",
    replied_at AS "repliedAt",
    created_at AS "createdAt"
`;

export class MessageInstance {
    constructor(data = {}) {
        Object.assign(this, data);
        if (this.id && !this._id) {
            this._id = this.id;
        }
    }

    async deleteOne() {
        const query = `DELETE FROM messages WHERE id = $1 RETURNING ${MESSAGE_FIELDS};`;
        const result = await pool.query(query, [this.id || this._id]);
        return formatMessageRow(result.rows[0]);
    }
}

const formatMessageRow = (row) => {
    if (!row) return null;
    return new MessageInstance({
        id: row.id,
        _id: row.id,
        senderName: row.senderName ?? row.sender_name,
        email: row.email || "",
        subject: row.subject,
        message: row.message,
        replied: Boolean(row.replied),
        replyMessage: row.replyMessage ?? row.reply_message ?? null,
        repliedAt: row.repliedAt ?? row.replied_at ?? null,
        createdAt: row.createdAt ?? row.created_at,
    });
};

export const Message = {
    async create({ senderName, email = "", subject, message }) {
        const query = `
            INSERT INTO messages (sender_name, email, subject, message)
            VALUES ($1, $2, $3, $4)
            RETURNING ${MESSAGE_FIELDS};
        `;
        const result = await pool.query(query, [senderName, email, subject, message]);
        return formatMessageRow(result.rows[0]);
    },

    async find() {
        const query = `
            SELECT ${MESSAGE_FIELDS}
            FROM messages
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows.map(formatMessageRow);
    },

    async findById(id) {
        const query = `
            SELECT ${MESSAGE_FIELDS}
            FROM messages
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);
        return formatMessageRow(result.rows[0]);
    },

    async findByIdAndUpdateReply(id, { replyMessage, repliedAt = new Date() }) {
        const query = `
            UPDATE messages
            SET replied = TRUE,
                reply_message = $1,
                replied_at = $2
            WHERE id = $3
            RETURNING ${MESSAGE_FIELDS};
        `;
        const result = await pool.query(query, [replyMessage, repliedAt, id]);
        return formatMessageRow(result.rows[0]);
    },

    async findByIdAndDelete(id) {
        const query = `
            DELETE FROM messages
            WHERE id = $1
            RETURNING ${MESSAGE_FIELDS};
        `;
        const result = await pool.query(query, [id]);
        return formatMessageRow(result.rows[0]);
    },
};

export default Message;
