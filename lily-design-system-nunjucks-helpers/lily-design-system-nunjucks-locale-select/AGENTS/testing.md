# Testing — LocaleSelect (Nunjucks)

The select's test suite lives in
[`../locale-select.test.ts`](../locale-select.test.ts) and
asserts every numbered acceptance criterion in `spec/index.md` §7.
This file documents the test harness and the conventions
specific to this helper. For the catalog-wide test rules see
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
    initLocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
} from "./locale-select.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});

function renderMacro(opts: Record<string, unknown>): string {
    const src =
        `{% from "./locale-select.njk" import localeSelect %}` +
        `{{ localeSelect(opts) }}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-locale-select-root]",
    ) as HTMLElement;
}

beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});
```

## Pure-helper tests

`bcp47LocaleTag`, `isRtlLocale`, `localeName`, and
`matchNavigatorLanguage` are pure — no `mount` needed:

```ts
test("§7.7 bcp47LocaleTag(en_US) === en-US", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
});

test("§7.10 isRtlLocale handles script subtags", () => {
    expect(isRtlLocale("uz_Arab_AF")).toBe(true);
});
```

## Two-phase test pattern

```ts
test("§7.13 initLocaleSelect sets target.lang", () => {
    const html = renderMacro({
        label: "Language",
        locales: ["en", "fr", "ar"],
        value: "fr",
    });
    const root = mountIntoBody(html);
    initLocaleSelect(root);
    expect(document.documentElement.lang).toBe("fr");
});
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting per-option `lang`

```ts
const options = root.querySelectorAll("option.locale-select-option");
expect(options[0].getAttribute("lang")).toBe("en");
expect(options[1].getAttribute("lang")).toBe("fr-CA");
```

## Driving a select change

The client.js attaches a `change` listener on the `<select>`, so
set the value and dispatch the event:

```ts
const select = root as HTMLSelectElement;
select.value = "fr";
select.dispatchEvent(new Event("change", { bubbles: true }));

expect(document.documentElement.lang).toBe("fr");
```

## Mocking `navigator.languages`

```ts
test("§7.20 detectFromNavigator picks an exact match", () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    const html = renderMacro({
        label: "L",
        locales: ["en", "fr_FR", "ar"],
        detectFromNavigator: true,
    });
    const root = mountIntoBody(html);
    initLocaleSelect(root);
    expect(document.documentElement.lang).toBe("fr-FR");
});
```

`Object.defineProperty(navigator, "languages", { … })` works in
jsdom; reset between tests.

## Mocking `localStorage` failures

`localStorage` works natively in jsdom; just `clear()` between
tests. To simulate a thrown read:

```ts
const original = Storage.prototype.getItem;
Storage.prototype.getItem = () => { throw new Error("private mode"); };
// … run test …
Storage.prototype.getItem = original;
```

The client.js swallows the error inside try/catch.

## SSR sanity test

Render the macro and assert no DOM mutation happens during
render:

```ts
test("macro renders without touching DOM", () => {
    const html = renderMacro({
        label: "L",
        locales: ["en", "fr"],
        value: "fr",
    });
    expect(html).toContain("<select");
    expect(document.documentElement.hasAttribute("lang")).toBe(false);
});
```

This guarantees no `document.*` access leaked into the render
path.

## autoInit test

```ts
test("§7.23 autoInit wires every root on the page", () => {
    document.body.innerHTML =
        renderMacro({ label: "A", locales: ["en", "fr"], name: "a", value: "fr" }) +
        renderMacro({ label: "B", locales: ["en", "ar"], name: "b", value: "ar" });
    const controllers = autoInit();
    expect(controllers).toHaveLength(2);
});
```

## Section map

| §7 group        | Test focus                                                                |
| --------------- | ------------------------------------------------------------------------- |
| 7.1 — 7.6       | Macro DOM contract (select, role, value, name, per-option `lang`).        |
| 7.7 — 7.12      | Pure helpers (`bcp47LocaleTag`, `isRtlLocale`, `localeName`).             |
| 7.13 — 7.17     | Client.js apply lifecycle (`lang`, `dir`, custom `target`).               |
| 7.18 — 7.21     | Initial-value resolution (value, storage, navigator, default).            |
| 7.22 — 7.23     | Attribute spread + `autoInit`.                                            |

## One test per §7 acceptance

Each `test(...)` description starts with the clause number:

```ts
test("§7.16 selecting an option updates lang and dir …", … );
```

Keep the naming convention so a reviewer can spot a missing
clause.
