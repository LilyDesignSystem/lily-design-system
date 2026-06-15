# Testing — ThemeSelect (Svelte)

The picker's test suite lives in
[`../ThemeSelect.test.ts`](../ThemeSelect.test.ts) and asserts every
numbered acceptance criterion in `spec.md` §7. This file documents
the test harness and the conventions specific to this helper. For
the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import ThemeSelect, { themeHref, normaliseThemesUrl } from "./ThemeSelect.svelte";

beforeEach(() => {
    // Reset shared state between tests.
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

Each test re-runs the whole `$effect` lifecycle by calling
`render(ThemeSelect, { props })` followed by `await tick()`.

## Async waits

The picker's `$effect` fires on the next microtask after mount. Use
`await tick()` to let it run:

```ts
const { container } = render(ThemeSelect, { props: { /* … */ } });
await tick();
// initial-value resolution may have re-run $effect; a second tick
// guarantees the apply step has fired.
await tick();
```

`tick()` resolves after Svelte's scheduler flushes pending effects.
Two `await tick()` calls cover the resolution-then-apply two-step.

## Pure-helper tests

`normaliseThemesUrl` and `themeHref` are pure — no `render` needed:

```ts
it("normaliseThemesUrl appends a slash", () => {
    expect(normaliseThemesUrl("/x")).toBe("/x/");
    expect(normaliseThemesUrl("/x/")).toBe("/x/");
});

it("themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});
```

## Triggering a radio change

```ts
import { fireEvent } from "@testing-library/svelte";

const dark = container.querySelector('input[value="dark"]') as HTMLInputElement;
await fireEvent.click(dark);
// Or, equivalently:
dark.checked = true;
await fireEvent.change(dark);
```

The picker reads `e.target.value` inside its `onchange` handler, so
either approach drives the same code path.

## Asserting the managed `<link>`

```ts
const link = document.head.querySelector<HTMLLinkElement>(
    'link[data-lily-theme-select="theme"]',
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

## Driving a `bind:value` test

`bind:value` is sugar; in a test we either inspect the side effect
(`data-theme`, the managed `<link>`, the `localStorage` write) or
spy on `onChange`:

```ts
const onChange = vi.fn();
const { container } = render(ThemeSelect, {
    props: {
        label: "Theme",
        themesUrl: "/t/",
        themes: ["light", "dark"],
        onChange,
    },
});
await tick();
expect(onChange).toHaveBeenCalledWith("light");
```

To observe the bind-back side, mount the picker inside a tiny
wrapper `.svelte` fixture that does `bind:value` and asserts the
new value on its own `$state`. Most tests don't need this — the
`onChange` spy is enough.

## Snippet tests

Use `createRawSnippet` to construct a snippet on the fly:

```ts
import { createRawSnippet } from "svelte";

it("§7.13 children snippet receives ChildArgs", async () => {
    let captured: any = null;
    const children = createRawSnippet((args) => {
        captured = args();
        return { render: () => "<div data-testid='custom'></div>" };
    });
    render(ThemeSelect, {
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
    expect(typeof captured.labelFor).toBe("function");
    expect(captured.name).toBe("theme");
});
```

If `createRawSnippet` is unavailable in the test runtime, write a
small wrapper `.svelte` fixture under `tests/fixtures/` that imports
`ThemeSelect` and supplies the snippet inline, then `render` the
fixture instead.

## SSR sanity test

```ts
import { render as ssrRender } from "svelte/server";

it("renders cleanly under SSR", () => {
    const { html } = ssrRender(ThemeSelect, {
        props: {
            label: "Theme",
            themesUrl: "/t/",
            themes: ["light", "dark"],
            value: "light",
        },
    });
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
