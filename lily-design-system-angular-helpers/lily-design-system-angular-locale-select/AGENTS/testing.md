# Testing — LocaleSelect (Angular)

The picker's test suite lives in
[`../locale-select.component.spec.ts`](../locale-select.component.spec.ts)
and asserts every numbered acceptance criterion in `spec.md` §7.
This file documents the test harness and the conventions specific
to this helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { TestBed, type ComponentFixture } from "@angular/core/testing";
import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./locale-select.component";

beforeEach(() => {
    // Reset shared state between tests.
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});

function mount(
    inputs: Record<string, unknown>,
): ComponentFixture<LocaleSelect> {
    const fixture = TestBed.createComponent(LocaleSelect);
    for (const [key, value] of Object.entries(inputs)) {
        fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
}
```

## Pure-helper tests

`bcp47LocaleTag`, `isRtlLocale`, `localeName`, and
`matchNavigatorLanguage` are pure — no `TestBed` needed:

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
it("§7.1 renders a select (implicit combobox role)", () => {
    const fixture = mount({
        label: "Language",
        locales: ["en", "fr"],
    });
    const root = fixture.nativeElement.querySelector("select");
    expect(root).not.toBeNull();
    expect(root.getAttribute("aria-label")).toBe("Language");
});
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting per-option `lang`

```ts
const options = fixture.nativeElement.querySelectorAll("option.locale-select-option");
expect(options[0].getAttribute("lang")).toBe("en");
expect(options[1].getAttribute("lang")).toBe("fr-CA");
```

## Driving a `<select>` change

```ts
const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
select.value = "fr";
select.dispatchEvent(new Event("change", { bubbles: true }));
fixture.detectChanges();
expect(document.documentElement.lang).toBe("fr");
```

## Asserting `localeChange` output

```ts
const events: string[] = [];
fixture.componentRef.instance.localeChange.subscribe((code) => events.push(code));

const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
select.value = "fr";
select.dispatchEvent(new Event("change", { bubbles: true }));
fixture.detectChanges();

expect(events).toContain("fr");
```

## Mocking `navigator.languages`

```ts
it("§7.20 detectFromNavigator picks an exact match", () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    const fixture = mount({
        label: "L",
        locales: ["en", "fr_FR", "ar"],
        detectFromNavigator: true,
    });
    fixture.detectChanges();
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

The picker swallows the error inside try/catch.

## `[(value)]` emulation

Two-way binding via `[(value)]` desugars to `[value]="x"` plus
`(valueChange)="x = $event"`. Simulate it manually:

```ts
const fixture = mount({ label: "L", locales: ["en", "fr"], value: "en" });
fixture.componentRef.instance.value.subscribe((next) => {
    fixture.componentRef.setInput("value", next);
});
```

## Asserting initial-value resolution

```ts
it("§7.18 storageKey writes the active code to localStorage", () => {
    const fixture = mount({
        label: "L",
        locales: ["en", "fr"],
        storageKey: "x",
    });
    fixture.detectChanges();
    expect(localStorage.getItem("x")).toBe("en");
});
```

## Scoped target

```ts
const region = document.createElement("section");
document.body.appendChild(region);

const fixture = mount({
    label: "L",
    locales: ["en", "fr"],
    target: region,
});
fixture.detectChanges();

expect(region.lang).toBe("en");
expect(document.documentElement.lang).toBe("");
```

## SSR sanity

A lightweight SSR sanity check is "the component module imports
without touching `document`":

```ts
it("imports cleanly without DOM access", async () => {
    const mod = await import("./locale-select.component");
    expect(mod.LocaleSelect).toBeDefined();
});
```

## One test per §7 acceptance

Each `it(...)` description starts with the clause number, e.g.
`it("§7.16 selecting an option updates lang and dir …", …)`. Keep
the naming convention so a reviewer can spot a missing clause.

Section map:

| §7 group        | Test focus                                          |
| --------------- | --------------------------------------------------- |
| 7.1 markup      | DOM contract: select, role, name, value, lang       |
| 7.2 pure helpers| bcp47LocaleTag, isRtlLocale, localeName             |
| 7.3 application | target.lang, target.dir, applyDir, emit("localeChange") |
| 7.4 init value  | storage / value / navigator / defaultValue ordering |
| 7.5 class hook  | className applied to root; scoped-target lang test  |
