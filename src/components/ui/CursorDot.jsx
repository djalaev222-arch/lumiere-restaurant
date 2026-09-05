import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import './cursor-dot.css';

const INTERACTIVE = 'a, button, input, select, textarea, [role="tab"], summary, label';

const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

// A small trailing cursor dot for fine-pointer desktops. Purely decorative —
// skipped entirely for touch devices and reduced-motion users.
export default function CursorDot() {
  const reduced = useReducedMotion();
  const enabled = !reduced && canHover();
  const dotRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;

    // Start off-screen so the dot only appears once the pointer actually moves.
    const pos = { x: -100, y: -100 };
    const target = { ...pos };

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    const onOver = (event) => {
      const active = event.target.closest?.(INTERACTIVE);
      dotRef.current?.classList.toggle('is-active', Boolean(active));
    };
    const onDown = () => dotRef.current?.classList.add('is-down');
    const onUp = () => dotRef.current?.classList.remove('is-down');

    const render = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div className="cursor-dot" ref={dotRef} aria-hidden="true" />;
}
