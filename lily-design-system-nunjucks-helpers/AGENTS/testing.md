# Testing — Lily Nunjucks Helpers

Every helper ships a vitest suite that runs under jsdom. This page
lists the test harness expectations common to all helpers;
per-helper acceptance criteria live in the helper's own `spec.md`
§7.

## Stack

- [vitest](https://vitest.dev/) — runner + assertion library.
- [jsdom](https://github.com/jsdom/jsdom) — DOM in Node (configured
  via `// @vitest-environment jsdom` at the top of the test file or
  globally via `vitest.config.ts` → `test.environment = "jsdom"`).
- [nunjucks](https://mozilla.github.io/nunjucks/) ≥ 3 — renders the
  macro to a string the test then mounts into the jsdom document.

## Minimal `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        globals: false,
    },
});
```

Alternatively, add `// @vitest-environment jsdom` as the first line
of every spec file. The current helpers use the per-file marker so
the rest of the host project can keep `node` as its default test
environment.

## Standard harness

```ts
// @vitest-environment jsdom
import { beforeEach, describe, expect, test } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { autoInit, initThemePicker } from "./theme-picker.client.js";

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
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});
```

## Two phases per test

The Nunjucks split shows up in the test structure:

1. **Macro phase.** Render the macro via `nunjucks.renderString` and
   assert against the returned HTML string (no DOM needed).
2. **Client.js phase.** Mount the rendered HTML into
   `document.body`, call `initHelperName(root)` (or `autoInit()`),
   and assert against the live DOM, `document.head`,
   `document.documentElement`, and `localStorage`.

The two phases are independent: a macro-only test never imports the
client.js, and a client.js test can run against hand-written HTML
that doesn't go through Nunjucks at all.

## Common assertions

| Goal                                | Pattern                                                              |
| ----------------------------------- | -------------------------------------------------------------------- |
| Find the root                       | `document.querySelector("[data-lily-theme-picker-root]")`            |
| Find a radio by value               | `root.querySelector('input[type="radio"][value="dark"]')`            |
| Toggle a radio                      | `radio.checked = true; radio.dispatchEvent(new Event("change", { bubbles: true }));` |
| Inspect document mutations          | `document.documentElement.dataset.theme`                              |
| `localStorage` round-trip           | `localStorage.setItem(...); /* re-init */`                            |
| Assert managed `<link>`             | `document.head.querySelector('link[data-lily-theme-picker="theme"]')` |
| Assert spread attribute             | `root.getAttribute("data-testid")`                                    |

## Driving a radio change

```ts
const dark = root.querySelector('input[value="dark"]') as HTMLInputElement;
dark.checked = true;
dark.dispatchEvent(new Event("change", { bubbles: true }));
```

The client.js attaches a `change` listener at the root (event
delegation), so the event must bubble. `dispatchEvent(new
Event("change", { bubbles: true }))` is the cleanest cross-jsdom
approach.

## Pure-helper tests

The pure helpers exported from each `*.client.js`
(`normaliseThemesUrl`, `bcp47LocaleTag`, `isRtlLocale`,
`matchNavigatorLanguage`) are pure — no DOM, no nunjucks. Test them
directly:

```ts
test("§7.7 bcp47LocaleTag(en_US) === en-US", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
});
```

## Asserting the macro output (without client.js)

```ts
test("§7.1 macro renders fieldset with role=radiogroup", () => {
    const html = renderMacro({
        label: "Theme",
        themesUrl: "/t/",
        themes: ["light", "dark"],
    });
    expect(html).toContain('<fieldset');
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('aria-label="Theme"');
});
```

`expect(html).toContain(...)` is the simplest assertion; for
attribute order independence, mount into jsdom and use the DOM API.

## Mocking `navigator.languages`

```ts
test("§7.20 detectFromNavigator picks exact match", () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    document.body.innerHTML = renderMacro({
        label: "L",
        locales: ["en", "fr_FR", "ar"],
        detectFromNavigator: true,
    });
    initLocalePicker(document.querySelector("[data-lily-locale-picker-root]")!);
    expect(document.documentElement.lang).toBe("fr-FR");
});
```

`Object.defineProperty(navigator, "languages", { … })` works in
jsdom; reset between tests.

## SSR sanity test

The macro is the SSR side; rendering it via `nunjucks.renderString`
is the sanity check.

```ts
test("macro is pure: does not touch DOM during render", () => {
    // Render outside of jsdom — assert no throw.
    const html = env.renderString(src, { opts });
    expect(html).toContain('role="radiogroup"');
});
```

The client.js must never run code at module-import time that
touches `document` or `window`. Verify by running the test file in
a non-jsdom environment (e.g. `// @vitest-environment node`) for a
smoke test — every `import` must succeed.

## One test per §7 acceptance

Each `test(...)` description starts with the spec clause number:

```ts
test("§7.6 themeLabels overrides default title-case label", () => { … });
```

Keep the naming convention so a reviewer can spot a missing clause.

## Don't

- Don't mock nunjucks — use the real renderer.
- Don't mock `document` / `localStorage` — jsdom is enough.
- Don't use snapshot tests for HTML; assert specific attributes and
  text. Snapshots invite drift; targeted asserts catch regressions.
- Don't use `setTimeout` to "wait" — the client.js is synchronous
  on `initHelperName`.
