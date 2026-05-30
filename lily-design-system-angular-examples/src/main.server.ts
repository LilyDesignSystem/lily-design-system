import "zone.js/node";
import { renderApplication } from "@angular/platform-server";
import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { config } from "./app/app.config.server";

// Analog SSR contract (see @analogjs/vite-plugin-nitro/runtime/renderer.ts):
// default export is invoked as `await renderer(url, template, options)`
// and must return the rendered HTML string.
export default async function render(
  url: string,
  document: string,
): Promise<string> {
  return await renderApplication(() => bootstrapApplication(App, config), {
    document,
    url,
  });
}
