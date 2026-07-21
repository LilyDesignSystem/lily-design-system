# Testing — LocaleChooser (Vue)

The chooser's test suite lives in
[`../LocaleChooser.test.ts`](../LocaleChooser.test.ts) and asserts
every numbered acceptance criterion in `spec/index.md` §7. This file
documents the test harness and the conventions specific to this
helper. For the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import LocaleChooser, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocaleChooser.vue";

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

Because the listbox takes DOM focus on open, mount with
`attachTo: document.body` for anything that asserts focus or
keyboard behaviour.

```ts
it("§7.1 renders a button that controls a listbox", async () => {
    const wrapper = mount(LocaleChooser, {
        props: { label: "Language", locales: ["en", "fr"] },
        attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const button = wrapper.find("button.locale-chooser-button");
    expect(button.attributes("aria-label")).toBe("Language");
    expect(button.attributes("aria-haspopup")).toBe("listbox");
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(wrapper.findAll("li.locale-chooser-option")).toHaveLength(2);
});
```

## Asserting `lang` and `dir`

```ts
expect(document.documentElement.lang).toBe("ar");
expect(document.documentElement.dir).toBe("rtl");
```

## Asserting per-option `lang`

```ts
const options = wrapper.findAll("li.locale-chooser-option");
expect(options[0].attributes("lang")).toBe("en");
expect(options[1].attributes("lang")).toBe("fr-CA");
```

## Picking an option

Open the listbox first — the options are inside a `hidden` `<ul>`
until then, and clicking one is what commits it:

```ts
const button = wrapper.find("button.locale-chooser-button");
await button.trigger("click");
await wrapper.findAll("li.locale-chooser-option")[1].trigger("click");
expect(wrapper.emitted("update:value")?.at(-1)).toEqual(["fr"]);
expect(wrapper.emitted("change")?.at(-1)).toEqual(["fr"]);
```

## Driving the keyboard contract

Keydowns go to the button to open, and to the `<ul>` once open. The
component focuses the `<ul>` inside an `await nextTick()`, so flush
the scheduler before asserting focus:

```ts
await button.trigger("keydown", { key: "ArrowDown" });
await flush();
const list = wrapper.find("ul.locale-chooser-list");
expect(document.activeElement).toBe(list.element);

await list.trigger("keydown", { key: "ArrowDown" });
expect(list.attributes("aria-activedescendant")).toBe(
    list.element.children[1].id,
);

await list.trigger("keydown", { key: "Enter" });
await flush();
expect(list.element.hasAttribute("hidden")).toBe(true);
expect(document.activeElement).toBe(button.element);
```

`flush()` in the suite is `nextTick()` → `setTimeout(0)` →
`nextTick()`, which lets the `onMounted` effects and the focus
`nextTick` chains all settle.

Typeahead is a plain keydown with a single printable character;
clicking outside is a `MouseEvent` dispatched on `document.body`:

```ts
await list.trigger("keydown", { key: "F" }); // jumps to "French"
document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
await flush();
expect(list.element.hasAttribute("hidden")).toBe(true);
```

## Mocking `navigator.languages`

```ts
it("§7.20 detectFromNavigator picks an exact match", async () => {
    Object.defineProperty(navigator, "languages", {
        configurable: true,
        get: () => ["fr-FR", "en"],
    });
    const wrapper = mount(LocaleChooser, {
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

The chooser swallows the error inside try/catch.

## v-model emulation

`v-model:value` is sugar for `:value` + `@update:value`. Simulate
it manually:

```ts
let currentValue = "en";
const wrapper = mount(LocaleChooser, {
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

The default slot replaces the button glyph, so assert both that the
custom content rendered inside the button and that the built-in
`.locale-chooser-icon` span is gone:

```ts
let captured: any = null;
const wrapper = mount(LocaleChooser, {
    props: { label: "L", locales: ["en", "fr"], value: "fr" },
    slots: {
        default: (args: any) => {
            captured = args;
            return "custom glyph";
        },
    },
});
await wrapper.vm.$nextTick();
expect(wrapper.find("button.locale-chooser-button").text()).toContain(
    "custom glyph",
);
expect(wrapper.find(".locale-chooser-icon").exists()).toBe(false);
expect(captured.value).toBe("fr");
expect(captured.open).toBe(false);
expect(captured.labelFor("en_US")).toBe("English (United States)");
```

Because the slot function re-runs on every render, pushing
`args.open` into an array is the cleanest way to assert that the flag
tracks the listbox state.

## SSR sanity test

```ts
import { renderToString } from "vue/server-renderer";
import { createSSRApp } from "vue";

it("renders cleanly under SSR", async () => {
    const html = await renderToString(
        createSSRApp(LocaleChooser, {
            label: "Language",
            locales: ["en", "fr"],
            value: "fr",
        }),
    );
    expect(html).toContain('aria-label="Language"');
    expect(html).toContain('aria-haspopup="listbox"');
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

| §7 group        | Clauses | Test focus                                       |
| --------------- | ------- | ------------------------------------------------ |
| 7.1 markup      | 1–6     | Root div, button + listbox wiring, glyph, hidden input, per-option `lang`, labels |
| 7.2 pure helpers| 7–12    | bcp47LocaleTag, isRtlLocale, localeName, matchNavigatorLanguage |
| 7.3 application | 13–17   | target.lang, target.dir, applyDir, emit("change"), custom target |
| 7.4 init value  | 18–21   | storage / value / navigator / defaultValue ordering |
| 7.5 spread/slot | 22–23   | `$attrs` fall-through and the `SlotArgs` contract |
| 7.6 keyboard    | 24–27   | Open keys, arrow clamping, Home/End, commit / cancel / Tab, typeahead, outside click |
