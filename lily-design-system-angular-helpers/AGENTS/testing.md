# Testing — Lily Angular Helpers

Every helper ships a vitest suite that runs under jsdom +
`@angular/core/testing` `TestBed`. This page lists the test harness
expectations common to all helpers; per-helper acceptance criteria
live in the helper's own `spec.md` §7.

## Stack

- [vitest](https://vitest.dev/) — runner + assertion library.
- [jsdom](https://github.com/jsdom/jsdom) — DOM in Node (configured
  via `vitest.config.ts` → `test.environment = "jsdom"`).
- [`@angular/core/testing`](https://angular.dev/api/core/testing) —
  `TestBed.configureTestingModule`, `TestBed.createComponent`,
  `ComponentFixture`.
- [`@analogjs/vite-plugin-angular`](https://analogjs.org/) — Vite
  plugin that compiles Angular components for vitest. Pinned to
  `1.19.4` to match angular-headless.

## Minimal `vitest.config.ts`

```ts
import angular from "@analogjs/vite-plugin-angular";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [angular()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./test-setup.ts"],
    },
});
```

```ts
// test-setup.ts
import "@analogjs/vitest-angular/setup-zone";

import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { getTestBed } from "@angular/core/testing";

getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
);
```

## Standard mount

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { TestBed, type ComponentFixture } from "@angular/core/testing";
import { ThemePicker } from "./theme-picker.component";

beforeEach(() => {
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});

function mount(inputs: Partial<ThemePicker>): ComponentFixture<ThemePicker> {
    const fixture = TestBed.createComponent(ThemePicker);
    Object.assign(fixture.componentRef.instance as any, {});
    for (const [key, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
}

it("§7.1 renders a fieldset with role=radiogroup", () => {
    const fixture = mount({
        label: "Theme",
        themesUrl: "/themes/",
        themes: ["light", "dark"],
    });
    const root = fixture.nativeElement.querySelector("fieldset");
    expect(root).not.toBeNull();
    expect(root.getAttribute("role")).toBe("radiogroup");
});
```

`setInput` is the Angular 17+ API for setting a signal input from a
test; it's the only way to programmatically write to an `input()`.
Plain assignment to `instance.label = "X"` does not work because
signal inputs are read-only references.

## Common assertions

| Goal                                    | Pattern                                                              |
| --------------------------------------- | -------------------------------------------------------------------- |
| Trigger initial `effect()` ticks        | `fixture.detectChanges();` — sometimes twice in a row for two-step resolution. |
| Find a radio by value                   | `fixture.nativeElement.querySelector('input[type="radio"][value="dark"]')` |
| Toggle a radio                          | `radio.checked = true; radio.dispatchEvent(new Event("change", { bubbles: true })); fixture.detectChanges();` |
| Read the `value` model signal           | `fixture.componentRef.instance.value()`                              |
| Inspect document mutations              | `document.documentElement.dataset.theme`                              |
| Re-mount fresh                          | `fixture.destroy(); /* TestBed.createComponent again */`            |
| `localStorage` round-trip               | `localStorage.setItem(...); /* re-mount */`                          |

## Driving a `[(value)]` test

`[(value)]` desugars to `[value]="x"` plus `(valueChange)="x = $event"`
in Angular 17+. To assert two-way binding, capture the model
emission via `subscribe`:

```ts
const fixture = mount({ label: "T", themesUrl: "/t/", themes: ["a", "b"] });
const emissions: string[] = [];
fixture.componentRef.instance.value.subscribe(v => emissions.push(v));

// trigger change
const radio = fixture.nativeElement.querySelector('input[value="b"]') as HTMLInputElement;
radio.checked = true;
radio.dispatchEvent(new Event("change", { bubbles: true }));
fixture.detectChanges();

expect(emissions.at(-1)).toBe("b");
```

`model()` signals have both a `set()` writer and a subscribable
emissions stream — handy in tests for capturing the two-way
round-trip.

## Asserting output emissions

```ts
const events: string[] = [];
fixture.componentRef.instance.themeChange.subscribe(v => events.push(v));
// drive change …
expect(events).toEqual(["dark"]);
```

## Pure-helper tests

`normaliseThemesUrl`, `themeHref`, `bcp47LocaleTag`, `isRtlLocale`,
`localeName`, `matchNavigatorLanguage` are pure — no `TestBed`
needed:

```ts
import { normaliseThemesUrl, themeHref } from "./theme-picker.component";

it("§7.13 normaliseThemesUrl appends a slash", () => {
    expect(normaliseThemesUrl("/x")).toBe("/x/");
    expect(normaliseThemesUrl("/x/")).toBe("/x/");
});

it("§7.13 themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## SSR sanity

For an SSR sanity test, ensure the component imports cleanly without
touching `document`. Angular's `TestBed` runs in jsdom (which
provides `document`), so a true server render needs
`@angular/ssr` + `@angular/platform-server`. For the lighter check
that "no top-level code accesses `document`", a simple import test
is enough:

```ts
it("imports cleanly without DOM access", async () => {
    const mod = await import("./theme-picker.component");
    expect(mod.ThemePicker).toBeDefined();
});
```

The component's `effect()` runs lazily on first signal access, so a
plain import does no DOM work.

## One test per spec § acceptance

The convention from the Svelte canonical applies: each helper's
`spec.md` §7 numbers its acceptance criteria, and the test file
names each `it(...)` after the section number so a reviewer can
cross-reference the spec without scrolling:

```ts
it("§7.6 resolves the initial theme from `value` when supplied", ...);
```

This is mechanical and intentional — when a clause is added to the
spec, a test must follow.

## Don't

- Don't mock `@angular/core` or the signal graph — use the real
  reactive system.
- Don't mock `document` / `localStorage` — jsdom is enough.
- Don't use snapshot tests for HTML; assert specific attributes and
  text. Snapshots invite drift; targeted asserts catch regressions.
- Don't use `setTimeout` to "wait" — `fixture.detectChanges()` runs
  effects synchronously inside the change-detection tick.
- Don't reach for `ChangeDetectorRef.detectChanges()` or
  `markForCheck()` in tests — the `fixture.detectChanges()` API is
  the public surface.
