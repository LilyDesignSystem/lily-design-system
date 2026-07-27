# Testing — LocaleChooser (Nunjucks)

The select's test suite lives in
[`../locale-chooser.test.ts`](../locale-chooser.test.ts) and
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
    initLocaleChooser,
    bcp47LocaleTag,
    GLOBE_WITH_MERIDIANS,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
} from "./locale-chooser.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});

function renderMacro(opts: Record<string, unknown>): string {
    const src =
        `{% from "./locale-chooser.njk" import localeChooser %}` +
        `{{ localeChooser(opts) }}`;
    return env.renderString(src, { opts });
}

function renderMacroWithCaller(
    opts: Record<string, unknown>,
    body: string,
): string {
    const src =
        `{% from "./locale-chooser.njk" import localeChooser %}` +
        `{% call localeChooser(opts) %}${body}{% endcall %}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-locale-chooser-root]",
    ) as HTMLElement;
}

beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});
```

## Reaching the parts

The root is a `<div>`, so every assertion goes through one of the
four parts. The suite keeps a `partsOf(root)` helper:

```ts
function partsOf(root: HTMLElement) {
    return {
        root,
        button: root.querySelector(".locale-chooser-button") as HTMLButtonElement,
        list: root.querySelector(".locale-chooser-list") as HTMLElement,
        options: Array.from(
            root.querySelectorAll<HTMLElement>(".locale-chooser-option"),
        ),
        input: root.querySelector(
            "[data-lily-locale-chooser-input]",
        ) as HTMLInputElement,
    };
}
```

…plus a `setup(opts?, initOpts?)` that renders, mounts, and inits in
one call, and thin `key(el, k, init?)` / `click(el)` dispatchers.

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
test("§7.13 initLocaleChooser sets target.lang", () => {
    const html = renderMacro({
        label: "Language",
        locales: ["en", "fr", "ar"],
        value: "fr",
    });
    const root = mountIntoBody(html);
    initLocaleChooser(root);
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
const { button, list, options } = partsOf(root);
expect(options[0].getAttribute("lang")).toBe("en");
expect(options[1].getAttribute("lang")).toBe("fr-CA");
// Chrome, not content:
expect(button.hasAttribute("lang")).toBe(false);
expect(list.hasAttribute("lang")).toBe(false);
```

## Driving a selection

There is no `change` event any more. Drive the control the way a
user would — open it, then commit with a key or a click:

```ts
const { button, list, options, input } = setup();

key(button, "ArrowDown");      // opens, focus moves to the <ul>
key(list, "ArrowDown");        // moves the active option only
key(list, "Enter");            // commits

expect(document.documentElement.lang).toBe("en-US");
expect(input.value).toBe("en_US");           // consumer form
expect(list.hasAttribute("hidden")).toBe(true);
expect(document.activeElement).toBe(button); // focus returned
```

Clicking works the same way: `click(button)` then `click(options[4])`.

## Asserting listbox state

Open / closed and active / selected are four separate attributes;
assert the one that carries the meaning:

| Assertion target                            | Attribute                     |
| ------------------------------------------- | ----------------------------- |
| Is the listbox open?                        | `list.hasAttribute("hidden")` |
| Does the button agree?                      | `button.getAttribute("aria-expanded")` |
| Which option is active (roved to)?          | `list.getAttribute("aria-activedescendant")`, `[data-active]` |
| Which locale is applied?                    | `option.getAttribute("aria-selected")`, `input.value` |

Active and selected are independent: arrowing changes the former
only. The suite has a dedicated regression test for that.

## Typeahead with fake timers

The typeahead buffer resets 500 ms after the last keystroke, so use
`vi.useFakeTimers()` when asserting the reset:

```ts
vi.useFakeTimers();
try {
    const { button, list, options } = setup();
    key(button, "ArrowDown");
    key(list, "f"); key(list, "r"); key(list, "_"); // matches "fr_CA"
    expect(list.getAttribute("aria-activedescendant")).toBe(options[3].id);
    vi.advanceTimersByTime(600);
    key(list, "a");                                 // fresh search
    expect(list.getAttribute("aria-activedescendant")).toBe(options[4].id);
} finally {
    vi.useRealTimers();
}
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
    initLocaleChooser(root);
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
    expect(html).toContain('role="listbox"');
    expect(document.documentElement.hasAttribute("lang")).toBe(false);
});
```

This guarantees no `document.*` access leaked into the render
path.

The companion assertions guard the pre-hydration state: the listbox
renders `hidden`, the button renders `aria-expanded="false"`, no
option carries `data-active`, exactly one option is
`aria-selected="true"`, and the hidden input is pre-filled. Those
replace the retired "only the placeholder is selected" guard — there
is no placeholder and no `<select>` left to guard.

## Caller-block test

The `{% call %}` body replaces the glyph inside the button and
nothing else:

```ts
const root = mountIntoBody(
    renderMacroWithCaller(
        { label: "Language", locales: LOCALES },
        `<span class="my-glyph" aria-hidden="true">L</span>`,
    ),
);
const { button } = partsOf(root);
expect(button.querySelector(".my-glyph")).not.toBeNull();
expect(button.querySelector(".locale-chooser-icon")).toBeNull();
expect(button.getAttribute("aria-label")).toBe("Language");
```

## autoInit test

Give the two instances distinct `name`s (or distinct `id`s) so their
listbox and option ids do not collide — the macro derives ids from
`opts.id`, which defaults to `"locale-chooser-{name}"`:

```ts
test("§7.23 autoInit wires every root on the page", () => {
    document.body.innerHTML =
        renderMacro({ label: "A", locales: ["en", "fr"], name: "a", defaultValue: "fr" }) +
        renderMacro({ label: "B", locales: ["en", "ar"], name: "b", defaultValue: "ar" });
    const controllers = autoInit();
    expect(controllers).toHaveLength(2);
    const lists = document.querySelectorAll(".locale-chooser-list");
    expect(lists[0].id).not.toBe(lists[1].id);
});
```

## Section map

| §7 group        | Test focus                                                                |
| --------------- | ------------------------------------------------------------------------- |
| 7.1 — 7.6       | Macro DOM contract (root, button, listbox, glyph, ids, per-option `lang`). |
| 7.7 — 7.12      | Pure helpers (`bcp47LocaleTag`, `isRtlLocale`, `localeName`).             |
| 7.13 — 7.17     | Client.js apply lifecycle (`lang`, `dir`, custom `target`).               |
| 7.18 — 7.21     | Initial-value resolution (value, storage, navigator, default).            |
| 7.22 — 7.25     | Attribute spread, caller block, `destroy`, `autoInit`.                    |
| 7.26 — 7.27     | `data-lily-locale-chooser-value` as the sole `opts.value` channel.         |
| 7.28 — 7.30     | Server-rendered listbox state (closed, one `aria-selected`, filled input).|
| 7.31 — 7.35     | Keyboard, typeahead, and pointer contract (APG listbox).                  |

## One test per §7 acceptance

Each `test(...)` description starts with the clause number:

```ts
test("§7.16 selecting an option updates lang and dir …", … );
```

Keep the naming convention so a reviewer can spot a missing
clause.
