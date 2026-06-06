# Testing — ThemePicker (Vue)

The picker's test suite lives in
[`../ThemePicker.test.ts`](../ThemePicker.test.ts) and asserts every
numbered acceptance criterion in `spec.md` §7. This file documents
the test harness and the conventions specific to this helper. For
the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ThemePicker, { themeHref, normaliseThemesUrl } from "./ThemePicker.vue";

beforeEach(() => {
    // Reset shared state between tests.
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

Each test re-runs the whole `onMounted` lifecycle by calling
`mount(ThemePicker, { props: ... })`.

## Async waits

The picker's `onMounted` and `watch` callbacks fire across one or
two micro-task ticks. Use `await wrapper.vm.$nextTick()` after
mount and after any `setProps` to settle the DOM:

```ts
const wrapper = mount(ThemePicker, { props: { /* … */ } });
await wrapper.vm.$nextTick();
// initial-value resolution may have emitted update:value which
// re-renders; a second tick guarantees the watch has fired.
await wrapper.vm.$nextTick();
```

When the watch chain is longer (e.g. a `update:value` triggers a
parent prop change which feeds back into the picker), add
`await flushPromises()`:

```ts
import { flushPromises } from "@vue/test-utils";

const wrapper = mount(ThemePicker, { /* … */ });
await flushPromises();
```

## v-model emulation

`v-model:value` is sugar for `:value` + `@update:value`. Simulate it
manually:

```ts
let currentValue = "";
const wrapper = mount(ThemePicker, {
    props: {
        label: "Theme",
        themesUrl: "/t/",
        themes: ["light", "dark"],
        value: currentValue,
        "onUpdate:value": (next: string) => {
            currentValue = next;
            wrapper.setProps({ value: next });
        },
    },
});
```

## Triggering a radio change

```ts
const dark = wrapper.find('input[value="dark"]');
await dark.setValue(true);
// Or, equivalently:
await dark.trigger("change");
```

`setValue(true)` on a radio sets `checked = true` and dispatches
`change`. Use either; the picker reads from `e.target.value`.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-picker="theme"]',
);
expect(link).not.toBeNull();
expect(link!.href).toMatch(/\/t\/light\.css$/);
```

`href` on an `HTMLLinkElement` resolves to an absolute URL, so use
a regex with the suffix rather than an exact match.

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

## Scoped-slot tests

```ts
let captured: any = null;
const wrapper = mount(ThemePicker, {
    props: { label: "T", themesUrl: "/t/", themes: ["a", "b"] },
    slots: {
        default: (args: any) => {
            captured = args;
            return [];
        },
    },
});
await wrapper.vm.$nextTick();
expect(captured.themes).toEqual(["a", "b"]);
expect(typeof captured.setTheme).toBe("function");
expect(typeof captured.labelFor).toBe("function");
expect(captured.name).toBe("theme");
```

## Pure-helper tests

`normaliseThemesUrl` and `themeHref` are pure — no `mount` needed:

```ts
it("normaliseThemesUrl appends a slash", () => {
    expect(normaliseThemesUrl("/x")).toBe("/x/");
    expect(normaliseThemesUrl("/x/")).toBe("/x/");
});

it("themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## SSR sanity test

```ts
import { renderToString } from "vue/server-renderer";
import { createSSRApp } from "vue";

it("renders cleanly under SSR", async () => {
    const html = await renderToString(
        createSSRApp(ThemePicker, {
            label: "Theme",
            themesUrl: "/t/",
            themes: ["light", "dark"],
            value: "light",
        }),
    );
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('aria-label="Theme"');
    expect(html).toContain('value="light"');
});
```

This guarantees no `document.*` access leaked into the render path.

## What every §7 test asserts

See the per-clause map in
[`../spec.md` §7](../spec.md#7-testing-acceptance-criteria). Each
`it(...)` description starts with the clause number, e.g.
`it("§7.6 resolves the initial theme to 'light' …", …)`. Keep the
naming convention so a reviewer can spot a missing clause.
