export const SITE = 'https://portfolio-beta-ochre-90.vercel.app';
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function projectMetadata(project, name = 'Rajiv Jha') {
  return { title: `${project.title} — ${name}`, description: (project.description || project.caseStudy?.problem || `${project.title} project by ${name}`).replace(/\s+/g,' ').slice(0, 180), image: /^https?:\/\//.test(project.projectBanner?.url || '') ? project.projectBanner.url : '', url: `${SITE}/project/${encodeURIComponent(project.id ?? project._id)}` };
}
export function renderProjectHTML(template, project, name, user = {}) {
  const m = projectMetadata(project, name);
  const meta = `<title>${escapeHTML(m.title)}</title>
<meta name="description" content="${escapeHTML(m.description)}">
<link rel="canonical" href="${escapeHTML(m.url)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escapeHTML(m.title)}">
<meta property="og:description" content="${escapeHTML(m.description)}">
<meta property="og:url" content="${escapeHTML(m.url)}">
<meta property="og:image" content="${escapeHTML(m.image)}">
<meta property="og:image:alt" content="${escapeHTML(project.title)} project screenshot">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHTML(m.title)}">
<meta name="twitter:description" content="${escapeHTML(m.description)}">
<meta name="twitter:image" content="${escapeHTML(m.image)}">`;
  const document = projectDocument(project, {...user, fullName:name});
  return template.replace( /<title>[\s\S]*?<\/title>/gi, '').replace(/<meta\s+[^>]*(?:name=["']description["']|property=["']og:[^"']+["']|name=["']twitter:[^"']+["'])[^>]*>/gi,'').replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi,'').replace('</head>', `${meta}\n<script type="application/ld+json">${jsonLD(document.schema)}</script>\n</head>`).replace('<div id="root"></div>', `<div id="root">${document.body}</div>`);
}
export const jsonLD = data => JSON.stringify(data).replace(/</g, '\\u003c');
export function projectDocument(project, user = {}) {
  const m = projectMetadata(project, user.fullName);
  const person = { '@type':'Person', '@id':`${SITE}/#person`, name:user.fullName || 'Rajiv Jha', url:SITE, sameAs:[user.githubURL,user.linkedinURL,user.leetcodeURL].filter(url => /^https?:\/\//.test(url || '')) };
  const schema = { '@context':'https://schema.org', '@type':'CreativeWork', '@id':m.url, name:project.title, description:project.description || '', url:m.url, ...(m.image ? {image:m.image} : {}), author:person };
  const chapters = [['problem','The problem'],['contribution','Project contribution'],['decisions','Engineering decisions'],['lessons','Lessons & takeaways']].filter(([key]) => project.caseStudy?.[key]).map(([key,label]) => `<section><h2>${label}</h2><p style="white-space:pre-line">${escapeHTML(project.caseStudy[key])}</p></section>`).join('');
  return {schema, body:`<main class="case-page studio-container" style="padding-top:100px;padding-bottom:60px"><a href="/">Return to portfolio</a><h1>${escapeHTML(project.title)}</h1>${m.image ? `<img src="${escapeHTML(m.image)}" alt="${escapeHTML(project.title)} application preview" style="width:100%;height:auto;margin:24px 0">` : ''}<section><h2>About this project</h2><p>${escapeHTML(project.description)}</p></section>${chapters}</main>`};
}
