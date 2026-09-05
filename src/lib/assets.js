// Photography is self-hosted under public/img/ (pre-optimised WebP) instead of
// hot-linked from Unsplash, so every image loads from the same origin/CDN as
// the site and stays cached. Files are named `<id>-w<W>[-h<H>].webp`; the
// download manifest that produced them lives in the commit history.
//
// `import.meta.env` is injected by Vite and is undefined in plain Node (the
// Prisma seed imports src/data/menu.js), so fall back to a root-relative path.
const BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';

export function photo(id, w, h) {
  return `${BASE}img/${id}-w${w}${h ? `-h${h}` : ''}.webp`;
}
