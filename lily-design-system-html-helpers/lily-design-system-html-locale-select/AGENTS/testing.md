# Testing — `<locale-select>` (HTML helper)

The select's test suite lives in
[`../locale-select.test.ts`](../locale-select.test.ts) and asserts
every numbered acceptance criterion in `spec/index.md` §7. This file
documents the test harness and conventions specific to this helper.
For the catalog-wide rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    GLOBE_WITH_MERIDIANS,
} from "./locale-select.js";

// Register once; re-registering the same tag throws.
if (typeof customElements !== "undefined" && !customElements.get("locale-select")) {
    customElements.define("locale-select", LocaleSelect);
}

beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    document.body.replaceChildren();
    try { localStorage.clear(); } catch { /* ignore */ }
});
```

## Query helpers

The rendering is a `<div>` root holding a button and a `<ul>`, so
every test reaches for one of four things. Factor them out:

```ts
const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

function mount(attrs: Record<string, string>): LocaleSelect {
    const el = document.createElement("locale-select") as LocaleSelect;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

const button = () => document.body.querySelector<HTMLButtonElement>(".locale-select-button")!;
const list   = () => document.body.querySelector<HTMLUListElement>(".locale-select-list")!;
const options = () =>
    [...document.body.querySelectorAll<HTMLLIElement>(".locale-select-option")];
```

## Driving the control

There is no native `<select>` to set `.value` on. Interaction is
synthetic events on the button and the list:

```ts
function press(el: Element, key: string): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function click(el: Element): void {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

/** Open the listbox and click the option for `code`. */
function pick(code: string, locales: string[] = LOCALES): void {
    click(button());
    click(options()[locales.indexOf(code)]);
}
```

`pick()` is the workhorse for every application / persistence test.

## Asserting the markup contract

```ts
const btn = button();
expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
expect(btn.getAttribute("aria-expanded")).toBe("false");
expect(document.getElementById(btn.getAttribute("aria-controls")!)).toBe(list());

const icon = document.body.querySelector<HTMLElement>(".locale-select-icon")!;
expect(icon.textContent).toBe("\u{1F310}\uFE0E");    // GLOBE + VS15 (text presentation)
expect(icon.getAttribute("aria-hidden")).toBe("true");
```

Assert the *absence* of the old rendering too — it is the cheapest
guard against a regression:

```ts
expect(document.body.querySelector("select")).toBeNull();
expect(document.body.querySelector(".locale-select-placeholder")).toBeNull();
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.getAttribute("lang")).toBe("ar");
expect(document.documentElement.getAttribute("dir")).toBe("rtl");
```

## Asserting per-option `lang`

Each `<li>` carries the BCP 47 tag; the button and the `<ul>` carry
none. Assert both halves:

```ts
const opts = options();
expect(opts[1].getAttribute("lang")).toBe("en-US");   // hyphen form
expect(button().hasAttribute("lang")).toBe(false);
expect(list().hasAttribute("lang")).toBe(false);
```

## Keyboard tests

Open first, then drive the list. Note that `aria-activedescendant`
lives on the `<ul>`, and the assertion compares it against an option
`id` rather than a literal string:

```ts
press(button(), "ArrowDown");
expect(document.activeElement).toBe(list());
expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
expect(options()[0].hasAttribute("data-active")).toBe(true);

press(list(), "ArrowUp");   // clamps — no wrapping
expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);

press(list(), "Enter");
expect(list().hasAttribute("hidden")).toBe(true);
expect(document.activeElement).toBe(button());
expect(list().hasAttribute("aria-activedescendant")).toBe(false);
```

`ArrowUp` on the *button* opens with the last option active — a
distinct case from `ArrowUp` on the list.

Typeahead searches the resolved **labels**, not the codes:

```ts
press(list(), "f");
// "French" is index 2 in LOCALES — matched by label, not by the code "fr".
expect(list().getAttribute("aria-activedescendant")).toBe(options()[2].id);
```

## Capturing the `localechange` CustomEvent

```ts
const onChange = vi.fn();
el.addEventListener("localechange", (e) => {
    onChange((e as CustomEvent<{ locale: string }>).detail.locale);
});
pick("en_US");
expect(onChange).toHaveBeenLastCalledWith("en_US");   // consumer form
```

## Mocking `navigator.languages`

```ts
const original = Object.getOwnPropertyDescriptor(window.navigator, "languages");
Object.defineProperty(window.navigator, "languages", {
    configurable: true,
    get: () => ["fr-CA", "fr"],
});
mount({ label: "L", locales: "en,fr_CA,fr", "detect-from-navigator": "" });
await flush();
expect(document.documentElement.lang).toBe("fr-CA");
if (original) Object.defineProperty(window.navigator, "languages", original);
```

`configurable: true` is essential; otherwise subsequent
`defineProperty` calls throw. Restore the original descriptor rather
than leaving the stub in place for the next test.

## Mocking `localStorage`

`localStorage` works natively in jsdom; `localStorage.clear()` in
`beforeEach` is enough. To simulate a thrown read:

```ts
const original = Storage.prototype.getItem;
Storage.prototype.getItem = () => { throw new Error("private mode"); };
// … run test …
Storage.prototype.getItem = original;
```

The select swallows the error inside try/catch.

## Testing a subclass

`renderButtonContent()` is the tier-1 hook. Define the subclass and
its tag once at module scope inside the `describe`:

```ts
class FlagLocaleSelect extends LocaleSelect {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.setAttribute("data-testid", "custom");
        span.setAttribute("data-open", String(this.open));
        span.setAttribute("data-value", this.value);
        return span;
    }
}
if (!customElements.get("flag-locale-select")) {
    customElements.define("flag-locale-select", FlagLocaleSelect);
}
```

Assert both that the override took effect and that the base class's
contract survived it:

```ts
expect(el.querySelector('[data-testid="custom"]')).not.toBeNull();
expect(el.querySelector(".locale-select-icon")).toBeNull();

const btn = el.querySelector<HTMLButtonElement>(".locale-select-button")!;
expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
expect(el.querySelector(`#${btn.getAttribute("aria-controls")}`)).not.toBeNull();
```

## jsdom gotchas

- **`scrollIntoView` does not exist.** The element calls it
  optionally (`?.()`), so tests pass — don't add a polyfill and don't
  assert on it.
- **`focusout` fires with a null `relatedTarget`.** The element
  re-checks `document.activeElement` on the next microtask before
  closing, so a test that moves focus synchronously may need a
  `flush()` before asserting the list is closed.
- **Unique ids across instances.** Mounting two elements in one test
  and collecting `options().map(o => o.id)` should give a `Set` of
  the same length — the counter guarantees it.

## Property vs attribute equivalence

```ts
const el = mount({ label: "Language", locales: "en,fr" });
el.locales = ["en", "fr", "ar"];
expect(el.getAttribute("locales")).toBe("en,fr,ar");
expect(el.querySelectorAll(".locale-select-option").length).toBe(3);
```

## Boolean attribute tests

```ts
const a = mount({ label: "L", locales: "en,fr" });
expect((a as LocaleSelect).detectFromNavigator).toBe(false);   // absent → false
expect((a as LocaleSelect).applyDir).toBe(true);               // absent → true

const c = mount({ label: "L", locales: "ar,en", "apply-dir": "false" });
expect((c as LocaleSelect).applyDir).toBe(false);
expect(document.documentElement.hasAttribute("dir")).toBe(false);
```

## One test per §7 acceptance

Each test description starts with the clause number:

```ts
test("§7.16 selecting a different option updates lang, dir, and fires localechange …", async () => { /* … */ });
```

Section map:

| §7 group            | Clauses | Test focus                                              |
| ------------------- | ------- | ------------------------------------------------------- |
| 7.1 markup          | 1–6     | div root, button, listbox, options, glyph, hidden input, per-option `lang` |
| 7.2 pure helpers    | 7–12    | `bcp47LocaleTag`, `isRtlLocale`, `localeName`            |
| 7.3 application     | 13–17   | `target.lang`, `target.dir`, `applyDir`, CustomEvent     |
| 7.4 init value      | 18–21   | storage / value / navigator / defaultValue ordering      |
| 7.5 property API    | 22–23   | array / object property mirroring, class hook, unique ids|
| 7.6 keyboard        | 24–28   | APG listbox contract, typeahead, outside click           |
| 7.7 custom rendering| 29      | `renderButtonContent()` override, base lifecycle intact  |
