import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

const { Pool } = pkg;

export const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'portfolio_db',
    password: process.env.PG_PASSWORD || 'postgre',
    port: Number(process.env.PG_PORT) || 5432,
});

export const initDb = async () => {
    const createMessagesTable = `
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            sender_name VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(50) NOT NULL,
            about_me TEXT NOT NULL,
            password VARCHAR(255) NOT NULL,
            avatar JSONB NOT NULL DEFAULT '{}'::jsonb,
            resume JSONB NOT NULL DEFAULT '{}'::jsonb,
            portfolio_url TEXT NOT NULL,
            github_url TEXT,
            instagram_url TEXT,
            twitter_url TEXT,
            linkedin_url TEXT,
            facebook_url TEXT,
            reset_password_token VARCHAR(255),
            reset_password_expire TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createTimelinesTable = `
        CREATE TABLE IF NOT EXISTS timelines (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            timeline JSONB NOT NULL DEFAULT '{"from": "", "to": ""}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createSkillsTable = `
        CREATE TABLE IF NOT EXISTS skills (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            proficiency INTEGER NOT NULL,
            svg JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createSoftwareApplicationsTable = `
        CREATE TABLE IF NOT EXISTS software_applications (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            svg JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createProjectsTable = `
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            git_repo_link TEXT,
            project_link TEXT,
            technologies TEXT,
            stack VARCHAR(255),
            deployed VARCHAR(50),
            project_banner JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    await pool.query(createMessagesTable);
    await pool.query(createUsersTable);
    await pool.query(createTimelinesTable);
    await pool.query(createSkillsTable);
    await pool.query(createSoftwareApplicationsTable);
    await pool.query(createProjectsTable);
};

export const dbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('PostgreSQL Database connected successfully');
        client.release();
        await initDb();
        console.log('All database tables initialized successfully');
    } catch (err) {
        console.error('PostgreSQL Database connection failed:');
        console.error(err);
    }
};

export default dbConnection;