import { useEffect, useState } from 'react';

// Tracks which of the given section ids is currently in view, so the header
// nav can highlight it. Returns '' until a section crosses the trigger line.
export function useActiveSection(ids) {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
