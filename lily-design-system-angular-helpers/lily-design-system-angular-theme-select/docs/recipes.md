# Recipes

Short solutions to common adjacent problems. Each recipe is the
smallest code that solves the problem; production code may want
more error handling.

## Follow the OS colour scheme on first visit

```ts
import { Component, signal } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark']"
            [defaultValue]="prefersDark ? 'dark' : 'light'"
            storageKey="my-app:theme"
        />
    `,
})
export class Settings {
    readonly prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}
```

The user's explicit choice (via `storageKey`) wins on later
visits.

## Track OS colour scheme changes live

```ts
import { Component, DestroyRef, inject, signal, effect } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark']"
            [(value)]="theme"
        />
    `,
})
export class Settings {
    theme = signal("");
    private destroyRef = inject(DestroyRef);

    constructor() {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            this.theme.set(e.matches ? "dark" : "light");
        };
        mql.addEventListener("change", handler);
        this.destroyRef.onDestroy(() => mql.removeEventListener("change", handler));
    }
}
```

## Read a theme cookie before render (Analog)

See [`../examples/analog-cookie/`](../examples/analog-cookie/) for
the full recipe.

## Migrate from a localStorage-only select to a cookie-backed one

1. Keep `storageKey` for now so existing users don't lose their
   preference.
2. In the `(themeChange)` handler, also `fetch("/api/theme", {
   method: "POST", body: ... })` to write the cookie.
3. On the server, prefer the cookie. On the client, prefer the
   server-supplied value via `[value]="…"` (which short-circuits
   the storage read).

## Serve themes from a CDN

```html
<lily-theme-select
    themesUrl="https://cdn.example.com/lily-themes/"
    [themes]="['light', 'dark', 'abyss']"
    label="Theme"
/>
```

The CDN must allow cross-origin stylesheet loading (a stylesheet
served from a different origin does not need CORS for application,
but a `<link crossorigin="…">` attribute is needed if you also
need `document.styleSheets[].cssRules` access from the same
origin).

## Cache-bust a theme

```html
<lily-theme-select
    themesUrl="/assets/themes/"
    [themes]="['light', 'dark']"
    extension=".css?v=2026-06-05"
    label="Theme"
/>
```

The extension is concatenated verbatim, so anything that comes
after the slug works.

## Multiple regions with independent themes

See [`../examples/multiple-selects.component.ts`](../examples/multiple-selects.component.ts).
Each select gets a distinct `name` (so the hidden inputs and the
managed `<link>`s don't collide) and a distinct `target` (so
`data-theme` goes on the section root rather than `<html>`).

## Programmatically switch themes from a sibling component

The bindable `value` is the simplest channel. Hoist `theme` to a
shared service, and write to it from anywhere:

```ts
import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ThemeStore {
    readonly theme = signal("");
}
```

```ts
// in the select host
@Component({
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark']"
            [(value)]="store.theme"
        />
    `,
})
export class Settings {
    constructor(public store: ThemeStore) {}
}
```

```ts
// in a sibling
@Component({
    template: `<button (click)="goNight()">Go dark</button>`,
})
export class Sidebar {
    constructor(private store: ThemeStore) {}
    goNight() { this.store.theme.set("dark"); }
}
```

## Sync theme across multiple tabs

`localStorage` writes fire a `storage` event in other tabs:

```ts
import { Component, DestroyRef, inject, signal } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark']"
            [(value)]="theme"
            storageKey="my-app:theme"
        />
    `,
})
export class Settings {
    theme = signal("");
    private destroyRef = inject(DestroyRef);

    constructor() {
        if (typeof window === "undefined") return;
        const handler = (e: StorageEvent) => {
            if (e.key === "my-app:theme" && e.newValue) {
                this.theme.set(e.newValue);
            }
        };
        window.addEventListener("storage", handler);
        this.destroyRef.onDestroy(() => window.removeEventListener("storage", handler));
    }
}
```

## Bind to a Router param

Pull the theme from a query param so URLs like `/settings?theme=dark`
preselect it:

```ts
import { Component, signal, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ThemeSelect } from "../theme-select.component";

@Component({
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark']"
            [(value)]="theme"
            (themeChange)="syncRoute($event)"
        />
    `,
})
export class Settings {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    theme = signal<string>(this.route.snapshot.queryParamMap.get("theme") ?? "");

    syncRoute(slug: string) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { theme: slug },
            queryParamsHandling: "merge",
        });
    }
}
```

---

Lily™ and Lily Design System™ are trademarks.
