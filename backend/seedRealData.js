import { pool, initDb } from './database/dbConnection.js';
import User from './models/userSchema.js';

async function seedRealData() {
  console.log('=== POPULATING DATABASE WITH RAJIV JHA REAL DATA ===');
  await initDb();

  // 1. UPDATE USER PROFILE
  const userQuery = `
    UPDATE users
    SET
      full_name = $1,
      about_me = $2,
      phone = $3,
      portfolio_url = $4,
      github_url = $5,
      linkedin_url = $6,
      twitter_url = $7,
      instagram_url = $8,
      facebook_url = $9,
      resume = $10
    WHERE LOWER(email) = 'jharajiv315@gmail.com'
    RETURNING id, full_name, email;
  `;

  const aboutMeText = `I’m a B.Tech Computer Science student focused on becoming an AI/ML Engineer. I enjoy building software across the full stack, working with data, learning machine learning, and solving algorithmic problems. My approach is simple: understand the fundamentals, build real projects, learn from what breaks, and continuously improve.`;

  const userRes = await pool.query(userQuery, [
    'Rajiv Jha',
    aboutMeText,
    '', // Phone: DO NOT ADD
    'http://localhost:5174',
    'https://github.com/jharajiv315',
    'https://www.linkedin.com/in/rajiv-jha-9b36ba3a2/',
    null, // Twitter: DO NOT ADD
    null, // Instagram: DO NOT ADD
    null, // Facebook: DO NOT ADD
    JSON.stringify({ public_id: 'default_resume', url: '' }), // No fake resume URL
  ]);
  console.log('✔ User profile updated:', userRes.rows[0]);

  // 2. SEED TIMELINE
  await pool.query('DELETE FROM timelines;');
  const timelines = [
    {
      title: 'B.Tech in Computer Science Engineering',
      description: '2nd Year (3rd Semester) · Expected Graduation: 2029 · [ADD COLLEGE NAME]',
      timeline: { from: '2025', to: '2029' },
    },
    {
      title: 'Foundations in Programming & Core CS',
      description: 'Started building programming foundations in Java, core Data Structures fundamentals, and web development basics.',
      timeline: { from: '2025', to: '2025' },
    },
    {
      title: 'Advanced DSA, Data Systems & Machine Learning',
      description: 'Focused on Advanced DSA, Python (NumPy, Pandas), relational database architecture with PostgreSQL/SQL, full-stack engineering, and introductory Machine Learning.',
      timeline: { from: '2026', to: 'Present' },
    },
    {
      title: 'Planned Focus: Deep Learning, PyTorch & Production AI',
      description: 'Planned development focusing on Deep Learning, PyTorch, MLOps, system design, and building reliable production AI systems.',
      timeline: { from: 'Upcoming', to: 'Future' },
    },
  ];

  for (const item of timelines) {
    await pool.query(
      'INSERT INTO timelines (title, description, timeline) VALUES ($1, $2, $3)',
      [item.title, item.description, JSON.stringify(item.timeline)]
    );
  }
  console.log(`✔ Timelines seeded (${timelines.length} entries).`);

  // 3. SEED SKILLS
  await pool.query('DELETE FROM skills;');
  const skills = [
    { title: 'Java', proficiency: 75, svg: { public_id: 'skill_java', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' } },
    { title: 'Python', proficiency: 75, svg: { public_id: 'skill_python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' } },
    { title: 'JavaScript', proficiency: 65, svg: { public_id: 'skill_js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' } },
    { title: 'C', proficiency: 55, svg: { public_id: 'skill_c', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' } },
    { title: 'C++', proficiency: 50, svg: { public_id: 'skill_cpp', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' } },
    { title: 'HTML', proficiency: 85, svg: { public_id: 'skill_html', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' } },
    { title: 'CSS', proficiency: 75, svg: { public_id: 'skill_css', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' } },
    { title: 'React', proficiency: 65, svg: { public_id: 'skill_react', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' } },
    { title: 'Node.js', proficiency: 60, svg: { public_id: 'skill_node', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' } },
    { title: 'Express.js', proficiency: 60, svg: { public_id: 'skill_express', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' } },
    { title: 'NumPy', proficiency: 75, svg: { public_id: 'skill_numpy', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' } },
    { title: 'Pandas', proficiency: 75, svg: { public_id: 'skill_pandas', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' } },
    { title: 'SQL', proficiency: 75, svg: { public_id: 'skill_sql', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg' } },
    { title: 'PostgreSQL', proficiency: 75, svg: { public_id: 'skill_pg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' } },
    { title: 'MongoDB', proficiency: 55, svg: { public_id: 'skill_mongo', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' } },
    { title: 'DSA', proficiency: 70, svg: { public_id: 'skill_dsa', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/thealgorithms/thealgorithms-original.svg' } },
    { title: 'Machine Learning', proficiency: 30, svg: { public_id: 'skill_ml', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' } },
    { title: 'Git', proficiency: 70, svg: { public_id: 'skill_git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' } },
    { title: 'GitHub', proficiency: 70, svg: { public_id: 'skill_github', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' } },
    { title: 'Figma', proficiency: 45, svg: { public_id: 'skill_figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' } },
  ];

  for (const s of skills) {
    await pool.query(
      'INSERT INTO skills (title, proficiency, svg) VALUES ($1, $2, $3)',
      [s.title, s.proficiency, JSON.stringify(s.svg)]
    );
  }
  console.log(`✔ Skills seeded (${skills.length} skills).`);

  // 4. SEED SOFTWARE APPLICATIONS
  await pool.query('DELETE FROM software_applications;');
  const tools = [
    { name: 'Git', svg: { public_id: 'tool_git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' } },
    { name: 'GitHub', svg: { public_id: 'tool_github', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' } },
    { name: 'Visual Studio Code', svg: { public_id: 'tool_vscode', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' } },
    { name: 'Figma', svg: { public_id: 'tool_figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' } },
    { name: 'PostgreSQL', svg: { public_id: 'tool_pg', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' } },
    { name: 'MongoDB', svg: { public_id: 'tool_mongo', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' } },
    { name: 'Cloudinary', svg: { public_id: 'tool_cloudinary', url: 'https://res.cloudinary.com/cloudinary/image/upload/dpr_auto/w_80/v1/logo/for_white_bg/cloudinary_icon_for_white_bg.svg' } },
  ];

  for (const t of tools) {
    await pool.query(
      'INSERT INTO software_applications (name, svg) VALUES ($1, $2)',
      [t.name, JSON.stringify(t.svg)]
    );
  }
  console.log(`✔ Software Applications seeded (${tools.length} tools).`);

  // 5. SEED PROJECTS
  await pool.query('DELETE FROM projects;');
  const projects = [
    {
      title: 'Krivio',
      description: 'A full-stack product built as part of my journey in software engineering, focused on creating a polished real-world application rather than a basic tutorial project.',
      stack: 'Full-Stack / Product Project',
      technologies: 'React, Node.js, Express, PostgreSQL',
      deployed: 'In Development',
      gitRepoLink: 'https://github.com/jharajiv315',
      projectLink: '',
      projectBanner: { public_id: 'banner_krivio', url: '/studio.png' },
    },
    {
      title: 'Gitapath',
      description: 'A software project focused on building a practical user-facing product while strengthening full-stack development, backend architecture, and database integration.',
      stack: 'Full-Stack / Software Project',
      technologies: 'React, Node.js, Express, PostgreSQL, AI Integration',
      deployed: 'In Development',
      gitRepoLink: 'https://github.com/jharajiv315',
      projectLink: '',
      projectBanner: { public_id: 'banner_gitapath', url: '/studio.png' },
    },
    {
      title: 'Truva',
      description: 'A full-stack project developed to strengthen practical engineering skills across frontend development, backend APIs, database integration, and application architecture.',
      stack: 'Full-Stack / Product Project',
      technologies: 'React, Node.js, Express, PostgreSQL',
      deployed: 'In Development',
      gitRepoLink: 'https://github.com/jharajiv315',
      projectLink: '',
      projectBanner: { public_id: 'banner_truva', url: '/studio.png' },
    },
  ];

  for (const p of projects) {
    await pool.query(
      `INSERT INTO projects (title, description, stack, technologies, deployed, git_repo_link, project_link, project_banner)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        p.title,
        p.description,
        p.stack,
        p.technologies,
        p.deployed,
        p.gitRepoLink,
        p.projectLink,
        JSON.stringify(p.projectBanner),
      ]
    );
  }
  console.log(`✔ Featured Projects seeded (${projects.length} projects).`);

  console.log('=== ALL REAL DATA SEEDED SUCCESSFULLY ===');
  await pool.end();
}

seedRealData().catch(err => {
  console.error('Error seeding real data:', err);
  process.exit(1);
});
