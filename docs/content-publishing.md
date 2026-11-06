# Portfolio content publishing

The public portfolio reads `/api/v1/content`. It starts with a sanitized build snapshot or the browser's last successful public response, then revalidates through one aggregate request. Public cached content never contains credentials, reset tokens, or inquiries. Returning to the tab refreshes public content. If the backend cannot be reached, the saved content stays visible with a retry notice.

## Dashboard workflow

1. Open **Content & publishing** in the sidebar.
2. Edit public profile links and text, section copy, visibility, project order, and project stories. Existing project, skill, tool, timeline, and profile editors still manage their original fields.
3. **Save draft** persists edits without publishing.
4. **Preview draft** saves current edits and opens a token-scoped snapshot valid for 15 minutes. Preview navigation stays in the draft, and the contact form cannot send inquiries in preview.
5. Review the preview and tick the review checkbox. **Publish** makes that exact saved revision public.

Publishing rejects a stale revision or a revision with no current preview. Saving also rejects stale revisions so an old browser tab cannot silently overwrite newer content. Reload a conflicted draft before continuing.

Public contact email is separate from the admin sign-in email. Existing uploaded files are retained in Blob-backed draft mode because a published or previous version may still reference them. Reference-aware cleanup is a separate maintenance task.

## Storage

`records.json` remains private. Original collections are the draft source. `contentSettings` holds copy and visibility/order; `projectStories` holds case-study fields. `contentPublished` is the public snapshot; `contentPreviousPublished` preserves the previous public version. `contentPreviews` contains bounded, expiring snapshots. Legacy public read endpoints serve published content; authenticated admin reads still return draft collections.

The initial public snapshot is migrated from existing content without changing the design. `frontend/src/data/portfolio-snapshot.json` is a public-only build fallback. It is not the live content source: publications are read dynamically from the API. First-time offline visitors may see the build fallback; returning visitors see their most recent successful public response.

## Verification

`npm test --prefix backend` covers public-data projection, draft isolation, preview expiry, stale-revision conflicts, ordering and visibility, public email separation, asset retention, and the HTTP save/preview/publish flow. Both Vite applications must build successfully.
