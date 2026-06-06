# i18n integration

`LocalePicker` is intentionally not an i18n library. It changes
the document language and tells you when the user changed it; the
actual string substitution is your i18n library's job.

This page shows how to wire the picker to the three most common
Angular i18n stacks: **@angular/localize** (the built-in),
**Transloco** (most popular runtime library), and
**ngx-translate** (older alternative).

The wiring pattern is always the same:

1. Bind `value` to a signal that mirrors your i18n library's
   current locale.
2. Listen to `(localeChange)` for one-shot side effects (loading
   message bundles, refetching locale-dependent data, navigating
   to a localised URL).
3. (Optionally) pre-seed `value` server-side for flicker-free
   SSR.

---

## @angular/localize

Angular's built-in i18n extracts marked strings at build time and
substitutes them at runtime. The `LOCALE_ID` injection token
controls everything; changing it requires re-bootstrapping the
app.

The picker can't dynamically switch `LOCALE_ID` (that's an Angular
limitation, not a helper limitation). The common pattern is to
build one bundle per locale and let the picker drive a hard
navigation:

```ts
import { Component, inject, signal } from "@angular/core";
import { LOCALE_ID } from "@angular/core";
import { LocalePicker } from "../locale-picker.component";

@Component({
    selector: "app-language",
    standalone: true,
    imports: [LocalePicker],
    template: `
        <lily-locale-picker
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="current"
            (localeChange)="navigate($event)"
        />
    `,
})
export class LanguageMenu {
    private readonly currentLocale = inject(LOCALE_ID);
    current = signal<string>(this.currentLocale);

    navigate(next: string): void {
        // Each locale ships at its own subpath (`/en/…`, `/fr/…`).
        // Trigger a full navigation so the bundled locale loads.
        if (typeof window !== "undefined") {
            window.location.href = `/${next}${window.location.pathname.replace(/^\/(en|fr|ar)/, "")}`;
        }
    }
}
```

`@angular/localize` is best for SEO-distinct URLs per locale.
Runtime locale-switching needs Transloco or ngx-translate.

---

## Transloco

[Transloco](https://jsverse.gitbook.io/transloco/) is the most
common Angular runtime i18n library. Its `TranslocoService` has
an `activeLang$` observable and a `setActiveLang()` method.

```ts
import { Component, inject, signal } from "@angular/core";
import { TranslocoService, TranslocoModule } from "@jsverse/transloco";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LocalePicker } from "../locale-picker.component";

@Component({
    selector: "app-language",
    standalone: true,
    imports: [LocalePicker, TranslocoModule],
    template: `
        <lily-locale-picker
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="current"
            storageKey="app-locale"
            [detectFromNavigator]="true"
            (localeChange)="onLocaleChange($event)"
        />

        <h1>{{ 'home.heading' | transloco }}</h1>
        <p>{{ 'home.body' | transloco }}</p>
    `,
})
export class LanguageMenu {
    private transloco = inject(TranslocoService);
    current = signal<string>(this.transloco.getActiveLang());

    onLocaleChange(code: string): void {
        this.transloco.setActiveLang(code);
    }
}
```

Wire `current` to Transloco's `activeLang$` if you want the picker
to react to programmatic locale changes from elsewhere in the
app:

```ts
constructor() {
    this.transloco.langChanges$
        .pipe(takeUntilDestroyed())
        .subscribe((lang) => this.current.set(lang));
}
```

---

## ngx-translate

[ngx-translate](https://github.com/ngx-translate/core) predates
Transloco and is still maintained. `TranslateService` exposes
`use(lang)` and an `onLangChange` event.

```ts
import { Component, inject, signal } from "@angular/core";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { LocalePicker } from "../locale-picker.component";

@Component({
    selector: "app-language",
    standalone: true,
    imports: [LocalePicker, TranslateModule],
    template: `
        <lily-locale-picker
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="current"
            storageKey="app-locale"
            (localeChange)="onLocaleChange($event)"
        />

        <h1>{{ 'home.heading' | translate }}</h1>
        <p>{{ 'home.body' | translate }}</p>
    `,
})
export class LanguageMenu {
    private translate = inject(TranslateService);
    current = signal<string>(this.translate.currentLang ?? "en");

    onLocaleChange(code: string): void {
        this.translate.use(code);
    }
}
```

`translate.use(code)` returns an observable; the rest of the app
reacts via the `translate` pipe (or `TranslateService.onLangChange`).

---

## Raw `Intl.*`

For apps with a handful of strings and no formal i18n library,
store the locale in a signal and pass it to `Intl` formatters
directly. The picker still owns the `lang` / `dir` lifecycle:

```ts
import { Component, computed, signal } from "@angular/core";
import { LocalePicker } from "../locale-picker.component";

@Component({
    selector: "app-language",
    standalone: true,
    imports: [LocalePicker],
    template: `
        <lily-locale-picker
            label="Language"
            [locales]="['en', 'en-US', 'fr', 'fr-CA', 'ar']"
            [(value)]="locale"
            storageKey="app-locale"
        />

        <p>Today: {{ dateFmt().format(today) }}</p>
        <p>Balance: {{ currencyFmt().format(balance) }}</p>
        <p>Population: {{ numFmt().format(67330000) }}</p>
    `,
})
export class LanguageMenu {
    locale = signal("en");

    dateFmt = computed(() =>
        new Intl.DateTimeFormat(this.locale(), { dateStyle: "long" }),
    );
    numFmt = computed(() => new Intl.NumberFormat(this.locale()));
    currencyFmt = computed(() =>
        new Intl.NumberFormat(this.locale(), {
            style: "currency",
            currency: "GBP",
        }),
    );

    readonly today = new Date();
    readonly balance = 1234.56;
}
```

`Intl.*` formatters accept both `en_US` and `en-US`; they
normalise internally. The bindable `value` works either way.

---

## URL-prefix strategies

URLs like `/en/about` and `/fr/about` are crawlable by search
engines and shareable as locale-specific links. The pattern uses
an Angular dynamic route segment.

```ts
import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalePicker } from "../locale-picker.component";

@Component({
    selector: "app-language",
    standalone: true,
    imports: [LocalePicker],
    template: `
        <lily-locale-picker
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [value]="current()"
            (localeChange)="navigate($event)"
        />
    `,
})
export class LanguageMenu {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    current = signal<string>(
        this.route.snapshot.paramMap.get("locale") ?? "en",
    );

    navigate(next: string): void {
        const path = this.router.url.replace(/^\/(en|fr|ar)/, `/${next}`);
        this.router.navigateByUrl(path);
    }
}
```

Set `<html lang dir>` from the route param in the same way as the
cookie strategy (server middleware + environment initializer).

---

## Cookie-based persistence (server)

`localStorage` persistence flickers on first paint because the
server renders the default locale before the client reads
storage. Prefer a cookie when you have an Analog server:

```ts
// src/server/middleware/locale.ts
import { defineEventHandler, getCookie } from "h3";

export default defineEventHandler((event) => {
    const cookie = getCookie(event, "locale") ?? "en";
    event.context.locale = cookie;
});
```

```ts
// Bridge into the Angular tree via INITIAL_LOCALE — see docs/ssr.md.
```

The page arrives with the correct `lang` and `dir` already on
`<html>`, no flash. See [./ssr.md](./ssr.md) for more.

---

## Picking the right strategy

| Need                                              | Strategy                |
| ------------------------------------------------- | ----------------------- |
| One small SPA, English + French only              | Raw `Intl.*`            |
| Build-time per-locale bundles, SEO URLs           | `@angular/localize`     |
| Runtime locale switch, tree-shaken bundles        | Transloco               |
| Runtime locale switch, legacy app                 | ngx-translate           |
| SEO-friendly URLs per locale                      | URL-prefix routing      |
| No FOUC, cookie-backed, server-rendered           | Cookie + injection token |

The picker is the same in every case. Only the
`[(value)]` target and the `(localeChange)` body change.
