'use client';

import { useEffect, useState } from 'react';

type Review = { id: string; name: string; event: string; message: string; rating: number; created: number };
type SiteVideo = { id: string; name: string; url: string; builtIn: boolean };

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [videos, setVideos] = useState<SiteVideo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    const [reviewResponse, videoResponse] = await Promise.all([fetch('/api/admin/reviews'), fetch('/api/admin/videos')]);
    if (!reviewResponse.ok || !videoResponse.ok) { setAuthenticated(false); return; }
    setReviews(await reviewResponse.json());
    setVideos(await videoResponse.json());
  }

  useEffect(() => {
    fetch('/api/admin/session').then(response => response.json() as Promise<{ authenticated: boolean }>).then(async data => {
      setAuthenticated(!!data.authenticated);
      if (data.authenticated) await load();
    }).catch(() => setMessage('Could not connect to the admin area.')).finally(() => setChecking(false));
  }, []);

  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (!response.ok) throw new Error('Incorrect password.');
      setPassword(''); setAuthenticated(true); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not sign in.'); }
    finally { setBusy(false); }
  }

  async function remove(kind: 'reviews' | 'videos', id: string, label: string) {
    if (!window.confirm(`Delete ${label}?`)) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/admin/${kind}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(((await response.json()) as { error?: string }).error || 'Could not delete this item.');
      await load(); setMessage(`${label} deleted.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Delete failed.'); }
    finally { setBusy(false); }
  }

  async function upload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    if (file.size > 100_000_000) { setMessage('Choose a video up to 100 MB.'); return; }
    setBusy(true); setMessage('Uploading video…');
    try {
      const response = await fetch('/api/admin/videos', { method: 'POST', headers: { 'Content-Type': file.type, 'X-File-Name': encodeURIComponent(file.name) }, body: file });
      if (!response.ok) throw new Error(((await response.json()) as { error?: string }).error || 'Upload failed.');
      setFile(null); await load(); setMessage('Video added to The moments.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Upload failed.'); }
    finally { setBusy(false); }
  }

  return <main className="admin-page">
    <div className="admin-header"><a href="/">← Back to website</a><span>NEXT LEVEL EVENTS · ADMIN</span>{authenticated && <button onClick={async () => { await fetch('/api/admin/session', { method: 'DELETE' }); setAuthenticated(false); }}>Sign out</button>}</div>
    <div className="admin-content"><p className="eyebrow orange">SITE MANAGEMENT</p><h1>Admin dashboard</h1>
      {checking ? <p>Loading…</p> : !authenticated ? <form className="admin-login" onSubmit={signIn}><h2>Sign in</h2><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required/></label><button className="button" disabled={busy}>Sign in</button></form> : <>
        <section className="admin-panel"><h2>Reviews <span>{reviews.length}</span></h2>{reviews.length ? <div className="admin-list">{reviews.map(review => <article key={review.id}><div><strong>{review.name}</strong><small>{review.event} · {review.rating} stars</small><p>{review.message}</p></div><button disabled={busy} onClick={() => remove('reviews', review.id, `review by ${review.name}`)}>Delete review</button></article>)}</div> : <p>No reviews yet.</p>}</section>
        <section className="admin-panel"><h2>Moments videos <span>{videos.length}</span></h2><form className="admin-upload" onSubmit={upload}><label>Add a video (MP4, WebM or MOV · maximum 100 MB)<input type="file" accept="video/mp4,video/webm,video/quicktime,.mov" onChange={event => setFile(event.target.files?.[0] || null)}/></label><button className="button" disabled={busy || !file}>Upload video</button></form><div className="admin-list">{videos.map(video => <article key={video.id}><div><strong>{video.name}</strong><small>{video.builtIn ? 'Original video' : 'Uploaded video'}</small></div><button disabled={busy} onClick={() => remove('videos', video.id, video.name)}>Delete video</button></article>)}</div></section>
      </>}
      <p className="admin-message" role="status">{message}</p>
    </div>
  </main>;
}
