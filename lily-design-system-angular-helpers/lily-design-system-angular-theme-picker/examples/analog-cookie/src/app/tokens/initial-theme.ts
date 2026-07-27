// src/app/tokens/initial-theme.ts
//
// Injection token that resolves the theme on both server and client:
//  - On the server, reads what the middleware stashed on event.context.
//  - On the client, parses `document.cookie`.
//
// Consumers inject INITIAL_THEME to seed their theme signal with the
// right value for the very first paint.

import { InjectionToken, inject } from "@angular/core";
// In a real Analog project, REQUEST comes from "@analogjs/router/tokens".
// Importing it conditionally would complicate the module shape; we
// declare it inline as a typed `unknown` token for portability.
import { REQUEST } from "@analogjs/router/tokens";

const DEFAULT = "light";

export const INITIAL_THEME = new InjectionToken<string>("INITIAL_THEME", {
    providedIn: "root",
    factory: () => {
        const req = inject(REQUEST, { optional: true });
        if (!req) {
            // Client side — read the cookie directly.
            if (typeof document === "undefined") return DEFAULT;
            const match = document.cookie.match(/(?:^|; )theme=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : DEFAULT;
        }
        // Server side — read what the middleware stashed.
        const ctx = (req as { context?: { theme?: string } }).context;
        return ctx?.theme ?? DEFAULT;
    },
});
