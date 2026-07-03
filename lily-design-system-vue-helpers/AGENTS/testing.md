# Testing — Lily Vue Helpers

Every helper ships a vitest suite that runs under jsdom +
`@vue/test-utils`. This page lists the test harness expectations
common to all helpers; per-helper acceptance criteria live in the
helper's own `spec/index.md` §7.

## Stack

- [vitest](https://vitest.dev/) — runner + assertion library.
- [jsdom](https://github.com/jsdom/jsdom) — DOM in Node (configured
  via `vitest.config.ts` → `test.environment = "jsdom"`).
- [`@vue/test-utils`](https://test-utils.vuejs.org/) — `mount`,
  `flushPromises`, `wrapper.find`, `wrapper.findAll`.

## Minimal `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: "jsdom",
        globals: true,
    },
});
```

## Standard mount

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ThemeSelect from "./ThemeSelect.vue";

beforeEach(() => {
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});

it("renders a select with the consumer's aria-label", async () => {
    const wrapper = mount(ThemeSelect, {
        props: {
            label: "Theme",
            themesUrl: "/themes/",
            themes: ["light", "dark"],
        },
    });
    await wrapper.vm.$nextTick();
    const root = wrapper.find("select");
    expect(root.exists()).toBe(true);
    expect(root.attributes("aria-label")).toBe("Theme");
    expect(wrapper.findAll("option")).toHaveLength(2);
});
```

## Common assertions

| Goal                                | Pattern                                                              |
| ----------------------------------- | -------------------------------------------------------------------- |
| Wait for `onMounted` + `watch`      | `await wrapper.vm.$nextTick(); await flushPromises();`               |
| Find an option by value             | `wrapper.find('option[value="dark"]')`                              |
| Change the selection                | `await wrapper.find("select").setValue("dark")` *or* `.trigger("change")` |
| Assert `update:value` was emitted   | `expect(wrapper.emitted("update:value")?.[0]).toEqual(["dark"])`     |
| Assert `change` was emitted         | `expect(wrapper.emitted("change")?.[0]).toEqual(["dark"])`           |
| Inspect document mutations          | `document.documentElement.dataset.theme`                              |
| Re-mount fresh                      | `wrapper.unmount(); /* mount again */`                               |
| `localStorage` round-trip           | `localStorage.setItem(...); /* re-mount */`                          |

## Driving a `v-model:value` test

`v-model:value` is sugar for `:value` + `@update:value`. Drive both
sides like so:

```ts
const wrapper = mount(ThemeSelect, {
    props: {
        label: "Theme",
        themesUrl: "/themes/",
        themes: ["light", "dark"],
        value: "light",
        "onUpdate:value": (next: string) => wrapper.setProps({ value: next }),
    },
});
```

This makes the wrapper behave as if it were rendered inside a parent
with `<ThemeSelect v-model:value="theme" />`.

## Scoped-slot tests

Verify the slot contract by passing a slot template that records the
args:

```ts
let captured: any = null;
const wrapper = mount(ThemeSelect, {
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
```

## SSR sanity

For an SSR sanity test, import `renderToString` from
`vue/server-renderer` and assert that the rendered string contains
the expected markup and no DOM-only call ran:

```ts
import { renderToString } from "vue/server-renderer";
import { createSSRApp } from "vue";

const html = await renderToString(
    createSSRApp(ThemeSelect, {
        label: "Theme",
        themesUrl: "/t/",
        themes: ["light", "dark"],
        value: "light",
    }),
);
expect(html).toContain('aria-label="Theme"');
expect(html).toContain('value="light"');
```

The component must not throw during SSR — that's the canonical
"safe-on-server" check.

## One test per spec § acceptance

The convention from the Svelte canonical applies: each helper's
`spec/index.md` §7 numbers its acceptance criteria, and the test file
names each `it(...)` after the section number so a reviewer can
cross-reference the spec without scrolling:

```ts
it("§7.6 resolves the initial theme from `value` when supplied", ...);
```

This is mechanical and intentional — when a clause is added to the
spec, a test must follow.

## Don't

- Don't mock `vue` — use the real reactive system.
- Don't mock `document` / `localStorage` — jsdom is enough.
- Don't use snapshot tests for HTML; assert specific attributes and
  text. Snapshots invite drift; targeted asserts catch regressions.
- Don't use `setTimeout` to "wait" — use `await flushPromises()` or
  `await wrapper.vm.$nextTick()`.
