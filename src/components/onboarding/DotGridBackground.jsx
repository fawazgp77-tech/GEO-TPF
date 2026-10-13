import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function DotGridBackground({ variant = 'page' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    const finePointer = window.matchMedia('(pointer: fine)');
    const local = variant === 'profile';
    const host = local ? canvas.parentElement : window;
    let point = null, frame = 0, width = 0, height = 0;
    function draw() {
      frame = 0;
      context.clearRect(0, 0, width, height);
      const style = getComputedStyle(canvas);
      const dark = document.documentElement.dataset.theme === 'dark';
      const spacing = Math.max(local ? 32 : 28, Math.sqrt(width * height / 3500));
      const active = point && !reduced && finePointer.matches;
      for (let x = 14; x < width; x += spacing) for (let y = 14; y < height; y += spacing) {
        const strength = active ? Math.max(0, 1 - Math.hypot(x - point.x, y - point.y) / 140) : 0;
        context.fillStyle = style.getPropertyValue('--wizard-dot').trim();
        context.globalAlpha = dark ? .28 + .72 * strength : .45 + .55 * strength;
        if (strength && !dark) context.fillStyle = '#52545a';
        context.shadowBlur = dark ? 14 * strength : 0;
        context.shadowColor = '#fff';
        context.beginPath(); context.arc(x, y, 1 + strength * .7, 0, Math.PI * 2); context.fill();
      }
      context.globalAlpha = 1; context.shadowBlur = 0;
    }
    function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(draw); }
    function resize() {
      width = local ? host.clientWidth : window.innerWidth; height = local ? host.clientHeight : window.innerHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * scale; canvas.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0); schedule();
    }
    function move(event) { const rect = local ? canvas.getBoundingClientRect() : { left: 0, top: 0 }; point = event.pointerType === 'mouse' ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : null; schedule(); }
    function leave(event) { if (local || !event.relatedTarget) { point = null; schedule(); } }
    function visibility() { point = null; if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule(); }
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', resize);
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener(local ? 'pointerleave' : 'pointerout', leave, { passive: true });
    const sizeObserver = local ? new ResizeObserver(resize) : null;
    sizeObserver?.observe(host);
    finePointer.addEventListener('change', schedule);
    document.addEventListener('visibilitychange', visibility);
    resize();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); sizeObserver?.disconnect(); window.removeEventListener('resize', resize); host.removeEventListener('pointermove', move); host.removeEventListener(local ? 'pointerleave' : 'pointerout', leave); finePointer.removeEventListener('change', schedule); document.removeEventListener('visibilitychange', visibility); };
  }, [reduced, variant]);
  return <canvas ref={ref} className={variant === 'profile' ? 'profile-dots' : 'wizard-dots'} aria-hidden="true" />;
}
