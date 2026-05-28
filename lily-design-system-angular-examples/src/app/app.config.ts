import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";
import { provideFileRouter } from "@analogjs/router";
import { provideHttpClient, withFetch } from "@angular/common/http";

// The example app is signal/OnPush all the way down (matching the
// headless library), so it runs zoneless. Provide the file router so
// the file-based routes under src/app/pages/ wire up automatically.
export const config: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideFileRouter(),
    provideHttpClient(withFetch()),
  ],
};
