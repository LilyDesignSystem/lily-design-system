# Testing — `<theme-select>` (HTML helper)

The select's test suite lives in
[`../theme-select.test.ts`](../theme-select.test.ts) and asserts
every numbered acceptance criterion in `spec/index.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import "./index"; // registers <theme-select> globally
import type { ThemeSelect } from "./theme-select";
import { themeHref, normalizeThemesUrl } from "./theme-select";

beforeEach(() => {
    // Reset shared state between tests.
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

Each test creates a fresh element with `document.createElement`,
sets attributes, and appends it. `connectedCallback` runs
synchronously in jsdom, so no `await` is needed.

## Standard mount

```ts
function mountSelect(attrs: Record<string, string>): ThemeSelect {
    const el = document.createElement("theme-select") as ThemeSelect;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

it("§7.1 renders a select with an aria-label", () => {
    const el = mountSelect({
        label: "Theme",
        "themes-url": "/themes/",
        themes: "light,dark",
    });
    const root = el.querySelector("select");
    expect(root).not.toBeNull();
    expect(root!.getAttribute("aria-label")).toBe("Theme");
});
```

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

```ts
const select = el.querySelector<HTMLSelectElement>("select")!;
select.value = "dark";
select.dispatchEvent(new Event("change", { bubbles: true }));

expect(el.getAttribute("value")).toBe("dark");
expect(document.documentElement.dataset.theme).toBe("dark");
```

The `<select>`'s `change` listener (attached in `#render()`) writes
back to `el.value`, which feeds through `attributeChangedCallback`
→ `#applyTheme` → `dispatchEvent`.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-select="theme"]',
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
const events: ThemeSelectChangeDetail[] = [];
el.addEventListener("themechange", (e) => {
    events.push((e as CustomEvent<ThemeSelectChangeDetail>).detail);
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
const a = mountSelect({ themes: "light,dark,abyss" });
const b = mountSelect({});
b.themes = ["light", "dark", "abyss"]; // assigns through the setter

expect(a.querySelectorAll("option").length).toBe(3);
expect(b.querySelectorAll("option").length).toBe(3);
expect(b.getAttribute("themes")).toBe("light,dark,abyss");
```

## Pure-helper tests

`normalizeThemesUrl` and `themeHref` are pure — no element mount
needed:

```ts
it("§7.11 normalizeThemesUrl appends a slash", () => {
    expect(normalizeThemesUrl("/x")).toBe("/x/");
    expect(normalizeThemesUrl("/x/")).toBe("/x/");
});

it("themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## SSR sanity (module load only)

The class file has no top-level DOM access:

```ts
it("module is import-safe under SSR", async () => {
    const original = (globalThis as any).customElements;
    delete (globalThis as any).customElements;
    try {
        const mod = await import("./index");
        expect(mod.ThemeSelect).toBeDefined();
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
