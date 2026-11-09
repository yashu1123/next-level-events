'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';

type SiteVideo = { id: string; name: string; url: string; builtIn: boolean };
const initialVideos: SiteVideo[] = ['video1.mp4', 'Video 2.mp4', 'video3.mp4', 'video 4.mp4', 'video 5.mp4', 'Video 6.mp4'].map((name, index) => ({ id: `built-in-${index + 1}`, name, url: `/moments/${encodeURIComponent(name)}`, builtIn: true }));

export default function MomentsSection() {
  const [videos, setVideos] = useState(initialVideos);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState('');
  const video = useRef<HTMLVideoElement>(null);
  const request = useRef(0);

  useEffect(() => { fetch('/api/videos').then(response => response.ok ? response.json() : null).then(data => { if (Array.isArray(data)) { setVideos(data); setActive(0); } }).catch(() => {}); }, []);

  function select(index: number) {
    if (!videos.length || (index + videos.length) % videos.length === active) return;
    request.current++;
    video.current?.pause();
    setError('');
    setActive((index + videos.length) % videos.length);
  }

  function play() {
    const current = video.current;
    if (!current) return;
    const attempt = ++request.current;
    setError('');
    setPlaying(true);
    current.play().catch(() => {
      if (attempt !== request.current) return;
      setPlaying(false);
      setError('Press Play to start this moment.');
    });
  }

  useEffect(() => {
    if (playing || videos.length < 2) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % videos.length), 5000);
    return () => window.clearTimeout(timer);
  }, [active, playing, videos.length]);

  useEffect(() => {
    const current = video.current;
    if (!current || !playing || !videos.length) return;
    const attempt = ++request.current;
    current.play().catch(() => {
      if (attempt !== request.current) return;
      setPlaying(false);
      setError('Press Play to start this moment.');
    });
    return () => { request.current++; };
  }, [active, playing, videos]);

  return <section id="moments" className="section moments" aria-labelledby="moments-title">
    <div className="section-heading"><div>
      <p className="eyebrow orange">03 / THE FEELING, IN FRAMES</p>
      <h2 id="moments-title">The <em>moments</em></h2>
    </div></div>
    <div className="moments-carousel" role="region" aria-roledescription="carousel" aria-label="Event videos">
      <div className="moment-stage" role="group" aria-roledescription="slide" aria-label={`Moment ${active + 1} of ${videos.length}`}>
        <div className="moment-side moment-side-left" aria-hidden="true"><span className="moment-side-kicker">NEXT LEVEL EVENTS</span><span className="moment-side-number">{String(active + 1).padStart(2, '0')}</span><span className="moment-side-line"/><span className="moment-side-caption">A little glimpse of<br/>the energy we bring.</span></div>
        <div className="moment-side moment-side-right" aria-hidden="true"><span className="moment-orbit"><span>✳</span></span><span className="moment-side-vertical">LIVE · CELEBRATE · REMEMBER</span><span className="moment-side-caption">Moments that stay<br/>with you.</span></div>
        {videos.length > 0 && <video ref={video} src={`${videos[active]?.url}#t=0.001`} playsInline preload="metadata" muted={muted}
          aria-label={`Event moment ${active + 1}`}
          onEnded={() => select(active + 1)}
          onError={() => { request.current++; setPlaying(false); setError('This video could not load. Try another moment.'); }} />}
        {!videos.length && <p className="moment-empty">New moments are coming soon.</p>}
        {!!videos.length && !playing && <button className="moment-play" onClick={play} aria-label="Play moments"><Play size={30} fill="currentColor"/><span>Play</span></button>}
      </div>
      {!!videos.length && <div className="moment-controls">
        <button onClick={() => { if (playing) { request.current++; video.current?.pause(); setPlaying(false); } else play(); }} aria-label={playing ? 'Pause moments' : 'Play moments'}>{playing ? <Pause size={19}/> : <Play size={19}/>}<span>{playing ? 'Pause' : 'Play'}</span></button>
        <button onClick={() => setMuted(value => !value)} aria-label={muted ? 'Unmute videos' : 'Mute videos'} aria-pressed={muted}>{muted ? <VolumeX size={19}/> : <Volume2 size={19}/>}<span>{muted ? 'Unmute' : 'Mute'}</span></button>
        <div className="moment-navigation">
          <button onClick={() => select(active - 1)} aria-label="Previous moment"><ChevronLeft size={20}/></button>
          <span className="moment-count">{String(active + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</span>
          <button onClick={() => select(active + 1)} aria-label="Next moment"><ChevronRight size={20}/></button>
        </div>
      </div>}
      <div className="moment-dots" aria-label="Choose a moment">{videos.map((item, index) => <button key={item.id} className={index === active ? 'active' : ''} aria-label={`Show moment ${index + 1}`} aria-current={index === active ? 'true' : undefined} onClick={() => select(index)}/>)}</div>
      {error && <p className="moment-error" role="status">{error}</p>}
    </div>
  </section>;
}
