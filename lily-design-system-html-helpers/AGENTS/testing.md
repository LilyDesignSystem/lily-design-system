# Testing — Lily HTML Helpers

Every helper ships a vitest suite that runs under jsdom. This page
lists the test harness expectations common to all helpers; per-helper
acceptance criteria live in the helper's own `spec/index.md` §7.

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
import "./index"; // side-effectfully registers <theme-chooser>
import type { ThemeChooser } from "./theme-chooser";

beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});

it("renders a button with an accessible name", () => {
    const el = document.createElement("theme-chooser") as ThemeChooser;
    el.setAttribute("label", "Theme");
    el.setAttribute("themes-url", "/themes/");
    el.setAttribute("themes", "light,dark");
    document.body.appendChild(el); // triggers connectedCallback

    const button = el.querySelector(".theme-chooser-button");
    expect(button).not.toBeNull();
    expect(button!.getAttribute("aria-label")).toBe("Theme");
    expect(button!.getAttribute("aria-haspopup")).toBe("listbox");
});
```

## Setting attributes before vs after `appendChild`

Attributes set before `appendChild` are picked up in
`connectedCallback`. Attributes set after `appendChild` flow through
`attributeChangedCallback`. Tests assert both pathways.

```ts
// Pre-append:
const el = document.createElement("theme-chooser") as ThemeChooser;
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

expect(a.querySelectorAll(".theme-chooser-option").length).toBe(2);
expect(b.querySelectorAll(".theme-chooser-option").length).toBe(2);
```

## Common assertions

| Goal                                | Pattern                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| Wait for `connectedCallback`        | Append; the callback is synchronous in jsdom.                                 |
| Find the nth option                 | `el.querySelectorAll(".theme-chooser-option")[1]`                             |
| Open the listbox                    | `button.dispatchEvent(new MouseEvent("click", { bubbles: true }))`           |
| Change the selection                | Open, then click an option — or set `el.value = "dark"` directly              |
| Press a key                         | `list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }))` |
| Read the active option              | `list.getAttribute("aria-activedescendant")`                                 |
| Capture a CustomEvent               | `let detail; el.addEventListener("themechange", (e) => detail = e.detail);`   |
| Inspect document mutations          | `document.documentElement.dataset.theme`                                      |
| Re-mount fresh                      | `el.remove(); document.body.appendChild(otherEl);`                            |
| `localStorage` round-trip           | `localStorage.setItem(...); /* re-create element */`                          |

## Capturing CustomEvents

```ts
const events: ThemeChooserChangeDetail[] = [];
el.addEventListener("themechange", (e) => {
    events.push((e as CustomEvent<ThemeChooserChangeDetail>).detail);
});
el.value = "dark"; // triggers attributeChangedCallback → applyTheme → dispatchEvent
expect(events.at(-1)).toEqual({ theme: "dark" });
```

Because the event has `bubbles: true`, a listener on `document.body`
also works:

```ts
document.body.addEventListener("themechange", (e) => { /* … */ });
```

## Triggering a selection change

For `<theme-chooser>` / `<locale-chooser>`, open the listbox and click
an option:

```ts
const click = (el: Element) =>
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

click(el.querySelector(".theme-chooser-button")!);
click(el.querySelectorAll(".theme-chooser-option")[1]);
```

The option's `click` listener writes to `el.value`, which feeds back
through `attributeChangedCallback` → `#applyTheme()` →
`dispatchEvent`. Setting `el.value = "dark"` directly drives the same
path and is fine when the test is about the lifecycle rather than
the interaction.

### Keyboard

`fireEvent`-style helpers are not available; dispatch
`KeyboardEvent`s directly. The button handles the opening keys and
the `<ul>` handles the rest:

```ts
const press = (el: Element, key: string) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

press(button, "ArrowDown");        // opens, focuses the <ul>
press(list, "End");                // active option → last
press(list, "Enter");              // select + close + refocus button
```

Two jsdom notes:

- `Element.prototype.scrollIntoView` does not exist in jsdom. The
  implementation calls it optionally (`?.()`), so tests need no stub.
- jsdom may dispatch `focusout` with a null `relatedTarget` before
  the new focus target is committed. The implementation re-checks
  `document.activeElement` on a microtask before closing, so
  `await`ing a macrotask after a focus-moving interaction is enough
  to observe the settled state.

## Asserting the managed `<link>` (theme chooser)

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-chooser="theme"]',
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
import { normalizeThemesUrl, themeHref } from "./theme-chooser";

it("§7.7 normalizeThemesUrl appends a slash", () => {
    expect(normalizeThemesUrl("/x")).toBe("/x/");
    expect(normalizeThemesUrl("/x/")).toBe("/x/");
});

it("themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## Subclass tests (custom rendering)

Light DOM has no `<slot>`, so "custom rendering" means subclassing.
`#render()` is a private field and cannot be overridden; the
sanctioned hook on the listbox helpers is the public
`renderButtonContent()`, which replaces the glyph inside the button
and leaves the base class owning the button, the listbox, the aria
wiring, and the keyboard contract:

```ts
import { ThemeChooser } from "./theme-chooser";

class LabelledThemeChooser extends ThemeChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);
        return span;
    }
}
customElements.define("labelled-theme-chooser", LabelledThemeChooser);
```

Tests should assert two things: that the custom content replaced the
default `.theme-chooser-icon`, and that the base lifecycle still runs
(managed `<link>`, `data-theme` write, `themechange` event). Also
assert the aria wiring survived — `aria-haspopup`, `aria-label`, and
an `aria-controls` that resolves to the listbox — since that is
exactly what a bad subclass breaks.

A subclass that replaces the rendering wholesale (post-processing
after `super.connectedCallback()`) takes over the accessibility and
keyboard contracts too; test it as a new widget, not as a variant.

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
        expect(mod.ThemeChooser).toBeDefined();
    } finally {
        (globalThis as any).customElements = original;
    }
});
```

In practice the spec/index.md §7 list is exhaustive; subclass and SSR
checks are recommended but optional.

## One test per §7 acceptance

Each helper's `spec/index.md` §7 numbers its acceptance criteria; the test
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
