# Testing — Lily HTML Helpers

Every helper ships a vitest suite that runs under jsdom. This page
lists the test harness expectations common to all helpers; per-helper
acceptance criteria live in the helper's own `spec.md` §7.

## Stack

- [vitest](https://vitest.dev/) — runner + assertion library.
- [jsdom](https://github.com/jsdom/jsdom) — DOM in Node, configured
  via `vitest.config.ts` → `test.environment = "jsdom"`. jsdom
  supports `customElements.define`, `attributeChangedCallback`,
  `CustomEvent`, and `localStorage` out of the box.

## Minimal `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
    },
});
```

No bundler-side plugins; the class file is plain TypeScript and
vitest's built-in TS transform handles it.

## Standard mount

Custom elements work by appending the element to `document.body`
and letting the platform call `connectedCallback`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import "./index"; // side-effectfully registers <theme-select>
import type { ThemeSelect } from "./theme-select";

beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});

it("renders a select with an accessible name", () => {
    const el = document.createElement("theme-select") as ThemeSelect;
    el.setAttribute("label", "Theme");
    el.setAttribute("themes-url", "/themes/");
    el.setAttribute("themes", "light,dark");
    document.body.appendChild(el); // triggers connectedCallback

    const root = el.querySelector("select");
    expect(root).not.toBeNull();
    expect(root!.getAttribute("aria-label")).toBe("Theme");
});
```

## Setting attributes before vs after `appendChild`

Attributes set before `appendChild` are picked up in
`connectedCallback`. Attributes set after `appendChild` flow through
`attributeChangedCallback`. Tests assert both pathways.

```ts
// Pre-append:
const el = document.createElement("theme-select") as ThemeSelect;
el.setAttribute("themes", "light,dark");
document.body.appendChild(el);

// Post-append:
el.setAttribute("themes", "light,dark,abyss"); // triggers attributeChangedCallback
```

## Setting JS properties

Property setters are equivalent to attribute writes for string
attributes and use JSON / CSV encoding for arrays / objects:

```ts
el.themes = ["light", "dark", "abyss"]; // writes themes="light,dark,abyss"
el.themeLabels = { light: "Bright" };   // writes theme-labels='{"light":"Bright"}'
```

Tests verify both setter forms produce the same DOM:

```ts
const a = createSelect({ "themes": "light,dark" });
const b = createSelect({});
b.themes = ["light", "dark"];

expect(a.querySelectorAll("option").length).toBe(2);
expect(b.querySelectorAll("option").length).toBe(2);
```

## Common assertions

| Goal                                | Pattern                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| Wait for `connectedCallback`        | Append; the callback is synchronous in jsdom.                                 |
| Find an option by value             | `el.querySelector('option[value="dark"]')`                                    |
| Change the selection                | `select.value = "dark"; select.dispatchEvent(new Event("change"))`            |
| Capture a CustomEvent               | `let detail; el.addEventListener("themechange", (e) => detail = e.detail);`   |
| Inspect document mutations          | `document.documentElement.dataset.theme`                                      |
| Re-mount fresh                      | `el.remove(); document.body.appendChild(otherEl);`                            |
| `localStorage` round-trip           | `localStorage.setItem(...); /* re-create element */`                          |

## Capturing CustomEvents

```ts
const events: ThemeSelectChangeDetail[] = [];
el.addEventListener("themechange", (e) => {
    events.push((e as CustomEvent<ThemeSelectChangeDetail>).detail);
});
el.value = "dark"; // triggers attributeChangedCallback → applyTheme → dispatchEvent
expect(events.at(-1)).toEqual({ theme: "dark" });
```

Because the event has `bubbles: true`, a listener on `document.body`
also works:

```ts
document.body.addEventListener("themechange", (e) => { /* … */ });
```

## Triggering a select change

```ts
const select = el.querySelector<HTMLSelectElement>("select")!;
select.value = "dark";
select.dispatchEvent(new Event("change", { bubbles: true }));
```

The element's `change` listener (attached in `#render()`) writes to
`el.value`, which feeds back through `attributeChangedCallback` →
`#applyTheme()` → `dispatchEvent`.

## Asserting the managed `<link>` (theme select)

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-select="theme"]',
);
expect(link).not.toBeNull();
expect(link!.href).toMatch(/\/themes\/light\.css$/);
```

`href` on an `HTMLLinkElement` resolves to an absolute URL in
jsdom, so use a regex with the suffix rather than an exact match.

## Asserting `data-theme` / `lang` / `dir`

```ts
expect(document.documentElement.dataset.theme).toBe("dark");
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting `localStorage`

```ts
expect(localStorage.getItem("lily-theme")).toBe("dark");
```

Run `localStorage.clear()` in `beforeEach` to keep tests isolated.

## Mocking `navigator.languages`

```ts
Object.defineProperty(navigator, "languages", {
    configurable: true,
    get: () => ["fr-FR", "en"],
});
```

`configurable: true` is essential; otherwise subsequent
`defineProperty` calls throw. Reset between tests via another
`defineProperty` call or by spreading inside `beforeEach`.

## Pure-helper tests

`normalizeThemesUrl`, `themeHref`, `bcp47LocaleTag`, `isRtlLocale`,
`localeName`, and `matchNavigatorLanguage` are pure — no element
mount needed:

```ts
import { normalizeThemesUrl, themeHref } from "./theme-select";

it("§7.7 normalizeThemesUrl appends a slash", () => {
    expect(normalizeThemesUrl("/x")).toBe("/x/");
    expect(normalizeThemesUrl("/x/")).toBe("/x/");
});

it("themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## Subclass tests (custom rendering)

The HTML helpers expose "custom rendering" by subclassing the class
and overriding `#render()`. The pattern is:

```ts
import { ThemeSelect } from "./theme-select";

class SwatchPicker extends ThemeSelect {
    // Override the private render via a public hook.
    // (See per-helper API.md for the exact extension surface.)
}
customElements.define("swatch-picker", SwatchPicker);
```

Tests assert that the subclassed element still owns the lifecycle
(managed `<link>`, `data-theme` write, `themechange` event) while
emitting bespoke option markup.

## SSR sanity

The custom-element classes themselves don't have an SSR path — they
register only in browsers. The SSR check is "the module imports
cleanly in a Node context with `customElements` undefined":

```ts
it("the class module is import-safe under SSR", async () => {
    // Simulate an environment without customElements.
    const original = (globalThis as any).customElements;
    delete (globalThis as any).customElements;
    try {
        // Importing the barrel must not throw.
        const mod = await import("./index");
        expect(mod.ThemeSelect).toBeDefined();
    } finally {
        (globalThis as any).customElements = original;
    }
});
```

In practice the spec.md §7 list is exhaustive; subclass and SSR
checks are recommended but optional.

## One test per §7 acceptance

Each helper's `spec.md` §7 numbers its acceptance criteria; the test
file names each `it(...)` after the section number so a reviewer
can cross-reference the spec without scrolling:

```ts
it("§7.6 resolves the initial theme from `value` when supplied", ...);
```

When a clause is added to the spec, a test must follow.

## Don't

- Don't reach for Shadow DOM in tests; the helpers use light DOM by
  contract.
- Don't mock `document` / `localStorage` — jsdom is enough.
- Don't snapshot HTML; assert specific attributes and text.
- Don't use `setTimeout` to "wait" — `attributeChangedCallback` is
  synchronous in jsdom.
