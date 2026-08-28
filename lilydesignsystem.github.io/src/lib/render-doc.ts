import { marked } from 'marked';

/**
 * Render one of the repo's canonical markdown documents (synced into
 * src/lib/content by bin/sync) for a site route. Relative links in
 * those documents are written for the repository root, so anything
 * that does not resolve on the site is rewritten to the canonical
 * GitHub URL — the same rule bin/sync-special-files applies to the
 * per-repo copies.
 */
const REPO = 'https://github.com/LilyDesignSystem/lily-design-system/blob/main/';

export function renderDoc(raw: string): string {
  // Drop the top-level H1 (the route supplies its own hero heading).
  const body = raw.replace(/^# [^\n]*\n/, '');
  const html = marked.parse(body, { async: false }) as string;
  return html.replace(/href="(?!https?:|mailto:|#|\/)([^"]+)"/g, `href="${REPO}$1"`);
}
