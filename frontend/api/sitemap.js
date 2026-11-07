import { renderSitemap } from '../lib/sitemap.js';
export default async function handler(req,res) {
  if (!['GET','HEAD'].includes(req.method)) return res.status(405).end();
  try {
    const response = await fetch('https://portfolio-1qyb.onrender.com/api/v1/content', {signal:AbortSignal.timeout(45000)});
    if (!response.ok) throw Error('Published content unavailable');
    const {content} = await response.json();
    res.setHeader('Content-Type','application/xml; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=60');
    return res.status(200).send(renderSitemap(content));
  } catch(error) {
    console.error('Sitemap unavailable:',error.message);
    res.setHeader('Cache-Control','no-store');res.setHeader('Retry-After','60');
    return res.status(503).send('Sitemap temporarily unavailable.');
  }
}
