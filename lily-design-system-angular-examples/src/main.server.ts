import { renderApplication } from "@angular/platform-server";
import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { config } from "./app/app.config.server";

// Analog SSR contract (see @analogjs/vite-plugin-nitro/runtime/renderer.ts):
// default export is invoked as `await renderer(url, template, options)`
// and must return the rendered HTML string.
//
// Angular 20 runs `bootstrap` with a BootstrapContext (`{ platformRef }`)
// and requires it to be forwarded to `bootstrapApplication` as the third
// argument; without it server bootstrap throws NG0401 (PLATFORM_NOT_FOUND).
export default async function render(
  url: string,
  document: string,
): Promise<string> {
  return await renderApplication(
    (context) => bootstrapApplication(App, config, context),
    {
      document,
      url,
    },
  );
}
