import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from "@angular/core";
import { provideFileRouter } from "@analogjs/router";
import { withEnabledBlockingInitialNavigation } from "@angular/router";
import { provideHttpClient, withFetch } from "@angular/common/http";

// The example app is signal/OnPush all the way down (matching the
// headless library), so it runs zoneless. Provide the file router so
// the file-based routes under src/app/pages/ wire up automatically.
// `withEnabledBlockingInitialNavigation()` makes the router resolve the
// initial (lazy, file-based) route before the app reports stable, so SSR
// prerender serialises the routed page content instead of an empty shell.
export const config: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideFileRouter(withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch()),
  ],
};
