import { buildDraft, saveDraft, adminState, assertRevision, revisionOf } from './service.js';
const fail = message => { throw Object.assign(new Error(message), { status: 400 }); };
export function exportBackup(data) {
  return { format: 'rajiv-portfolio-backup', version: 1, exportedAt: new Date().toISOString(), content: buildDraft(data) };
}
export function restoreBackup(data, { revision, backup, previous = false }) {
  assertRevision(data, revision);
  const source = previous ? data.contentPreviousPublished?.content : backup?.content;
  if (!previous && (backup?.format !== 'rajiv-portfolio-backup' || backup.version !== 1)) fail('Select a valid portfolio backup file.');
  if (!source || source.schemaVersion !== 1 || !source.user || !source.settings) fail('No valid content is available to restore.');
  const next = structuredClone(data);
  for (const key of ['projects', 'skills', 'timelines', 'softwareApplications']) {
    if (!Array.isArray(source[key]) || source[key].length > 500) fail(`Invalid ${key} in backup.`);
    const ids = new Set();
    next[key] = source[key].map(row => {
      if (!row || typeof row !== "object") fail(`Invalid record in ${key}.`);
      const id = Number(row.id ?? row._id);
      if (!Number.isSafeInteger(id) || id < 1 || ids.has(id)) fail(`Invalid or duplicate ID in ${key}.`);
      ids.add(id);
      return { ...row, id };
    });
  }
  // Sanitize through the public-content whitelist, never copy authentication or inbox data.
  next.projectStories = Object.fromEntries(source.projects.map(p => [String(p.id ?? p._id), p.caseStudy]));
  next.contentSettings = source.settings;
  const cleaned = buildDraft(next);
  for (const key of ['projects', 'skills', 'timelines', 'softwareApplications']) next[key] = cleaned[key];
  saveDraft(next, { ...source, projects: cleaned.projects, revision: revisionOf(buildDraft(next)) });
  data.contentBeforeRestore = { content: buildDraft(data), restoredAt: new Date().toISOString() };
  for (const key of ['users', 'projects', 'skills', 'timelines', 'softwareApplications', 'projectStories', 'contentSettings', 'draftSavedAt']) data[key] = next[key];
  return adminState(data);
}
