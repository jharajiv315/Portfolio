export const SITE = 'https://portfolio-beta-ochre-90.vercel.app';
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function projectMetadata(project, name = 'Rajiv Jha') {
  return { title: `${project.title} — ${name}`, description: (project.description || project.caseStudy?.problem || `${project.title} project by ${name}`).replace(/\s+/g,' ').slice(0, 180), image: /^https?:\/\//.test(project.projectBanner?.url || '') ? project.projectBanner.url : '', url: `${SITE}/project/${encodeURIComponent(project.id ?? project._id)}` };
}
export function renderProjectHTML(template, project, name) {
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
  return template.replace(/<title>[\s\S]*?<\/title>/gi, '').replace(/<meta\s+[^>]*(?:name=["']description["']|property=["']og:[^"']+["']|name=["']twitter:[^"']+["'])[^>]*>/gi,'').replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi,'').replace('</head>', `${meta}\n</head>`);
}
