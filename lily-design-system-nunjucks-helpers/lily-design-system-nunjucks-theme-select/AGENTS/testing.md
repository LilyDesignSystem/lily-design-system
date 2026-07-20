# Testing — ThemeSelect (Nunjucks)

The select's test suite lives in
[`../theme-select.test.ts`](../theme-select.test.ts) and asserts
every numbered acceptance criterion in `spec/index.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
    initThemeSelect,
    normaliseThemesUrl,
    themeHref,
} from "./theme-select.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});

function renderMacro(opts: Record<string, unknown>): string {
    const src =
        `{% from "./theme-select.njk" import themeSelect %}` +
        `{{ themeSelect(opts) }}`;
    return env.renderString(src, { opts });
}

function renderMacroWithCaller(
    opts: Record<string, unknown>,
    body: string,
): string {
    const src =
        `{% from "./theme-select.njk" import themeSelect %}` +
        `{% call themeSelect(opts) %}${body}{% endcall %}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-theme-select-root]",
    ) as HTMLElement;
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-select]")
        .forEach((n) => n.remove());
    document.body.innerHTML = "";
    localStorage.clear();
});
```

## Reading the DOM parts

Every assertion needs one or more of the four parts, so the suite
factors out a `partsOf(root)` helper:

```ts
function partsOf(root: HTMLElement) {
    return {
        root,
        button: root.querySelector(".theme-select-button") as HTMLButtonElement,
        list: root.querySelector(".theme-select-list") as HTMLElement,
        options: Array.from(
            root.querySelectorAll<HTMLElement>(".theme-select-option"),
        ),
        input: root.querySelector(
            "[data-lily-theme-select-input]",
        ) as HTMLInputElement,
    };
}
```

Paired with a `setup()` that renders, mounts, and inits in one step,
most tests are three lines.

## Two-phase test pattern

A typical test exercises both halves:

```ts
test("§7.7 initThemeSelect injects a managed <link>", () => {
    const html = renderMacro({
        label: "Theme",
        themesUrl: "/assets/themes/",
        themes: ["light", "dark"],
    });
    const root = mountIntoBody(html);
    initThemeSelect(root);
    const link = document.head.querySelector<HTMLLinkElement>(
        'link[data-lily-theme-select="theme"]',
    );
    expect(link).not.toBeNull();
    expect(link!.href).toMatch(/\/assets\/themes\/light\.css$/);
});
```

The macro-only phase covers the markup contract; the init phase
(`mountIntoBody` → `initThemeSelect` → DOM asserts) covers the
lifecycle and the keyboard contract.

Assert against the parsed DOM rather than the HTML string. The
markup now has four elements and a dozen attributes, so
`expect(html).toContain("…")` is both brittle and unreadable;
mount first, then query.

## Driving a selection

There is no `change` event any more. Selection goes through the
button and the listbox, so tests dispatch keyboard and mouse
events. Both helpers must bubble:

```ts
function key(el: Element, k: string, init: KeyboardEventInit = {}) {
    el.dispatchEvent(
        new KeyboardEvent("keydown", { key: k, bubbles: true, ...init }),
    );
}

function click(el: Element) {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}
```

Keyboard path — open, move, confirm:

```ts
const { button, list, input } = setup();
key(button, "ArrowDown");   // open, focus moves to the <ul>
key(list, "ArrowDown");     // active option = index 1
key(list, "Enter");         // select + apply + close + refocus button

expect(document.documentElement.dataset.theme).toBe("dark");
expect(input.value).toBe("dark");
expect(list.hasAttribute("hidden")).toBe(true);
expect(document.activeElement).toBe(button);
```

Mouse path — open, click an option:

```ts
const { button, options } = setup();
click(button);
click(options[2]);
expect(document.documentElement.dataset.theme).toBe("abyss");
```

`click` must bubble because the outside-dismissal handler is
attached to `document`.

## Asserting open / closed state

Four signals move together; assert the ones the clause is about:

```ts
expect(list.hasAttribute("hidden")).toBe(false);
expect(button.getAttribute("aria-expanded")).toBe("true");
expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
expect(options[0].hasAttribute("data-active")).toBe(true);
```

On close, `hidden` returns, `aria-expanded` goes `"false"`,
`aria-activedescendant` is removed, and no option has `data-active`.

Keep `aria-selected` assertions distinct from `data-active` ones:
`aria-selected` follows the **applied** theme, so arrowing without
confirming must not move it.

## Testing typeahead

The buffer resets 500 ms after the last keystroke, so use fake
timers when a test spans that window:

```ts
vi.useFakeTimers();
try {
    const { button, list, options } = setup();
    key(button, "ArrowDown");
    key(list, "d");
    key(list, "a");                       // "da" → "Dark"
    expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
    vi.advanceTimersByTime(600);          // buffer expires
    key(list, "a");                       // fresh search → "Abyss"
    expect(list.getAttribute("aria-activedescendant")).toBe(options[2].id);
} finally {
    vi.useRealTimers();
}
```

Modifier chords must be inert: `key(list, "a", { ctrlKey: true })`
leaves the active descendant where it was.

## Testing the caller block

`{% call %}` replaces the glyph inside the button and nothing else:

```ts
const root = mountIntoBody(
    renderMacroWithCaller(
        { label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] },
        `<span class="my-glyph" aria-hidden="true">T</span>`,
    ),
);
const button = root.querySelector(".theme-select-button")!;
expect(button.querySelector(".my-glyph")).not.toBeNull();
expect(button.querySelector(".theme-select-icon")).toBeNull();
expect(button.getAttribute("aria-label")).toBe("Theme");
```

`CIRCLE_WITH_RIGHT_HALF_BLACK` is exported so the default-glyph test
can compare against it instead of hardcoding `"◑"`.

## jsdom caveats

- `scrollIntoView` is not implemented in jsdom. The client guards
  the call, so no stub is needed — but don't assert on scrolling.
- Focus assertions work: the listbox has `tabindex="-1"`, so
  `list.focus()` sets `document.activeElement`.
- `FocusEvent` needs an explicit `relatedTarget` for the
  focus-leaves-the-root test; the handler reads it to decide whether
  focus stayed inside.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-select="theme"]',
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
    expect(html).toContain('class="theme-select');
    expect(document.head.innerHTML).toBe(""); // no link injected
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
});
```

This guarantees no `document.*` access leaked into the render
path.

The complementary guard is that the *server* markup is inert but
well-formed: mount without calling `initThemeSelect` and assert the
listbox is `hidden`, `aria-expanded` is `"false"`, nothing carries
`data-active` or `aria-activedescendant`, exactly one option is
`aria-selected="true"`, and the hidden input is pre-filled. That
last assertion is the only no-JS affordance the control has, so it
is worth its own test.

## autoInit test

```ts
test("§7.13-ish autoInit wires every root on the page", () => {
    document.body.innerHTML =
        renderMacro({ label: "A", themesUrl: "/a/", themes: ["light", "dark"], name: "a" }) +
        renderMacro({ label: "B", themesUrl: "/b/", themes: ["light", "dark"], name: "b" });
    const controllers = autoInit();
    expect(controllers).toHaveLength(2);
    const linkA = document.head.querySelector('link[data-lily-theme-select="a"]');
    const linkB = document.head.querySelector('link[data-lily-theme-select="b"]');
    expect(linkA).not.toBeNull();
    expect(linkB).not.toBeNull();
});
```

## Section map

| §7 group        | Test focus                                            |
| --------------- | ----------------------------------------------------- |
| 7.1 — 7.6       | Macro DOM contract: root, button, listbox, glyph, ids, labels |
| 7.7 — 7.11      | Client.js apply lifecycle (jsdom mutations)           |
| 7.12            | Pure helpers (normaliseThemesUrl, themeHref)          |
| 7.13            | Attribute spread, destroy, autoInit                   |
| 7.14 — 7.16     | Server-rendered state: closed listbox, one selected option, pre-filled hidden input |
| 7.17 — 7.19     | `data-lily-theme-select-value` channel + the `{% call %}` glyph override |
| 7.20 — 7.24     | Keyboard and pointer contract (APG listbox)           |

The old "only the placeholder is `selected`" regression guard is
retired along with the placeholder. Its replacement is §7.14–§7.16:
the meaningful pre-hydration invariants are now that the listbox is
closed and that exactly one option is marked selected.

## One test per §7 acceptance

Each `test(...)` description starts with the clause number, e.g.
`test("§7.7 initThemeSelect injects the managed <link>", …)`.
Keep the naming convention so a reviewer can spot a missing
clause.
