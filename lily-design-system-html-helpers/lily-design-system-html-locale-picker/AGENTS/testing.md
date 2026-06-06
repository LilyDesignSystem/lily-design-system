# Testing — `<locale-picker>` (HTML helper)

The picker's test suite lives in
[`../locale-picker.test.ts`](../locale-picker.test.ts) and asserts
every numbered acceptance criterion in `spec.md` §7. This file
documents the test harness and conventions specific to this helper.
For the catalog-wide rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import "./index"; // registers <locale-picker>
import type { LocalePicker } from "./locale-picker";
import {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./locale-picker";

beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    document.body.innerHTML = "";
    localStorage.clear();
});
```

## Pure-helper tests

`bcp47LocaleTag`, `isRtlLocale`, `localeName`, and
`matchNavigatorLanguage` are pure — no element mount needed:

```ts
it("§7.7 bcp47LocaleTag(en_US) === en-US", () => {
    expect(bcp47LocaleTag("en_US")).toBe("en-US");
});

it("§7.10 isRtlLocale handles script subtags", () => {
    expect(isRtlLocale("uz_Arab_AF")).toBe(true);
});
```

## Standard mount

```ts
function mountPicker(attrs: Record<string, string>): LocalePicker {
    const el = document.createElement("locale-picker") as LocalePicker;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

it("§7.1 renders a fieldset with role=radiogroup", () => {
    const el = mountPicker({ label: "Language", locales: "en,fr" });
    const root = el.querySelector("fieldset");
    expect(root).not.toBeNull();
    expect(root!.getAttribute("role")).toBe("radiogroup");
});
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting per-option `lang`

```ts
const labels = el.querySelectorAll("label.locale-picker-option");
expect(labels[0].getAttribute("lang")).toBe("en");
expect(labels[1].getAttribute("lang")).toBe("fr-CA"); // BCP 47 hyphen
```

## Driving a radio change

```ts
const fr = el.querySelector<HTMLInputElement>('input[value="fr"]')!;
fr.checked = true;
fr.dispatchEvent(new Event("change", { bubbles: true }));
expect(el.getAttribute("value")).toBe("fr");
expect(document.documentElement.lang).toBe("fr");
```

## Capturing the `localechange` CustomEvent

```ts
const events: LocalePickerChangeDetail[] = [];
el.addEventListener("localechange", (e) => {
    events.push((e as CustomEvent<LocalePickerChangeDetail>).detail);
});
el.value = "ar";
expect(events.at(-1)).toEqual({ locale: "ar" });
```

## Mocking `navigator.languages`

```ts
it("§7.20 detect-from-navigator picks an exact match", () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    const el = mountPicker({
        label: "L",
        locales: "en,fr_FR,ar",
        "detect-from-navigator": "",
    });
    expect(document.documentElement.lang).toBe("fr-FR");
});
```

`configurable: true` is essential; otherwise subsequent
`defineProperty` calls throw. Reset between tests with another
`defineProperty` or restore the original descriptor.

## Mocking `localStorage`

`localStorage` works natively in jsdom; `localStorage.clear()` in
`beforeEach` is enough. To simulate a thrown read:

```ts
const original = Storage.prototype.getItem;
Storage.prototype.getItem = () => { throw new Error("private mode"); };
// … run test …
Storage.prototype.getItem = original;
```

The picker swallows the error inside try/catch.

## Property vs attribute equivalence

```ts
const a = mountPicker({ locales: "en,fr,ar" });
const b = mountPicker({});
b.locales = ["en", "fr", "ar"];

expect(a.querySelectorAll("input").length).toBe(3);
expect(b.querySelectorAll("input").length).toBe(3);
expect(b.getAttribute("locales")).toBe("en,fr,ar");
```

## Boolean attribute tests

```ts
// detect-from-navigator absent → false
const a = mountPicker({ label: "L", locales: "en,fr" });
expect((a as LocalePicker).detectFromNavigator).toBe(false);

// presence (any value) → true
const b = mountPicker({ label: "L", locales: "en,fr", "detect-from-navigator": "" });
expect((b as LocalePicker).detectFromNavigator).toBe(true);

// apply-dir absent → true (default)
expect((a as LocalePicker).applyDir).toBe(true);

// apply-dir="false" → false
const c = mountPicker({ label: "L", locales: "ar,en", "apply-dir": "false" });
expect((c as LocalePicker).applyDir).toBe(false);
expect(document.documentElement.dir).toBe(""); // never written
```

## SSR sanity (module load only)

```ts
it("module is import-safe under SSR", async () => {
    const original = (globalThis as any).customElements;
    delete (globalThis as any).customElements;
    try {
        const mod = await import("./index");
        expect(mod.LocalePicker).toBeDefined();
    } finally {
        (globalThis as any).customElements = original;
    }
});
```

## One test per §7 acceptance

Each `it(...)` description starts with the clause number:

```ts
it("§7.16 selecting a radio updates lang and dir …", () => { /* … */ });
```

Section map:

| §7 group        | Test focus                                          |
| --------------- | --------------------------------------------------- |
| 7.1 markup      | DOM contract: fieldset, role, name, value, lang     |
| 7.2 pure helpers| bcp47LocaleTag, isRtlLocale, localeName             |
| 7.3 application | target.lang, target.dir, applyDir, CustomEvent      |
| 7.4 init value  | storage / value / navigator / defaultValue ordering |
| 7.5 element shape | array/object property mirroring                   |
