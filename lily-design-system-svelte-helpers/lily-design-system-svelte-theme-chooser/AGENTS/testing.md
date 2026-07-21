# Testing — ThemeChooser (Svelte)

The select's test suite lives in
[`../ThemeChooser.test.ts`](../ThemeChooser.test.ts) and asserts every
numbered acceptance criterion in `spec/index.md` §7. This file documents
the test harness and the conventions specific to this helper. For
the catalog-wide test rules see
[`../../AGENTS/testing.md`](../../AGENTS/testing.md).

## Setup

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import ThemeChooser, { themeHref, normaliseThemesUrl } from "./ThemeChooser.svelte";

beforeEach(() => {
    // Reset shared state between tests.
    document.head.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
});
```

Each test re-runs the whole `$effect` lifecycle by calling
`render(ThemeChooser, { props })` followed by `await tick()`.

## Async waits

The select's `$effect` fires on the next microtask after mount. Use
`await tick()` to let it run:

```ts
const { container } = render(ThemeChooser, { props: { /* … */ } });
await tick();
// initial-value resolution may have re-run $effect; a second tick
// guarantees the apply step has fired.
await tick();
```

`tick()` resolves after Svelte's scheduler flushes pending effects.
Two `await tick()` calls cover the resolution-then-apply two-step.

## Pure-helper tests

`normaliseThemesUrl`, `themeHref`, `themeName`, and `matchSystemTheme`
are pure — no `render` needed:

```ts
it("normaliseThemesUrl appends a slash", () => {
    expect(normaliseThemesUrl("/x")).toBe("/x/");
    expect(normaliseThemesUrl("/x/")).toBe("/x/");
});

it("themeHref builds the full URL", () => {
    expect(themeHref("/x/", "dark", ".css")).toBe("/x/dark.css");
});

it("themeName title-cases each hyphen-separated word", () => {
    expect(themeName("high-contrast")).toBe("High Contrast");
});
```

`matchSystemTheme` needs a `matchMedia` stub — see
[Stubbing matchMedia](#stubbing-matchmedia).

## Picking a theme

There is no `<select>` to set a `value` on. Open the listbox, then
click the option:

```ts
import { fireEvent, screen } from "@testing-library/svelte";

async function pick(slug: string, themes: string[]): Promise<void> {
    await fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".theme-chooser-option");
    await fireEvent.click(opts[themes.indexOf(slug)]);
}
```

The suite defines exactly this helper at the top of the file; reuse it
rather than reimplementing the two-step.

## Driving the keyboard contract

Open with a key on the button, then send keys to the **list**, not to
the button — focus moves to the `<ul>` on open:

```ts
async function openWith(key: string) {
    render(ThemeChooser, { props: { label: "Theme", themesUrl: "/t/", themes: THEMES } });
    await flush();
    const button = screen.getByRole("button");
    await fireEvent.keyDown(button, { key });
    await flush();
    return { button, list: document.querySelector(".theme-chooser-list") as HTMLElement };
}
```

Assert movement through `aria-activedescendant` against the option ids,
not through focus — the component uses the APG's
`aria-activedescendant` model and never moves DOM focus onto an `<li>`:

```ts
const { list } = await openWith("ArrowDown");
await fireEvent.keyDown(list, { key: "ArrowDown" });
expect(list.getAttribute("aria-activedescendant")).toBe(list.children[1].id);
```

Open / closed state is `list.hasAttribute("hidden")` plus
`button.getAttribute("aria-expanded")`.

## Stubbing matchMedia

jsdom does not implement `window.matchMedia`, so `detectFromSystem`
and `matchSystemTheme` tests must install a stub and restore it:

```ts
function stubColorScheme(prefersDark: boolean): () => void {
    const original = (window as any).matchMedia;
    (window as any).matchMedia = (q: string) => ({
        matches: prefersDark && q.includes("dark"),
        media: q,
    });
    return () => { (window as any).matchMedia = original; };
}
```

Its *absence* is itself part of the contract — `matchSystemTheme`
returns `""` when `matchMedia` is missing, and §7.19 covers that by
deleting the property rather than stubbing it.

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

## Driving a `bind:value` test

`bind:value` is sugar; in a test we either inspect the side effect
(`data-theme`, the managed `<link>`, the `localStorage` write) or
spy on `onChange`:

```ts
const onChange = vi.fn();
const { container } = render(ThemeChooser, {
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

To observe the bind-back side, mount the select inside a tiny
wrapper `.svelte` fixture that does `bind:value` and asserts the
new value on its own `$state`. Most tests don't need this — the
`onChange` spy is enough.

## Snippet tests

Use `createRawSnippet` to construct a snippet on the fly:

```ts
import { createRawSnippet } from "svelte";

it("§7.13 children snippet replaces the glyph and receives ChildArgs", async () => {
    let captured: any = null;
    const children = createRawSnippet((args) => {
        captured = args();
        return { render: () => "<span data-testid='custom'></span>" };
    });
    render(ThemeChooser, {
        props: {
            label: "Theme",
            themesUrl: "/t/",
            themes: ["light", "dark"],
            value: "dark",
            children,
        },
    });
    await tick();
    // The snippet replaces the glyph *inside the button*.
    expect(screen.getByTestId("custom").closest("button")?.className)
        .toContain("theme-chooser-button");
    expect(document.querySelector(".theme-chooser-icon")).toBeNull();
    expect(captured.value).toBe("dark");
    expect(captured.open).toBe(false);
    expect(typeof captured.labelFor).toBe("function");
});
```

`ChildArgs` is `{ value, open, labelFor }`. There is no `themes`,
`setTheme`, or `name` — the snippet no longer renders options.

Pass an explicit `value` in snippet tests: a raw snippet reads its args
once at first render, before the effect resolves an initial theme.

If `createRawSnippet` is unavailable in the test runtime, write a
small wrapper `.svelte` fixture under `tests/fixtures/` that imports
`ThemeChooser` and supplies the snippet inline, then `render` the
fixture instead.

## SSR sanity test

```ts
import { render as ssrRender } from "svelte/server";

it("renders cleanly under SSR", () => {
    const { html } = ssrRender(ThemeChooser, {
        props: {
            label: "Theme",
            themesUrl: "/t/",
            themes: ["light", "dark"],
            value: "light",
        },
    });
    expect(html).toContain('class="theme-chooser"');
    expect(html).toContain('aria-label="Theme"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('value="light"');   // the hidden input
});
```

This guarantees no `document.*` access leaked into the render path.

## What every §7 test asserts

See the per-clause map in
[`../spec/index.md` §7](../spec/index.md#7-testing-acceptance-criteria). Each
`it(...)` description starts with the clause number, e.g.
`it("§7.6 resolves the initial theme to 'light' …", …)`. Keep the
naming convention so a reviewer can spot a missing clause.
