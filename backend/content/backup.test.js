import test from 'node:test';
import assert from 'node:assert/strict';
import { exportBackup, restoreBackup } from './backup.js';
import { adminState, buildDraft, publicContent, revisionOf } from './service.js';
import { updateInquiry } from './inbox.js';
const fixture = () => {
  const data = { users: [{id:1, fullName:'Rajiv', email:'admin@example.com', password:'SECRET', resetPasswordToken:'PRIVATE'}], projects:[{id:1,title:'Original',projectBanner:{url:'https://example.com/image.jpg'}}], skills:[{id:1,title:'Java',proficiency:75}], timelines:[], softwareApplications:[], messages:[{id:1,message:'PRIVATE inquiry'}] };
  const content = buildDraft(data); data.contentPublished = {content, revision:revisionOf(content)};
  return data;
};
test('backup round trip restores deleted records, preserves auth/inbox and leaves public version unchanged', () => {
  const data = fixture(); const backup = exportBackup(data);
  assert(!JSON.stringify(backup).includes('SECRET')); assert(!JSON.stringify(backup).includes('PRIVATE'));
  data.projects = []; data.skills = []; const live = structuredClone(publicContent(data));
  backup.content.user.password = 'INJECTED'; backup.content.projects[0].secret = 'INJECTED';
  restoreBackup(data, {revision:adminState(data).revision, backup});
  assert.equal(data.projects[0].title,'Original'); assert.equal(data.skills[0].title,'Java');
  assert.equal(data.users[0].password,'SECRET'); assert.equal(data.messages[0].message,'PRIVATE inquiry');
  assert.equal(data.projects[0].secret,undefined); assert.deepEqual(publicContent(data),live);
});
test('restore rejects stale or invalid backups atomically', () => {
  const data = fixture(), before = structuredClone(data), backup = exportBackup(data);
  assert.throws(() => restoreBackup(data,{revision:'stale',backup}), e => e.status === 409);
  backup.content.projects[0].projectLink = 'javascript:alert(1)';
  assert.throws(() => restoreBackup(data,{revision:adminState(data).revision,backup}),e => e.status === 400);
  assert.deepEqual(data,before);
  backup.content.projects[0].projectLink = ''; backup.content.projects.push(backup.content.projects[0]);
  assert.throws(() => restoreBackup(data,{revision:adminState(data).revision,backup}),e => e.status === 400);
});
test('previous published restore stays draft only', () => {
  const data = fixture(); data.contentPreviousPublished = structuredClone(data.contentPublished);
  data.contentPreviousPublished.content.projects[0].title = 'Previous';
  restoreBackup(data,{revision:adminState(data).revision,previous:true});
  assert.equal(data.projects[0].title,'Previous'); assert.equal(publicContent(data).projects[0].title,'Original');
});
test('inquiry updates only tracking fields, permits reopening and rejects invalid status', () => {
  const data = fixture();
  updateInquiry(data,1,{read:true,status:'closed',message:'overwrite'});
  assert(data.messages[0].readAt); assert.equal(data.messages[0].status,'closed'); assert.equal(data.messages[0].message,'PRIVATE inquiry');
  updateInquiry(data,1,{read:false,status:'in_discussion'}); assert.equal(data.messages[0].readAt,null);
  assert.throws(() => updateInquiry(data,1,{status:'invalid'}),e => e.status === 400);
  assert.throws(() => updateInquiry(data,2,{read:true}),e => e.status === 404);
});
