import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderProjectHTML } from '../lib/project-seo.js';
export default async function handler(req, res) {
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).end();
  try {
    const response = await fetch('https://portfolio-1qyb.onrender.com/api/v1/content', { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error('Content unavailable');
    const { content } = await response.json();
    const project = content.projects.find(p => String(p.id ?? p._id) === String(req.query.id));
    const template = await readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (!project) {
      res.setHeader('X-Robots-Tag', 'noindex'); res.setHeader('Cache-Control','no-store');
      return res.status(404).send(template);
    }
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
    return res.status(200).send(renderProjectHTML(template, project, content.user.fullName));
  } catch (error) {
    console.error('Project metadata unavailable:', error.message);
    res.setHeader('Cache-Control','no-store'); res.setHeader('Retry-After','30');
    // Serve the client shell so a temporary backend outage does not block visitors.
    try { res.setHeader('Content-Type','text/html; charset=utf-8'); return res.status(503).send(await readFile(join(process.cwd(),'dist','index.html'),'utf8')); }
    catch { return res.status(503).send('Temporarily unavailable. Please retry shortly.'); }
  }
}
