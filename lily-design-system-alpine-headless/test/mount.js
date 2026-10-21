// Test harness: mount a component snippet under Alpine in jsdom.
// Each component test loads components/{slug}.html (the shipped file),
// starts Alpine on it, and drives it with real DOM events.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import Alpine from "alpinejs";
import lily from "../lily-alpine.js";

const here = dirname(fileURLToPath(import.meta.url));
let started = false;

export function snippet(slug) {
  return readFileSync(join(here, "..", "components", `${slug}.html`), "utf8");
}

/** Mount a snippet's markup in document.body and let Alpine initialise it. */
export async function mount(slug, html = snippet(slug)) {
  window.Alpine = Alpine;
  if (!started) {
    Alpine.plugin(lily);
    Alpine.start();
    started = true;
  }
  document.body.innerHTML = html;
  await tick();
  return document.body;
}

/** Wait for Alpine's microtask-batched DOM updates. */
export const tick = () => new Promise((r) => setTimeout(r, 0));
