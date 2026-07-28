# Examples

Self-contained Svelte 5 examples for
`lily-design-system-svelte-text-size-picker`. Each file is a runnable
component that can be dropped into any Svelte 5 host (SvelteKit page,
Vite + Svelte route, Astro `.svelte` island, Storybook story).

Every example assumes:

- Your stylesheet maps each `[data-text-size="<slug>"]` on `:root` to a
  relative `font-size` (in `%`, `em`, or `rem` — never `px`, so it
  composes with browser zoom and OS text scaling). See
  [`../index.md`](../index.md) for a starter rule set.
- The root and list are positioned (`position: relative` /
  `position: absolute`), or an open listbox shoves the page around. The
  package ships no CSS.
- **You supply the listbox's positioning CSS.** The package ships
  none, so an unstyled listbox renders in normal document flow and
  pushes the page down when it opens. None of these examples include
  it; see
  [`../docs/accessibility.md`](../docs/accessibility.md#common-mistakes-to-avoid).

| #   | File                                                    | Demonstrates                                                              |
| --- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | [`basic.svelte`](./basic.svelte)                         | Minimal four-size picker, plus the `.text-size-picker-status` live region. |
| 2   | [`two-way-binding.svelte`](./two-way-binding.svelte)     | `bind:value` and `onChange`.                                              |
| 3   | [`persistence.svelte`](./persistence.svelte)             | `localStorage` survival across reloads.                                   |
| 4   | [`custom-labels.svelte`](./custom-labels.svelte)         | `sizeLabels` for i18n / display names.                                    |
| 5   | [`custom-rendering.svelte`](./custom-rendering.svelte)   | `children` snippet — glyph + visible label + caret inside the button.     |
| 6   | [`multiple-pickers.svelte`](./multiple-pickers.svelte)   | Two pickers with independent `name` + `target` in one page.               |
| 7   | [`external-buttons.svelte`](./external-buttons.svelte)   | Driving the picker from your own A- / A+ style buttons via `bind:value`.  |
| 8   | [`sveltekit-cookie/`](./sveltekit-cookie/)               | SSR-resolved text size via a cookie, avoiding a post-hydration reflow.     |

## What is deliberately missing

There is no `system-preference.svelte` here, unlike the `theme-picker`
example set. Browsers expose no "preferred text size" signal — there is
no media query equivalent to `prefers-color-scheme` and no
`navigator.languages` analogue — so the component ships no
`detectFromSystem` prop to demonstrate. Users who scale text at the OS
level are already served by browser zoom and the browser's own
minimum-font-size setting, which this helper must not fight. See
[`../docs/accessibility.md`](../docs/accessibility.md#this-controls-scale-vs-the-browsers-and-the-oss).

There is also no `preloaded.svelte` or `lily-themes.svelte` analogue:
unlike `theme-picker`, this component does not fetch or swap external
stylesheets — it only ever writes an attribute — so there is no
network round-trip to eliminate and no large external catalog to
demonstrate.

## The `children` snippet

`children` **replaces the glyph inside the trigger button**. It does
not render the options — the listbox and its `<li role="option">`
children are component-owned.

```ts
type ChildArgs = {
  value: string; // the active slug
  open: boolean; // is the listbox open?
  labelFor: (size: string) => string; // resolved display label
};
```

Write to the bindable `value` to change the size programmatically.

## Running the examples

These files are illustrations, not a build. The fastest way to try one
is:

1. Inside any SvelteKit project, drop the example into
   `src/routes/+page.svelte`.
2. Add the `[data-text-size]` font-size rules from
   [`../index.md`](../index.md) to your global stylesheet.
3. `pnpm dev` and visit the route.
