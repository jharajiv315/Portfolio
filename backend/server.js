import app from './app.js';
import cloudinary from 'cloudinary';
import { pool } from './database/dbConnection.js';
 
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = Number(process.env.PORT) || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const handleShutdown = async (signal) => {
    console.log(`${signal} received: closing HTTP server and PostgreSQL pool...`);
    server.close(async () => {
        try {
            await pool.end();
            console.log('PostgreSQL pool connection closed cleanly.');
            process.exit(0);
        } catch (err) {
            console.error('Error during database pool shutdown:', err);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));