export function formatSeoTitle(title: string, brandName: string): string {
  return title === brandName || title.endsWith(` — ${brandName}`)
    ? title
    : `${title} — ${brandName}`;
}
