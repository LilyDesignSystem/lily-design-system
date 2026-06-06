# Testing — ThemePicker (Nunjucks)

The picker's test suite lives in
[`../theme-picker.test.ts`](../theme-picker.test.ts) and asserts
every numbered acceptance criterion in `spec.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
// @vitest-environment jsdom
import { beforeEach, describe, expect, test } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    initThemePicker,
    normaliseThemesUrl,
    themeHref,
} from "./theme-picker.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});

function renderMacro(opts: Record<string, unknown>): string {
    const src =
        `{% from "./theme-picker.njk" import themePicker %}` +
        `{{ themePicker(opts) }}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-theme-picker-root]",
    ) as HTMLElement;
}

beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

## Two-phase test pattern

A typical test exercises both halves:

```ts
test("§7.7 initThemePicker injects a managed <link>", () => {
    const html = renderMacro({
        label: "Theme",
        themesUrl: "/assets/themes/",
        themes: ["light", "dark"],
    });
    const root = mountIntoBody(html);
    initThemePicker(root);
    const link = document.head.querySelector<HTMLLinkElement>(
        'link[data-lily-theme-picker="theme"]',
    );
    expect(link).not.toBeNull();
    expect(link!.href).toMatch(/\/assets\/themes\/light\.css$/);
});
```

The macro-only phase (`renderMacro` → `expect(html).toContain(…)`)
is enough for §7.1–§7.6 (markup contract). The init phase
(`mountIntoBody` → `initThemePicker` → DOM asserts) covers §7.7
onward.

## Driving a radio change

The client.js attaches a delegated `change` listener at the
fieldset, so events must bubble:

```ts
const dark = root.querySelector('input[value="dark"]') as HTMLInputElement;
dark.checked = true;
dark.dispatchEvent(new Event("change", { bubbles: true }));

expect(document.documentElement.dataset.theme).toBe("dark");
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-picker="theme"]',
);
expect(link!.href).toMatch(/\/assets\/themes\/dark\.css$/);
```

`Event` (not `InputEvent`) is enough — the listener only inspects
`e.target.value`.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-picker="theme"]',
);
expect(link).not.toBeNull();
expect(link!.href).toMatch(/\/t\/light\.css$/);
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

## Pure-helper tests

`normaliseThemesUrl` and `themeHref` are pure — no mount needed:

```ts
test("§7.12 normaliseThemesUrl appends a slash", () => {
    expect(normaliseThemesUrl("/x")).toBe("/x/");
    expect(normaliseThemesUrl("/x/")).toBe("/x/");
});

test("§7.12 themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## SSR sanity test

Render the macro outside a jsdom test (or in a separate
`environment: node` test file) to confirm it doesn't touch the DOM
during render:

```ts
test("macro renders without touching DOM", () => {
    // beforeEach reset already cleared document. Render again.
    const html = renderMacro({
        label: "Theme",
        themesUrl: "/t/",
        themes: ["light", "dark"],
    });
    expect(html).toContain('role="radiogroup"');
    expect(document.head.innerHTML).toBe(""); // no link injected
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
});
```

This guarantees no `document.*` access leaked into the render
path.

## autoInit test

```ts
test("§7.13-ish autoInit wires every root on the page", () => {
    document.body.innerHTML =
        renderMacro({ label: "A", themesUrl: "/a/", themes: ["light", "dark"], name: "a" }) +
        renderMacro({ label: "B", themesUrl: "/b/", themes: ["light", "dark"], name: "b" });
    const controllers = autoInit();
    expect(controllers).toHaveLength(2);
    const linkA = document.head.querySelector('link[data-lily-theme-picker="a"]');
    const linkB = document.head.querySelector('link[data-lily-theme-picker="b"]');
    expect(linkA).not.toBeNull();
    expect(linkB).not.toBeNull();
});
```

## Section map

| §7 group        | Test focus                                       |
| --------------- | ------------------------------------------------ |
| 7.1 — 7.6       | Macro DOM contract (rendered HTML string)        |
| 7.7 — 7.11      | Client.js apply lifecycle (jsdom mutations)      |
| 7.12            | Pure helpers (normaliseThemesUrl, themeHref)     |
| 7.13            | Attribute spread + autoInit                      |

## One test per §7 acceptance

Each `test(...)` description starts with the clause number, e.g.
`test("§7.7 initThemePicker injects the managed <link>", …)`.
Keep the naming convention so a reviewer can spot a missing
clause.
