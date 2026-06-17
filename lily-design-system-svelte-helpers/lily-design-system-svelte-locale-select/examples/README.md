# Examples

Self-contained Svelte 5 examples for
`lily-design-system-svelte-locale-select`. Each file is a runnable
component that can be dropped into any Svelte 5 host (SvelteKit
route, Vite + Svelte route, Astro `.svelte` island, Storybook
story).

Every example assumes:

- Svelte 5 with runes (`$state`, `$props`, `$bindable`, `$effect`).
- No CSS dependency — the picker is headless. Consumers style the
  `locale-select` and `locale-select-option` class hooks.

| #  | File                                                  | Demonstrates                                                       |
|----|-------------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`01-radios.svelte`](./01-radios.svelte)              | Default native `<select>` rendering.                              |
| 2  | [`02-select.svelte`](./02-select.svelte)              | Custom `<select>` markup via the children snippet.                |
| 3  | [`03-buttons.svelte`](./03-buttons.svelte)            | Toggle-button group with short codes / glyphs and `aria-pressed`.  |
| 4  | [`04-rtl-demo.svelte`](./04-rtl-demo.svelte)          | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| 5  | [`05-nhs-style.svelte`](./05-nhs-style.svelte)        | NHS UK-style language banner with endonyms and a `class` hook.     |
| 6  | [`06-with-svelte-i18n.svelte`](./06-with-svelte-i18n.svelte) | Binding to `svelte-i18n`'s `locale` store.                 |
| 7  | [`07-with-paraglide.svelte`](./07-with-paraglide.svelte) | Driving Paraglide JS's `setLocale()` from `onChange`.           |
| 8  | [`08-ssr-cookie.svelte`](./08-ssr-cookie.svelte)      | SvelteKit `cookies` + `transformPageChunk` for flicker-free SSR.   |
| 9  | [`09-scoped-target.svelte`](./09-scoped-target.svelte) | Multiple per-region pickers, each scoped to its own panel.        |
| 10 | [`10-combobox.svelte`](./10-combobox.svelte)          | Native `<datalist>` type-ahead for all 436 built-in locales.       |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Vite + Svelte 5 project (or SvelteKit), drop the
   example into a route component or a Storybook story.
2. Import the `LocaleSelect.svelte` from this directory (or the
   `index.ts` barrel).
3. `pnpm dev` and visit the route.

## bind:value conventions

The picker exposes its bindable on `value` via `$bindable("")`.
Always use `bind:value={locale}` in templates, and pair with
`onChange` for one-shot side effects (cookie writes, imperative
i18n-library calls, analytics).

## Children snippet args

Every example that uses the children snippet destructures these:

```ts
type ChildArgs = {
    locales: string[];        // The locale codes to render.
    value: string;            // Currently selected code (consumer form).
    setLocale: (code: string) => void; // Apply imperatively.
    name: string;             // `name` attribute of the `<select>`.
    labelFor: (code: string) => string; // Display label.
    tagFor: (code: string) => string;   // BCP 47 hyphen form.
    isRtl: (code: string) => boolean;   // RTL detection.
};
```

The picker still owns the apply lifecycle (lang/dir/storage/onChange)
regardless of what markup the snippet emits.

## See also

- [`../docs/concepts.md`](../docs/concepts.md) — mental model and
  lifecycle diagram.
- [`../docs/ssr.md`](../docs/ssr.md) — full SSR / SvelteKit recipe.
- [`../docs/rtl.md`](../docs/rtl.md) — what `dir="rtl"` actually
  changes and CSS tips.
- [`../docs/i18n-integration.md`](../docs/i18n-integration.md) —
  wiring `svelte-i18n`, Paraglide JS, Inlang, raw `Intl.*`.
- [`../spec.md`](../spec.md) — the canonical contract.
