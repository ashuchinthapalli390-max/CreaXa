/** Example only. Use official provider iframe URLs; never proxy/copy original files without permission. */
export function getPermittedVimeoEmbed(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'player.vimeo.com') return null;
    const match = parsed.pathname.match(/^\/video\/(\d+)\/?$/);
    if (!match) return null;
    return `https://player.vimeo.com/video/${match[1]}?title=0&byline=1&portrait=0`;
  } catch { return null; }
}
// Use frame-src CSP allowlist, lazy loading, standard attribution, and a prominent official-source fallback.
