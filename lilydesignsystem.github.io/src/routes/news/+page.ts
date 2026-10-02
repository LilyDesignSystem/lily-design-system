import raw from '#lib/content/NEWS.md?raw';
import { renderDoc } from '#lib/render-doc.js';

export const prerender = true;

export function load() {
  return { html: renderDoc(raw) };
}
