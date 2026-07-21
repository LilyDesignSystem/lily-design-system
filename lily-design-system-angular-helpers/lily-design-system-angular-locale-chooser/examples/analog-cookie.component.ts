/*
    Analog v1 SSR with cookie persistence.

    No flash of default locale: the server reads the cookie via the
    INITIAL_LOCALE injection token, fills <html lang dir> via a
    server-only environment initializer, and seeds the select with
    `value` via the same token on the client.

    This file is the root component. The companion server-side
    pieces (middleware, token, server config, POST endpoint) are
    shown as comments below; they live in their own files.

    Outcome: every request paints with the right lang/dir from byte
    zero. Choosing a locale rewrites the cookie via a fetch to
    /api/locale and updates the DOM in the same tick.
*/
import {
    ChangeDetectionStrategy,
    Component,
    InjectionToken,
    inject,
    signal,
} from "@angular/core";
import { LocaleChooser } from "../locale-chooser.component";

// In a real Analog project, REQUEST is imported from
// "@analogjs/router/tokens". We declare a local stand-in here so
// this file compiles outside an Analog project.
const REQUEST = new InjectionToken<unknown>("REQUEST");

const INITIAL_LOCALE = new InjectionToken<string>("INITIAL_LOCALE", {
    providedIn: "root",
    factory: () => {
        const req = inject(REQUEST, { optional: true });
        if (!req) {
            if (typeof document === "undefined") return "en";
            const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : "en";
        }
        const ctx = (req as { context?: { locale?: string } }).context;
        return ctx?.locale ?? "en";
    },
});

@Component({
    selector: "example-analog-cookie",
    standalone: true,
    imports: [LocaleChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-locale-chooser
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="locale"
            (localeChange)="persistLocaleCookie($event)"
        />

        <p>Selected locale: <code>{{ locale() }}</code></p>

        <!--
            Companion files (place in your Analog project):

            src/server/middleware/locale.ts ────────────────────────
            import { defineEventHandler, getCookie, getRequestHeader } from "h3";

            const SUPPORTED = ["en", "fr", "ar"];

            function pickFromAcceptLanguage(header) {
                if (!header) return "en";
                for (const item of header.split(",")) {
                    const tag = item.split(";")[0].trim().toLowerCase();
                    if (SUPPORTED.includes(tag)) return tag;
                    const base = tag.split("-")[0];
                    if (SUPPORTED.includes(base)) return base;
                }
                return "en";
            }

            export default defineEventHandler((event) => {
                const cookie = getCookie(event, "locale");
                event.context.locale = cookie ?? pickFromAcceptLanguage(
                    getRequestHeader(event, "accept-language"),
                );
            });

            src/server/routes/api/locale.post.ts ───────────────────
            import { defineEventHandler, readBody, setCookie } from "h3";
            const SUPPORTED = new Set(["en", "fr", "ar"]);
            export default defineEventHandler(async (event) => {
                const body = (await readBody(event)) ?? {};
                const code = String(body.locale ?? "");
                if (!SUPPORTED.has(code)) {
                    event.node.res.statusCode = 400;
                    return { error: "Unknown locale" };
                }
                setCookie(event, "locale", code, {
                    path: "/", httpOnly: false, sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 365,
                });
                event.node.res.statusCode = 204;
                return null;
            });

            src/app/app.config.server.ts ──────────────────────────
            import { DOCUMENT } from "@angular/common";
            import {
                inject, mergeApplicationConfig, provideEnvironmentInitializer,
            } from "@angular/core";
            import { appConfig } from "./app.config";
            import { INITIAL_LOCALE } from "./tokens/initial-locale";
            import { bcp47LocaleTag, isRtlLocale } from "../locale-chooser.component";

            export const config = mergeApplicationConfig(appConfig, {
                providers: [
                    provideEnvironmentInitializer(() => {
                        const doc = inject(DOCUMENT);
                        const code = inject(INITIAL_LOCALE);
                        doc.documentElement.setAttribute("lang", bcp47LocaleTag(code));
                        doc.documentElement.setAttribute(
                            "dir",
                            isRtlLocale(code) ? "rtl" : "ltr",
                        );
                    }),
                ],
            });
        -->
    `,
})
export class AnalogCookieExample {
    locale = signal(inject(INITIAL_LOCALE));

    async persistLocaleCookie(code: string): Promise<void> {
        if (typeof fetch === "undefined") return;
        await fetch("/api/locale", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ locale: code }),
        });
    }
}
