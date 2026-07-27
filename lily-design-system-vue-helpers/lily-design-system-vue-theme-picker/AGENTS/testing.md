# Testing — ThemeChooser (Vue)

The chooser's test suite lives in
[`../ThemeChooser.test.ts`](../ThemeChooser.test.ts) and asserts every
numbered acceptance criterion in `spec/index.md` §7. This file documents
the test harness and the conventions specific to this helper. For
the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ThemeChooser, { themeHref, normaliseThemesUrl } from "./ThemeChooser.vue";

beforeEach(() => {
    // Reset shared state between tests.
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

Each test re-runs the whole `onMounted` lifecycle by calling
`mount(ThemeChooser, { props: ... })`.

Mount with `attachTo: document.body`. The component moves focus (to the
`<ul>` on open, back to the button on commit) and listens for document
clicks; neither works on a detached element, so focus assertions
silently pass-or-fail wrongly without it. Unmount every wrapper in
`afterEach` so the document listeners do not accumulate across tests.

Locating the parts:

```ts
const button = wrapper.find("button.theme-chooser-button");
const list = wrapper.find("ul.theme-chooser-list");
const options = wrapper.findAll("li.theme-chooser-option");
```

## Async waits

The chooser's `onMounted` and `watch` callbacks fire across one or
two micro-task ticks. Use `await wrapper.vm.$nextTick()` after
mount and after any `setProps` to settle the DOM:

```ts
const wrapper = mount(ThemeChooser, { props: { /* … */ } });
await wrapper.vm.$nextTick();
// initial-value resolution may have emitted update:value which
// re-renders; a second tick guarantees the watch has fired.
await wrapper.vm.$nextTick();
```

When the watch chain is longer (e.g. a `update:value` triggers a
parent prop change which feeds back into the chooser), add
`await flushPromises()`:

```ts
import { flushPromises } from "@vue/test-utils";

const wrapper = mount(ThemeChooser, { /* … */ });
await flushPromises();
```

## v-model emulation

`v-model:value` is sugar for `:value` + `@update:value`. Simulate it
manually:

```ts
let currentValue = "";
const wrapper = mount(ThemeChooser, {
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

## Triggering a selection

Open the listbox, then click the option:

```ts
await wrapper.find("button.theme-chooser-button").trigger("click");
await wrapper.findAll("li.theme-chooser-option")[1].trigger("click");
await flush();
```

Or drive it from the keyboard, which is the path the APG contract
cares about:

```ts
const button = wrapper.find("button.theme-chooser-button");
const list = wrapper.find("ul.theme-chooser-list");

await button.trigger("keydown", { key: "ArrowDown" }); // opens, index 0 active
await flush();
await list.trigger("keydown", { key: "ArrowDown" });   // index 1 active
await list.trigger("keydown", { key: "Enter" });       // commit + close
await flush();
```

Keydown handlers are bound to the **button** for the closed state and
to the **`<ul>`** for the open state. Firing an open-state key on the
button (or vice versa) hits no handler and the test will fail in a
confusing way.

`await flush()` matters after opening and after closing: both go
through `await nextTick()` before moving focus. A single
`$nextTick()` is not always enough — use a helper that lets the
macro-task queue drain too:

```ts
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}
```

## Asserting open / closed state

```ts
const el = list.element as HTMLElement;
expect(el.hasAttribute("hidden")).toBe(true);            // closed
expect(button.attributes("aria-expanded")).toBe("false");
```

`hidden` is the open/closed signal, not a class. `aria-activedescendant`
is present only while open, so assert its **absence** after close:

```ts
expect(el.hasAttribute("aria-activedescendant")).toBe(false);
```

## Asserting the active option

Compare `aria-activedescendant` against the option's id rather than
hard-coding an id string — ids come from the module counter
`nextThemeChooserId()` and differ per mount:

```ts
expect(el.getAttribute("aria-activedescendant")).toBe(el.children[1].id);
```

For the CSS-facing signal, assert exactly one `[data-active]`:

```ts
const active = el.querySelectorAll("[data-active]");
expect(active.length).toBe(1);
expect(active[0].id).toBe(el.children[1].id);
```

Keep `aria-selected` (committed) and `data-active` (keyboard-active)
assertions distinct — a test that conflates them will not catch a
regression in either.

## Asserting focus movement

```ts
expect(document.activeElement).toBe(list.element);   // after open
expect(document.activeElement).toBe(button.element); // after Enter / Escape
```

For `Tab` and outside-click, the contract is that focus is *not* pulled
back:

```ts
await list.trigger("keydown", { key: "Tab" });
await flush();
expect(document.activeElement).not.toBe(button.element);
```

Outside clicks go through a real document listener, so dispatch a real
bubbling event rather than using `trigger`:

```ts
document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
```

## jsdom gaps to know about

- **`scrollIntoView` is not implemented.** The component calls it
  optionally (`el?.scrollIntoView?.(…)`), so tests pass — but never
  assert on scroll position.
- **`CSS.escape` is missing in some versions.** The component looks
  options up by `document.getElementById`, which sidesteps it. Do the
  same in tests.
- **Typeahead uses a real 500 ms timer.** Within one test the buffer
  accumulates; if you need two independent matches, use fake timers or
  keep the prefixes distinct.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-chooser="theme"]',
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

The default slot replaces the **button glyph**, so assert both that the
custom content is inside the button and that `.theme-chooser-icon` is
gone:

```ts
let captured: any = null;
const wrapper = mount(ThemeChooser, {
    props: { label: "T", themesUrl: "/t/", themes: ["light", "dark"], value: "dark" },
    attachTo: document.body,
    slots: {
        default: (args: any) => {
            captured = args;
            return "custom glyph";
        },
    },
});
await flush();
expect(wrapper.find("button.theme-chooser-button").text()).toContain("custom glyph");
expect(wrapper.find(".theme-chooser-icon").exists()).toBe(false);
expect(captured.value).toBe("dark");
expect(captured.open).toBe(false);
expect(typeof captured.labelFor).toBe("function");
```

The slot function re-runs on every render, so to assert that `open`
tracks the listbox, collect the values rather than reading the last
capture:

```ts
const seen: boolean[] = [];
// slot: (args) => { seen.push(args.open); return "glyph"; }
expect(seen[0]).toBe(false);
expect(seen[seen.length - 1]).toBe(true);
```

There is no `themes`, `setTheme`, or `name` in `SlotArgs` — a test
asserting those is testing the pre-rewrite contract.

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
        createSSRApp(ThemeChooser, {
            label: "Theme",
            themesUrl: "/t/",
            themes: ["light", "dark"],
            value: "light",
        }),
    );
    expect(html).toContain('class="theme-chooser"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('aria-label="Theme"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('value="light"');
});
```

This guarantees no `document.*` access leaked into the render path.

## What every §7 test asserts

See the per-clause map in
[`../spec/index.md` §7](../spec/index.md#7-testing-acceptance-criteria). Each
`it(...)` description starts with the clause number, e.g.
`it("§7.6 resolves the initial theme to 'light' …", …)`. Keep the
naming convention so a reviewer can spot a missing clause.
