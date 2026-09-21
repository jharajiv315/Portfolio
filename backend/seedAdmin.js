import bcrypt from 'bcrypt';
import { pool, initDb } from './database/dbConnection.js';
import User from './models/userSchema.js';

async function seedAdmin() {
  await initDb();

  const email = 'jharajiv315@gmail.com';
  const plainPassword = 'Rajiv45';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log('User already exists, updating password and details...');
    await pool.query(
      `UPDATE users 
       SET password = $1, full_name = $2, about_me = $3 
       WHERE LOWER(email) = LOWER($4)`,
      [hashedPassword, 'Rajiv Jha', 'Fullstack Developer & Software Engineer', email]
    );
    console.log('✔ Admin user updated successfully.');
  } else {
    console.log('Creating new admin user...');
    await pool.query(
      `INSERT INTO users (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        'Rajiv Jha',
        email.toLowerCase().trim(),
        '+91 9876543210',
        'Fullstack Developer & Software Engineer specializing in scalable web applications and PostgreSQL.',
        hashedPassword,
        JSON.stringify({
          public_id: 'default_avatar',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        }),
        JSON.stringify({
          public_id: 'default_resume',
          url: 'https://example.com/resume.pdf',
        }),
        'http://localhost:5173',
        'https://github.com',
        'https://instagram.com',
        'https://twitter.com',
        'https://linkedin.com',
        'https://facebook.com',
      ]
    );
    console.log('✔ Admin user created successfully.');
  }

  // Verify login credentials using comparePassword
  const verifiedUser = await User.findOne({ email }).select('+password');
  const isMatch = await verifiedUser.comparePassword(plainPassword);
  console.log(`✔ Credential verification test: ${isMatch ? 'PASSED' : 'FAILED'}`);
  console.log('Admin ID:', verifiedUser.id);
  console.log('Admin Email:', verifiedUser.email);

  await pool.end();
}

seedAdmin().catch(err => {
  console.error('Error seeding admin user:', err);
  process.exit(1);
});
