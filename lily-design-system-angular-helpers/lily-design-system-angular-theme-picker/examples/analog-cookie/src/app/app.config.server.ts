// src/app/app.config.server.ts
//
// Server-only Angular config: writes <html data-theme="…"> via the
// DOCUMENT injection token before the picker hydrates, so the very
// first paint already shows the user's chosen theme.

import {
    ApplicationConfig,
    inject,
    mergeApplicationConfig,
    provideEnvironmentInitializer,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

// In a real Analog project, appConfig comes from "./app.config".
// We import it inline as a stub for portability.
declare const appConfig: ApplicationConfig;

import { INITIAL_THEME } from "./tokens/initial-theme";

const serverConfig: ApplicationConfig = {
    providers: [
        provideEnvironmentInitializer(() => {
            const doc = inject(DOCUMENT);
            const slug = inject(INITIAL_THEME);
            doc.documentElement.setAttribute("data-theme", slug);
        }),
    ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
