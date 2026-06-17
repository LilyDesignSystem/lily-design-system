# Testing — LocaleSelect (Vue)

The picker's test suite lives in
[`../LocaleSelect.test.ts`](../LocaleSelect.test.ts) and asserts
every numbered acceptance criterion in `spec.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocaleSelect.vue";

beforeEach(() => {
    // Reset shared state between tests.
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});
```

## Pure-helper tests

`bcp47LocaleTag`, `isRtlLocale`, `localeName`, and
`matchNavigatorLanguage` are pure — no `mount` needed:

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
it("§7.1 renders a select with the supplied aria-label", async () => {
    const wrapper = mount(LocaleSelect, {
        props: { label: "Language", locales: ["en", "fr"] },
    });
    await wrapper.vm.$nextTick();
    const root = wrapper.find("select");
    expect(root.exists()).toBe(true);
    expect(root.attributes("aria-label")).toBe("Language");
    expect(wrapper.findAll("option")).toHaveLength(2);
});
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting per-option `lang`

```ts
const options = wrapper.findAll("option.locale-select-option");
expect(options[0].attributes("lang")).toBe("en");
expect(options[1].attributes("lang")).toBe("fr-CA");
```

## Driving a `<select>` change

```ts
const select = wrapper.find("select");
await select.setValue("fr");
expect(wrapper.emitted("update:value")?.[0]).toEqual(["fr"]);
expect(wrapper.emitted("change")?.[0]).toEqual(["fr"]);
```

## Mocking `navigator.languages`

```ts
it("§7.20 detectFromNavigator picks an exact match", async () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    const wrapper = mount(LocaleSelect, {
        props: {
            label: "L",
            locales: ["en", "fr_FR", "ar"],
            detectFromNavigator: true,
        },
    });
    await wrapper.vm.$nextTick();
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

## v-model emulation

`v-model:value` is sugar for `:value` + `@update:value`. Simulate
it manually:

```ts
let currentValue = "en";
const wrapper = mount(LocaleSelect, {
    props: {
        label: "L",
        locales: ["en", "fr", "ar"],
        value: currentValue,
        "onUpdate:value": (next: string) => {
            currentValue = next;
            wrapper.setProps({ value: next });
        },
    },
});
```

## Scoped-slot tests

```ts
let captured: any = null;
const wrapper = mount(LocaleSelect, {
    props: { label: "L", locales: ["en", "fr"] },
    slots: {
        default: (args: any) => {
            captured = args;
            return [];
        },
    },
});
await wrapper.vm.$nextTick();
expect(captured.locales).toEqual(["en", "fr"]);
expect(typeof captured.setLocale).toBe("function");
expect(typeof captured.tagFor).toBe("function");
expect(typeof captured.isRtl).toBe("function");
expect(captured.tagFor("en_US")).toBe("en-US");
expect(captured.isRtl("ar")).toBe(true);
```

## SSR sanity test

```ts
import { renderToString } from "vue/server-renderer";
import { createSSRApp } from "vue";

it("renders cleanly under SSR", async () => {
    const html = await renderToString(
        createSSRApp(LocaleSelect, {
            label: "Language",
            locales: ["en", "fr"],
            value: "fr",
        }),
    );
    expect(html).toContain('aria-label="Language"');
    expect(html).toContain('value="fr"');
});
```

This guarantees no `document.*` access leaked into the render path.

## One test per §7 acceptance

The convention from the Svelte canonical applies: each `it(...)`
description starts with the clause number, e.g.
`it("§7.16 selecting an option updates lang and dir …", …)`. Keep
the naming convention so a reviewer can spot a missing clause.

Section map:

| §7 group        | Test focus                                       |
| --------------- | ------------------------------------------------ |
| 7.1 markup      | DOM contract: select, name, value, lang          |
| 7.2 pure helpers| bcp47LocaleTag, isRtlLocale, localeName          |
| 7.3 application | target.lang, target.dir, applyDir, emit("change") |
| 7.4 init value  | storage / value / navigator / defaultValue ordering |
| 7.5 spread/slot | $attrs fall-through and SlotArgs contract         |
