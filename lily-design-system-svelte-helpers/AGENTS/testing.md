# Testing — Lily Svelte Helpers

Every helper ships a vitest suite that runs under jsdom +
`@testing-library/svelte`. This page lists the test harness
expectations common to all helpers; per-helper acceptance criteria
live in the helper's own `spec/index.md` §7.

## Stack

- [vitest](https://vitest.dev/) — runner + assertion library.
- [jsdom](https://github.com/jsdom/jsdom) — DOM in Node (configured
  via `vitest.config.ts` → `test.environment = "jsdom"`).
- [`@testing-library/svelte`](https://testing-library.com/docs/svelte-testing-library/intro/)
  — `render`, `screen`, `fireEvent`, `cleanup`.
- [`@testing-library/jest-dom`](https://github.com/testing-library/jest-dom)
  — extra matchers (`toBeInTheDocument`, `toBeChecked`, etc.).

## Minimal `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
    plugins: [svelte({ hot: false })],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
    },
});
```

The setup file imports `@testing-library/jest-dom` and registers
`afterEach(cleanup)`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/svelte";
import { afterEach } from "vitest";
afterEach(() => cleanup());
```

## Standard render

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import ThemeChooser from "./ThemeChooser.svelte";

beforeEach(() => {
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
    localStorage.clear();
});

it("§7.1 renders a <select> with the base class and label", () => {
    const { container } = render(ThemeChooser, {
        props: {
            label: "Theme",
            themesUrl: "/themes/",
            themes: ["light", "dark"],
        },
    });
    const root = container.querySelector("select.theme-chooser");
    expect(root).not.toBeNull();
    expect(root!.getAttribute("aria-label")).toBe("Theme");
});
```

`render` returns `{ container, component, ... }`; `container` is a
`<div>` parented in `document.body`, so DOM queries from
`document.documentElement` see the rendered component plus any
side-effect mutations the select performs.

## Common assertions

| Goal                                | Pattern                                                              |
| ----------------------------------- | -------------------------------------------------------------------- |
| Wait for `$effect` to fire          | `await tick()` or `await Promise.resolve()`                          |
| Find an option by value             | `container.querySelector('option[value="dark"]')`                    |
| Change the selection                | `await fireEvent.change(select, { target: { value: "dark" } })`      |
| Assert `onChange` was called        | `expect(onChange).toHaveBeenCalledWith("dark")`                      |
| Inspect document mutations          | `document.documentElement.dataset.theme`                              |
| Re-render fresh                     | `cleanup(); render(Select, { props })`                               |
| `localStorage` round-trip           | `localStorage.setItem(...); /* re-render */`                         |

## Driving a `bind:value` test

`bind:value` is sugar; in a test we read and write `value` on the
component instance Svelte returns:

```ts
import { tick } from "svelte";

it("§7.6 resolves the initial theme to 'light'", async () => {
    const { component } = render(ThemeChooser, {
        props: {
            label: "Theme",
            themesUrl: "/t/",
            themes: ["light", "dark"],
        },
    });
    await tick();
    expect(document.documentElement.dataset.theme).toBe("light");
});
```

When the test needs to observe the bind-back, pass a spy `onChange`
or assert on `document.documentElement.dataset.theme`.

## Snippet tests

Verify the snippet contract by passing a child snippet that records
the args. Because Svelte 5 snippets are compile-time, tests build a
small wrapper `.svelte` file or use the `createRawSnippet` helper:

```ts
import { createRawSnippet } from "svelte";

it("§7.13 children snippet receives ChildArgs", async () => {
    let captured: any = null;
    const children = createRawSnippet((args) => {
        captured = args();
        return { render: () => "<div data-testid='custom'></div>" };
    });
    render(ThemeChooser, {
        props: {
            label: "Theme",
            themesUrl: "/t/",
            themes: ["light", "dark"],
            children,
        },
    });
    await tick();
    expect(captured.themes).toEqual(["light", "dark"]);
    expect(typeof captured.setTheme).toBe("function");
});
```

If `createRawSnippet` is unavailable in the test runtime, fall back
to a `.svelte` wrapper fixture under `tests/fixtures/` and `render`
that wrapper instead.

## SSR sanity

For an SSR sanity test, import `render` from `svelte/server` and
assert that the rendered string contains the expected markup and no
DOM-only call ran:

```ts
import { render as ssrRender } from "svelte/server";
import ThemeChooser from "./ThemeChooser.svelte";

it("renders cleanly under SSR", () => {
    const { html } = ssrRender(ThemeChooser, {
        props: {
            label: "Theme",
            themesUrl: "/t/",
            themes: ["light", "dark"],
            value: "light",
        },
    });
    expect(html).toContain('class="theme-chooser');
    expect(html).toContain('value="light"');
});
```

The component must not throw during SSR — that's the canonical
"safe-on-server" check.

## One test per spec § acceptance

Each helper's `spec/index.md` §7 numbers its acceptance criteria, and the
test file names each `it(...)` after the section number so a
reviewer can cross-reference the spec without scrolling:

```ts
it("§7.6 resolves the initial theme from `value` when supplied", ...);
```

This is mechanical and intentional — when a clause is added to the
spec, a test must follow.

## Don't

- Don't mock `svelte` — use the real reactive system and runes.
- Don't mock `document` / `localStorage` — jsdom is enough.
- Don't use snapshot tests for HTML; assert specific attributes and
  text. Snapshots invite drift; targeted asserts catch regressions.
- Don't use `setTimeout` to "wait" — use `await tick()` or
  `await Promise.resolve()`.
- Don't reach for `flushSync` unless a test deliberately exercises a
  synchronous reactive boundary; the default microtask flush handles
  every case the helpers care about.
