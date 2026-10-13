import { useEffect, useRef, useState } from 'react';
import videoSource from '../../../Login-page.mp4?url';
import poster from '../../assets/auth-poster.svg';

export default function AuthBackground({ src = videoSource }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(error => {
      if (error.name !== 'AbortError') setFailed(true);
    });
    return () => video.pause();
  }, [failed, src]);
  return <div className="auth-background" aria-hidden="true">
    <img className="auth-background-poster" src={poster} alt="" />
    {!failed && <video ref={videoRef} className={`auth-background-video ${playing ? 'is-playing' : ''}`} src={src}
      poster={poster} muted autoPlay loop playsInline preload="metadata" tabIndex={-1}
      onPlaying={() => setPlaying(true)} onError={() => setFailed(true)} />}
    <div className="auth-background-overlay" />
  </div>;
}
