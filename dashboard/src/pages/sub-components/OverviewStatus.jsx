import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { Button } from '@/components/ui/button';
export default function OverviewStatus({ onNavigate }) {
  const [content,setContent] = useState(null), [inbox,setInbox] = useState(null), [busy,setBusy] = useState(false), [errors,setErrors] = useState([]);
  const load = async () => {
    setBusy(true); setErrors([]);
    const results = await Promise.allSettled([axios.get(`${API_URL}/api/v1/content/admin`),axios.get(`${API_URL}/api/v1/message/getall`)]);
    const failures = [];
    if (results[0].status === 'fulfilled') setContent(results[0].value.data); else failures.push('Publishing status could not be refreshed.');
    if (results[1].status === 'fulfilled') setInbox(results[1].value.data.messages); else failures.push('Inquiry counts could not be refreshed.');
    setErrors(failures); setBusy(false);
  };
  useEffect(() => { load(); }, []);
  const unread = inbox?.filter(m => !m.readAt).length;
  const open = inbox?.filter(m => m.status !== 'closed').length;
  return <section aria-label="Portfolio overview" className="mb-6 space-y-4" aria-busy={busy}>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-primary">Your workspace</p><h2 className="mt-1 text-2xl font-semibold">Portfolio at a glance</h2></div><Button variant="outline" onClick={load} disabled={busy}>{busy ? 'Refreshing…' : 'Refresh overview'}</Button></div>
    {errors.length > 0 && <p role="alert" className="text-sm text-destructive">{errors.join(' ')} Any figures shown are from the last successful refresh. Use Refresh overview to retry.</p>}
    <div className="grid gap-4 sm:grid-cols-3">
      <article className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">Publication</p><h3 className="mt-3 text-lg font-semibold">{content ? content.revision === content.publishedRevision ? 'Everything published' : 'Unpublished changes' : busy ? 'Loading…' : 'Unavailable'}</h3><p className="mt-2 text-xs text-muted-foreground">Saved dashboard edits awaiting publication appear here.</p><Button className="mt-4" variant="outline" onClick={() => onNavigate('Publishing')}>Review content</Button></article>
      <article className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">Unread inquiries</p><h3 className="mt-3 text-3xl font-semibold tabular-nums">{unread ?? '—'}</h3><p className="mt-2 text-xs text-muted-foreground">{open === undefined ? 'Waiting for inbox data' : `${open} open inquiries in total`}</p><Button className="mt-4" variant="outline" onClick={() => onNavigate('Messages')}>Open inbox</Button></article>
      <article className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">Last published</p><h3 className="mt-3 text-base font-semibold">{content?.publishedAt ? new Date(content.publishedAt).toLocaleString() : content ? 'Not published yet' : '—'}</h3><p className="mt-2 text-xs text-muted-foreground">Preview saved changes before publishing your next version.</p><a href="https://portfolio-beta-ochre-90.vercel.app/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm text-primary underline">View live portfolio ↗</a></article>
    </div>
  </section>;
}
