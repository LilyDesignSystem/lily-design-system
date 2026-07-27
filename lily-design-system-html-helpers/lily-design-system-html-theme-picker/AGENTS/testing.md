# Testing — `<theme-chooser>` (HTML helper)

The select's test suite lives in
[`../theme-chooser.test.ts`](../theme-chooser.test.ts) and asserts
every numbered acceptance criterion in `spec/index.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import "./index"; // registers <theme-chooser> globally
import type { ThemeChooser } from "./theme-chooser";
import { themeHref, normalizeThemesUrl } from "./theme-chooser";

beforeEach(() => {
    // Reset shared state between tests.
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-chooser]")
        .forEach((n) => n.remove());
    document.body.replaceChildren();
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});
```

Remove only the managed `<link>` elements rather than clearing
`document.head` wholesale — jsdom keeps other head content the
harness relies on. Each test creates a fresh element with
`document.createElement`, sets attributes, and appends it.
`connectedCallback` runs synchronously in jsdom, but `await flush()`
before asserting so deferred handlers have settled.

## Standard mount

```ts
function mount(attrs: Record<string, string>): ThemeChooser {
    const el = document.createElement("theme-chooser") as ThemeChooser;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

test("§7.2 aria-label names the button and the listbox", async () => {
    mount({ label: "Choose theme", "themes-url": "/themes/", themes: "light,dark" });
    await flush();
    expect(button().getAttribute("aria-label")).toBe("Choose theme");
    expect(list().getAttribute("aria-label")).toBe("Choose theme");
});
```

## Query helpers

The suite defines four small accessors rather than repeating
selectors, plus `press` / `click` event helpers and a `flush` that
awaits a macrotask:

```ts
const button = () => document.body.querySelector<HTMLButtonElement>(".theme-chooser-button")!;
const list   = () => document.body.querySelector<HTMLUListElement>(".theme-chooser-list")!;
const options = () => [...document.body.querySelectorAll<HTMLLIElement>(".theme-chooser-option")];

function press(el: Element, key: string): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}
function click(el: Element): void {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}
function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}
```

`flush()` after mounting matters: `connectedCallback` runs
synchronously, but the focus-out handler defers to a microtask, so
tests that assert on close state need the turn of the event loop.

## Attribute timing

In jsdom, `attributeChangedCallback` fires synchronously on
`setAttribute`, so no async wait is needed after writing an
attribute:

```ts
el.setAttribute("value", "dark");
// At this line, #applyTheme has already run.
expect(document.documentElement.dataset.theme).toBe("dark");
```

## Triggering an option change

Open the list, then click the option:

```ts
function pick(slug: string, themes: string[]): void {
    click(button());
    click(options()[themes.indexOf(slug)]);
}

pick("dark", ["light", "dark", "abyss"]);
expect(el.getAttribute("value")).toBe("dark");
expect(document.documentElement.dataset.theme).toBe("dark");
```

The option's `click` listener (attached in `#render()`) writes back
to `el.value`, which feeds through `attributeChangedCallback` →
`#applyTheme` → `dispatchEvent`.

## Exercising the keyboard contract

Dispatch `keydown` on the button to open, then on the `<ul>` — that
is where focus lives while open:

```ts
press(button(), "ArrowDown");
expect(document.activeElement).toBe(list());
expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);

press(list(), "ArrowDown");
press(list(), "Enter");
expect(list().hasAttribute("hidden")).toBe(true);
expect(document.activeElement).toBe(button());
```

Assert the active descendant by comparing against `options()[i].id`
rather than hardcoding an id string — ids come from a module-level
counter that increments across the whole suite run, so their exact
values depend on how many elements earlier tests mounted.

## Asserting open / closed state

```ts
expect(list().hasAttribute("hidden")).toBe(true);          // closed
expect(button().getAttribute("aria-expanded")).toBe("false");
expect(list().hasAttribute("aria-activedescendant")).toBe(false);
```

`aria-activedescendant` is absent while closed, not empty.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-chooser="theme"]',
);
expect(link).not.toBeNull();
expect(link!.href).toMatch(/\/themes\/light\.css$/);
```

`href` on an `HTMLLinkElement` resolves to an absolute URL in
jsdom, so use a regex with the suffix rather than an exact match.

## Asserting `data-theme`

```ts
expect(document.documentElement.dataset.theme).toBe("light");
```

`dataset.theme` is the camelCase view of `data-theme`.

## Asserting `localStorage`

```ts
expect(localStorage.getItem("my-app:theme")).toBe("dark");
```

Run `localStorage.clear()` in `beforeEach` to keep tests isolated.

## Capturing the `themechange` CustomEvent

```ts
const events: ThemeChooserChangeDetail[] = [];
el.addEventListener("themechange", (e) => {
    events.push((e as CustomEvent<ThemeChooserChangeDetail>).detail);
});

el.setAttribute("value", "dark");
expect(events.at(-1)).toEqual({ theme: "dark" });
```

A `document.body`-level listener also catches the event because
`bubbles: true`:

```ts
let detail;
document.body.addEventListener("themechange", (e) => {
    detail = (e as CustomEvent).detail;
});
```

## Property vs attribute equivalence

```ts
const a = mount({ themes: "light,dark,abyss" });
const b = mount({});
b.themes = ["light", "dark", "abyss"]; // assigns through the setter

expect(a.querySelectorAll(".theme-chooser-option").length).toBe(3);
expect(b.querySelectorAll(".theme-chooser-option").length).toBe(3);
expect(b.getAttribute("themes")).toBe("light,dark,abyss");
```

## Testing a `renderButtonContent()` subclass

Define the subclass and register it once at module scope, guarded
so a re-run doesn't throw:

```ts
class GlyphlessThemeChooser extends ThemeChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.setAttribute("data-testid", "custom");
        span.setAttribute("data-open", String(this.open));
        span.setAttribute("data-value", this.value);
        return span;
    }
}
if (!customElements.get("glyphless-theme-chooser")) {
    customElements.define("glyphless-theme-chooser", GlyphlessThemeChooser);
}
```

Assert both halves: that the custom node replaced the glyph
(`.theme-chooser-icon` is gone) and that the base class's aria wiring
survived (`aria-haspopup`, `aria-label`, a resolvable
`aria-controls`).

## Pure-helper tests

`normalizeThemesUrl` and `themeHref` are pure — no element mount
needed:

```ts
test("normalizeThemesUrl appends a missing trailing slash", () => {
    expect(normalizeThemesUrl("/x")).toBe("/x/");
});

test("themeHref builds the href", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

These sit in their own `describe` block and carry no `§` number:
they exercise `spec/index.md` §5.1 rather than a §7 clause.

## SSR sanity (module load only)

The class file has no top-level DOM access:

```ts
it("module is import-safe under SSR", async () => {
    const original = (globalThis as any).customElements;
    delete (globalThis as any).customElements;
    try {
        const mod = await import("./index");
        expect(mod.ThemeChooser).toBeDefined();
    } finally {
        (globalThis as any).customElements = original;
    }
});
```

## What every §7 test asserts

See the per-clause map in
[`../spec/index.md` §7](../spec/index.md#7-testing-acceptance-criteria). Each
`it(...)` description starts with the clause number, e.g.
`it("§7.6 resolves the initial theme to 'light' …", …)`. Keep the
naming convention so a reviewer can spot a missing clause.
