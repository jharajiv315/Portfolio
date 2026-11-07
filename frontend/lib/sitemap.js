import { SITE, escapeHTML } from './project-seo.js';
export function renderSitemap(content) {
  const projects = content.settings?.visibility?.projects === false ? [] : content.projects;
  const urls = [SITE+'/', ...projects.map(p => `${SITE}/project/${encodeURIComponent(p.id ?? p._id)}`)];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(urls)].map(url => `<url><loc>${escapeHTML(url)}</loc></url>`).join('')}</urlset>`;
}
