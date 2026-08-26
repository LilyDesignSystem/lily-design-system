import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideRouter, withEnabledBlockingInitialNavigation, withDebugTracing } from "@angular/router";
import { routes } from "./app.routes";
import { provideHttpClient, withFetch } from "@angular/common/http";

// The example app is signal/OnPush all the way down (matching the
// headless library), so it runs zoneless. Routes come from an explicit
// table built over the page files (see app.routes.ts) rather than
// Analog's provideFileRouter, whose route injection silently fails
// under transform reordering (analogjs/analog#2498).
// `withEnabledBlockingInitialNavigation()` makes the router resolve the
// initial (lazy, file-based) route before the app reports stable, so SSR
// prerender serialises the routed page content instead of an empty shell.
export const config: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ],
};
