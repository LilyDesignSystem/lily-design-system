# Testing — LocaleSelect (Svelte)

The select's test suite lives in
[`../LocaleSelect.test.ts`](../LocaleSelect.test.ts) and asserts
every numbered acceptance criterion in `spec/index.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocaleSelect.svelte";

beforeEach(() => {
    // Reset shared state between tests.
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});
```

## Pure-helper tests

`bcp47LocaleTag`, `isRtlLocale`, `localeName`, and
`matchNavigatorLanguage` are pure — no `render` needed:

```ts
it("§7.7 bcp47LocaleTag(en_US) === en-US", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
});

it("§7.10 isRtlLocale handles script subtags", () => {
    expect(isRtlLocale("uz_Arab_AF")).toBe(true);
});

it("§7.12 localeName looks up the English name", () => {
    expect(localeName("en_US")).toBe("English (United States)");
});
```

## Standard render

```ts
it("§7.1 renders a button that controls a listbox", async () => {
    render(LocaleSelect, {
        props: { label: "Language", locales: ["en", "fr"] },
    });
    await tick();
    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-label")).toBe("Language");
    expect(button.getAttribute("aria-haspopup")).toBe("listbox");
    expect(button.getAttribute("aria-expanded")).toBe("false");

    const list = document.getElementById(button.getAttribute("aria-controls")!);
    expect(list!.getAttribute("role")).toBe("listbox");
    expect(list!.getAttribute("aria-label")).toBe("Language");
});
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting per-option `lang`

```ts
const options = document.querySelectorAll(".locale-select-option");
expect(options[0].getAttribute("lang")).toBe("en");
expect(options[1].getAttribute("lang")).toBe("fr-CA");
```

The options are `<li role="option">`, not `<option>`.

## Picking a locale

There is no `<select>` to set a `value` on. Open the listbox, then
click the option:

```ts
import { fireEvent, screen } from "@testing-library/svelte";

async function pick(code: string, locales: string[]): Promise<void> {
    await fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".locale-select-option");
    await fireEvent.click(opts[locales.indexOf(code)]);
}
```

The suite defines exactly this helper at the top of the file; reuse it
rather than reimplementing the two-step.

## Driving the keyboard contract

Open with a key on the button, then send keys to the **list**, not to
the button — focus moves to the `<ul>` on open:

```ts
async function openWith(key: string) {
    render(LocaleSelect, { props: { label: "Language", locales: LOCALES } });
    await flush();
    const button = screen.getByRole("button");
    await fireEvent.keyDown(button, { key });
    await flush();
    return { button, list: document.querySelector(".locale-select-list") as HTMLElement };
}
```

Assert movement through `aria-activedescendant` against the option
ids, not through focus — the component uses the APG's
`aria-activedescendant` model and never moves DOM focus onto an `<li>`:

```ts
const { list } = await openWith("ArrowDown");
await fireEvent.keyDown(list, { key: "ArrowDown" });
expect(list.getAttribute("aria-activedescendant")).toBe(list.children[1].id);
```

Open / closed state is `list.hasAttribute("hidden")` plus
`button.getAttribute("aria-expanded")`.

## Asserting the glyph

The globe is a **two-codepoint sequence** — U+1F310 plus U+FE0E
VARIATION SELECTOR-15. Assert both, or a regression that drops the
variation selector (and so renders a blue colour emoji) will pass
silently:

```ts
const icon = document.querySelector(".locale-select-icon") as HTMLElement;
expect(icon.textContent).toBe("\u{1F310}\uFE0E");
expect(icon.getAttribute("aria-hidden")).toBe("true");
```

## Mocking `navigator.languages`

```ts
it("§7.20 detectFromNavigator picks an exact match", async () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    render(LocaleSelect, {
        props: {
            label: "L",
            locales: ["en", "fr_FR", "ar"],
            detectFromNavigator: true,
        },
    });
    await tick();
    expect(document.documentElement.lang).toBe("fr-FR");
});
```

`Object.defineProperty(navigator, "languages", { ... })` works in
jsdom; resetting between tests is the cleanest way to avoid
cross-contamination.

## Mocking `localStorage`

`localStorage` works natively in jsdom; just `clear()` between
tests. To simulate a thrown read:

```ts
const original = Storage.prototype.getItem;
Storage.prototype.getItem = () => { throw new Error("private mode"); };
// … run test …
Storage.prototype.getItem = original;
```

The select swallows the error inside try/catch.

## Driving a `bind:value` test

`bind:value` is sugar; inside a test we either inspect the side
effect (`document.documentElement.lang`, the `localStorage` write)
or spy on `onChange`:

```ts
const onChange = vi.fn();
render(LocaleSelect, {
    props: {
        label: "L",
        locales: ["en", "fr", "ar"],
        onChange,
    },
});
await tick();
expect(onChange).toHaveBeenCalledWith("en");
```

To observe the bind-back side, mount the select inside a tiny
wrapper `.svelte` fixture that does `bind:value` and asserts the
new value on its own `$state`. Most tests don't need this — the
`onChange` spy is enough.

## Snippet tests

Use `createRawSnippet` to construct a snippet on the fly:

```ts
import { createRawSnippet } from "svelte";

it("§7.23 children snippet replaces the glyph and receives ChildArgs", async () => {
    let captured: any = null;
    const children = createRawSnippet((args) => {
        captured = args();
        return { render: () => "<span data-testid='custom'></span>" };
    });
    render(LocaleSelect, {
        props: { label: "L", locales: ["en", "fr"], value: "fr", children },
    });
    await tick();
    // The snippet replaces the glyph *inside the button*.
    expect(screen.getByTestId("custom").closest("button")?.className)
        .toContain("locale-select-button");
    expect(document.querySelector(".locale-select-icon")).toBeNull();
    expect(captured.value).toBe("fr");
    expect(captured.open).toBe(false);
    expect(typeof captured.labelFor).toBe("function");
});
```

## SSR sanity test

```ts
import { render as ssrRender } from "svelte/server";

it("renders cleanly under SSR", () => {
    const { html } = ssrRender(LocaleSelect, {
        props: {
            label: "Language",
            locales: ["en", "fr"],
            value: "fr",
        },
    });
    expect(html).toContain('class="locale-select"');
    expect(html).toContain('aria-label="Language"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('value="fr"');   // the hidden input
});
```

This guarantees no `document.*` access leaked into the render path.

## One test per §7 acceptance

Each `it(...)` description starts with the clause number, e.g.
`it("§7.16 selecting an option updates lang and dir …", …)`. Keep
the naming convention so a reviewer can spot a missing clause.

Section map:

| Clauses      | Test focus                                                        |
| ------------ | ----------------------------------------------------------------- |
| §7.1–§7.6    | Markup: button + listbox wiring, glyph, hidden input, per-option `lang`, labels |
| §7.7–§7.12   | Pure helpers: `bcp47LocaleTag`, `isRtlLocale`, `localeName`       |
| §7.13–§7.17  | Application: `target.lang`, `target.dir`, `applyDir`, `onChange`  |
| §7.18–§7.21  | Init value: value / storage / navigator / defaultValue ordering   |
| §7.22–§7.23  | `restProps` fall-through and the `ChildArgs` contract             |
| §7.24–§7.27  | Keyboard: open keys, arrow clamping, Home/End, Enter, Escape, typeahead, click |

Note the clause numbers are not in file order: the keyboard suite
(§7.24–§7.27) was appended after the earlier groups, and the
pure-helper block (§7.7–§7.12) sits at the top of the file. Match the
number to the assertion, not to the position.
