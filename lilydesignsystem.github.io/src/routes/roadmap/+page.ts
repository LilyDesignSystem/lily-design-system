import raw from '$lib/content/plan.md?raw';
import { renderDoc } from '$lib/render-doc';

export const prerender = true;

export function load() {
  return { html: renderDoc(raw) };
}
