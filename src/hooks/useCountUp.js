import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

// Counts from 0 to `target` once the element scrolls into view. Honours
// prefers-reduced-motion by jumping straight to the final value.
export function useCountUp(target, duration = 1400) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [value, setValue] = useState(() => (reduced ? target : 0));
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return undefined;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Snap to the final value if the section is already scrolled past.
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          startedRef.current = true;
          setValue(target);
          return;
        }
        if (entry.isIntersecting) run();
      },
      { threshold: [0, 0.25] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, reduced]);

  return [ref, value];
}
