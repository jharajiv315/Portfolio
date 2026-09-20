import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../database/dbConnection.js";

const USER_FIELDS = `
    id,
    id AS "_id",
    full_name AS "fullName",
    email,
    phone,
    about_me AS "aboutMe",
    password,
    avatar,
    resume,
    portfolio_url AS "portfolioURL",
    github_url AS "githubURL",
    instagram_url AS "instagramURL",
    twitter_url AS "twitterURL",
    linkedin_url AS "linkedInURL",
    facebook_url AS "facebookURL",
    reset_password_token AS "resetPasswordToken",
    reset_password_expire AS "resetPasswordExpire",
    created_at AS "createdAt"
`;

export class UserInstance {
    constructor(data = {}) {
        Object.assign(this, data);
        if (this.id && !this._id) {
            this._id = this.id;
        }
    }

    // Compare entered password with stored hashed password
    async comparePassword(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    }

    // Generate JSON Web Token
    generateJsonWebToken() {
        return jwt.sign(
            { id: this.id || this._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.JWT_EXPIRES,
            }
        );
    }

    // Generate and hash reset password token
    getResetPasswordToken() {
        const resetToken = crypto.randomBytes(20).toString("hex");

        this.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

        return resetToken;
    }

    async deleteOne() {
        const query = `DELETE FROM users WHERE id = $1 RETURNING ${USER_FIELDS};`;
        const result = await pool.query(query, [this.id || this._id]);
        return formatUserRow(result.rows[0]);
    }

    // Save/update this user instance to PostgreSQL
    async save() {
        if (this.password && !this.password.startsWith("$2")) {
            this.password = await bcrypt.hash(this.password, 10);
        }

        const query = `
            UPDATE users
            SET
                full_name = $1,
                email = $2,
                phone = $3,
                about_me = $4,
                password = $5,
                avatar = $6,
                resume = $7,
                portfolio_url = $8,
                github_url = $9,
                instagram_url = $10,
                twitter_url = $11,
                linkedin_url = $12,
                facebook_url = $13,
                reset_password_token = $14,
                reset_password_expire = $15
            WHERE id = $16
            RETURNING ${USER_FIELDS};
        `;

        const avatarJson = typeof this.avatar === "string" ? this.avatar : JSON.stringify(this.avatar || {});
        const resumeJson = typeof this.resume === "string" ? this.resume : JSON.stringify(this.resume || {});

        const values = [
            this.fullName,
            this.email,
            this.phone,
            this.aboutMe,
            this.password,
            avatarJson,
            resumeJson,
            this.portfolioURL,
            this.githubURL || null,
            this.instagramURL || null,
            this.twitterURL || null,
            this.linkedInURL || null,
            this.facebookURL || null,
            this.resetPasswordToken || null,
            this.resetPasswordExpire || null,
            this.id || this._id,
        ];

        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            Object.assign(this, formatUserRow(result.rows[0]));
        }
        return this;
    }
}

const formatUserRow = (row) => {
    if (!row) return null;
    return new UserInstance({
        id: row.id,
        _id: row.id,
        fullName: row.fullName ?? row.full_name,
        email: row.email,
        phone: row.phone,
        aboutMe: row.aboutMe ?? row.about_me,
        password: row.password,
        avatar: typeof row.avatar === "string" ? JSON.parse(row.avatar) : row.avatar,
        resume: typeof row.resume === "string" ? JSON.parse(row.resume) : row.resume,
        portfolioURL: row.portfolioURL ?? row.portfolio_url,
        githubURL: row.githubURL ?? row.github_url,
        instagramURL: row.instagramURL ?? row.instagram_url,
        twitterURL: row.twitterURL ?? row.twitter_url,
        linkedInURL: row.linkedInURL ?? row.linkedin_url,
        facebookURL: row.facebookURL ?? row.facebook_url,
        resetPasswordToken: row.resetPasswordToken ?? row.reset_password_token,
        resetPasswordExpire: row.resetPasswordExpire ?? row.reset_password_expire,
        createdAt: row.createdAt ?? row.created_at,
    });
};

// Enables chaining like User.findOne(...).select("+password")
function makeQueryPromise(executor) {
    let selectFields = null;

    const execute = async () => {
        return await executor(selectFields);
    };

    const promise = {
        select(fields) {
            selectFields = fields;
            return this;
        },
        then(onFulfilled, onRejected) {
            return execute().then(onFulfilled, onRejected);
        },
        catch(onRejected) {
            return execute().catch(onRejected);
        },
        finally(onFinally) {
            return execute().finally(onFinally);
        },
    };

    return promise;
}

export const User = {
    // Create new user (automatically hashes password)
    async create(userData) {
        const {
            fullName,
            email,
            phone,
            aboutMe,
            password,
            avatar,
            resume,
            portfolioURL,
            githubURL,
            instagramURL,
            twitterURL,
            linkedInURL,
            facebookURL,
        } = userData;

        if (!fullName) throw new Error("Name Required!");
        if (!email) throw new Error("Email Required!");
        if (!phone) throw new Error("Phone Required!");
        if (!aboutMe) throw new Error("About Me Section Is Required!");
        if (!password) throw new Error("Password Required!");
        if (password.length < 8) {
            throw new Error("Password Must Contain At Least 8 Characters!");
        }
        if (!portfolioURL) throw new Error("Portfolio URL Required!");

        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarJson = typeof avatar === "string" ? avatar : JSON.stringify(avatar || {});
        const resumeJson = typeof resume === "string" ? resume : JSON.stringify(resume || {});

        const query = `
            INSERT INTO users (
                full_name,
                email,
                phone,
                about_me,
                password,
                avatar,
                resume,
                portfolio_url,
                github_url,
                instagram_url,
                twitter_url,
                linkedin_url,
                facebook_url
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING ${USER_FIELDS};
        `;

        const values = [
            fullName,
            email.toLowerCase().trim(),
            phone,
            aboutMe,
            hashedPassword,
            avatarJson,
            resumeJson,
            portfolioURL,
            githubURL || null,
            instagramURL || null,
            twitterURL || null,
            linkedInURL || null,
            facebookURL || null,
        ];

        const result = await pool.query(query, values);
        return formatUserRow(result.rows[0]);
    },

    // Find single user by condition with chainable .select() support
    findOne(filter = {}) {
        return makeQueryPromise(async () => {
            const conditions = [];
            const values = [];

            if (filter.id || filter._id) {
                values.push(filter.id || filter._id);
                conditions.push(`id = $${values.length}`);
            }

            if (filter.email) {
                values.push(filter.email.toLowerCase().trim());
                conditions.push(`LOWER(email) = $${values.length}`);
            }

            if (filter.resetPasswordToken) {
                values.push(filter.resetPasswordToken);
                conditions.push(`reset_password_token = $${values.length}`);
            }

            if (filter.resetPasswordExpire) {
                if (typeof filter.resetPasswordExpire === "object" && filter.resetPasswordExpire.$gt) {
                    values.push(new Date(filter.resetPasswordExpire.$gt));
                    conditions.push(`reset_password_expire > $${values.length}`);
                } else {
                    values.push(new Date(filter.resetPasswordExpire));
                    conditions.push(`reset_password_expire = $${values.length}`);
                }
            }

            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
            const query = `SELECT ${USER_FIELDS} FROM users ${whereClause} LIMIT 1;`;
            const result = await pool.query(query, values);
            return formatUserRow(result.rows[0]);
        });
    },

    // Find user by ID with chainable .select() support
    findById(id) {
        return makeQueryPromise(async () => {
            const query = `SELECT ${USER_FIELDS} FROM users WHERE id = $1 LIMIT 1;`;
            const result = await pool.query(query, [id]);
            return formatUserRow(result.rows[0]);
        });
    },

    // Find all users
    async find() {
        const query = `SELECT ${USER_FIELDS} FROM users ORDER BY created_at DESC;`;
        const result = await pool.query(query);
        return result.rows.map(formatUserRow);
    },

    // Find by ID and update
    async findByIdAndUpdate(id, updates = {}) {
        const fields = [];
        const values = [];

        if (updates.fullName !== undefined) {
            values.push(updates.fullName);
            fields.push(`full_name = $${values.length}`);
        }
        if (updates.email !== undefined) {
            values.push(updates.email.toLowerCase().trim());
            fields.push(`email = $${values.length}`);
        }
        if (updates.phone !== undefined) {
            values.push(updates.phone);
            fields.push(`phone = $${values.length}`);
        }
        if (updates.aboutMe !== undefined) {
            values.push(updates.aboutMe);
            fields.push(`about_me = $${values.length}`);
        }
        if (updates.password !== undefined) {
            const hashedPassword = updates.password.startsWith("$2")
                ? updates.password
                : await bcrypt.hash(updates.password, 10);
            values.push(hashedPassword);
            fields.push(`password = $${values.length}`);
        }
        if (updates.avatar !== undefined) {
            const avatarJson = typeof updates.avatar === "string" ? updates.avatar : JSON.stringify(updates.avatar || {});
            values.push(avatarJson);
            fields.push(`avatar = $${values.length}`);
        }
        if (updates.resume !== undefined) {
            const resumeJson = typeof updates.resume === "string" ? updates.resume : JSON.stringify(updates.resume || {});
            values.push(resumeJson);
            fields.push(`resume = $${values.length}`);
        }
        if (updates.portfolioURL !== undefined) {
            values.push(updates.portfolioURL);
            fields.push(`portfolio_url = $${values.length}`);
        }
        if (updates.githubURL !== undefined) {
            values.push(updates.githubURL);
            fields.push(`github_url = $${values.length}`);
        }
        if (updates.instagramURL !== undefined) {
            values.push(updates.instagramURL);
            fields.push(`instagram_url = $${values.length}`);
        }
        if (updates.twitterURL !== undefined) {
            values.push(updates.twitterURL);
            fields.push(`twitter_url = $${values.length}`);
        }
        if (updates.linkedInURL !== undefined) {
            values.push(updates.linkedInURL);
            fields.push(`linkedin_url = $${values.length}`);
        }
        if (updates.facebookURL !== undefined) {
            values.push(updates.facebookURL);
            fields.push(`facebook_url = $${values.length}`);
        }
        if (updates.resetPasswordToken !== undefined) {
            values.push(updates.resetPasswordToken);
            fields.push(`reset_password_token = $${values.length}`);
        }
        if (updates.resetPasswordExpire !== undefined) {
            values.push(updates.resetPasswordExpire);
            fields.push(`reset_password_expire = $${values.length}`);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        values.push(id);
        const query = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE id = $${values.length}
            RETURNING ${USER_FIELDS};
        `;

        const result = await pool.query(query, values);
        return formatUserRow(result.rows[0]);
    },

    // Find by ID and delete
    async findByIdAndDelete(id) {
        const query = `DELETE FROM users WHERE id = $1 RETURNING ${USER_FIELDS};`;
        const result = await pool.query(query, [id]);
        return formatUserRow(result.rows[0]);
    },
};

export default User;