import test from 'node:test';
import assert from 'node:assert/strict';
import { renderProjectHTML, projectMetadata } from './project-seo.js';
test('unique project metadata escapes unsafe content and retains the application shell', () => {
  const html = renderProjectHTML('<head><title>Old</title><meta name="description" content="Old"></head><body><script src="/assets/app.js"></script></body>',{id:1,title:'GitaPath <script>',description:'Quote " & description',projectBanner:{url:'https://example.com/image.png'}},'Rajiv');
  assert(html.includes('GitaPath &lt;script&gt;')); assert(!html.includes('<script>'));
  assert(html.includes('property="og:image"')); assert(html.includes('https://example.com/image.png'));
  assert(html.includes('/project/1')); assert(html.includes('/assets/app.js')); assert.equal((html.match(/<title>/g)||[]).length,1);
  assert.equal((html.match(/name="description"/g)||[]).length,1);
});
test('invalid image schemes are excluded and descriptions bounded', () => {
  const m = projectMetadata({id:2,title:'Two',description:'a'.repeat(500),projectBanner:{url:'javascript:alert(1)'}});
  assert.equal(m.image,''); assert.equal(m.description.length,180);
});
