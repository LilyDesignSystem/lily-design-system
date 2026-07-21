# API — ThemeChooser (Svelte)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Svelte 5-flavoured shape of the contract.

## Exports

`ThemeChooser.svelte`'s module script exports the component plus the
pure helpers `normaliseThemesUrl`, `themeHref`, `themeName`,
`matchSystemTheme`, `nextThemeChooserId`, and the glyph constant
`CIRCLE_WITH_RIGHT_HALF_BLACK`.

The barrel (`index.ts`) currently re-exports a **subset**:

```ts
export {
    default,
    default as ThemeChooser,
    normaliseThemesUrl,
    themeHref,
} from "./ThemeChooser.svelte";
export type { Props, ChildArgs } from "./ThemeChooser.svelte";
```

`themeName`, `matchSystemTheme`, and
`CIRCLE_WITH_RIGHT_HALF_BLACK` must be imported from
`./ThemeChooser.svelte` directly. Widening the barrel to match
`locale-chooser`'s — which re-exports all of its pure helpers — is a
pending follow-up.

```ts
import ThemeChooser, {
    normaliseThemesUrl,
    themeHref,
    themeName,
    matchSystemTheme,
    type Props,
    type ChildArgs,
} from "./ThemeChooser.svelte";
```

## Props

| Prop              | Type                     | Required | Default                                                |
| ----------------- | ------------------------ | -------- | ------------------------------------------------------ |
| `label`           | `string`                 | yes      | —                                                      |
| `themesUrl`       | `string`                 | yes      | —                                                      |
| `themes`          | `string[]`               | yes      | —                                                      |
| `value`           | `string` (bindable)      | no       | `""`                                                   |
| `defaultValue`    | `string`                 | no       | `undefined` (resolves to `"light"` or `themes[0]`)     |
| `storageKey`      | `string`                 | no       | `undefined`                                            |
| `detectFromSystem`| `boolean`                | no       | `false`                                                |
| `name`            | `string`                 | no       | `"theme"`                                              |
| `extension`       | `string`                 | no       | `".css"`                                               |
| `target`          | `HTMLElement \| null`    | no       | `undefined` (resolves to `document.documentElement`)   |
| `themeLabels`     | `Record<string, string>` | no       | `{}`                                                   |
| `children`        | `Snippet<[ChildArgs]>`   | no       | the `◑` glyph                                          |
| `onChange`        | `(theme: string) => void`| no       | `undefined`                                            |
| `class`           | `string`                 | no       | `""`                                                   |

**There is no `placeholder` prop.** It was removed with the native
`<select>`; do not reintroduce it.

The `value` prop is two-way bindable via `bind:value`. Other
attributes (`id`, `data-*`, event handlers) fall through to the root
`<div>` via the `{...restProps}` spread — note they land on the root,
**not** on the button.

## Callbacks

The select uses a callback prop, not an event dispatcher:

```ts
onChange?: (theme: string) => void;
```

`onChange` fires every time the select successfully applies a theme:

- after a listbox selection (click, or `Enter` / `Space` on the active
  option), with the new slug,
- once when `$effect` resolves the initial value, with the resolved
  slug.

Use it for analytics, server sync, or cookie writes.

The select also writes back to `value` via `$bindable`, so a parent
component using `bind:value={theme}` sees `theme` update on every
change without needing `onChange`.

## Children snippet

The `children` prop is typed as `Snippet<[ChildArgs]>` and **replaces
the glyph inside the trigger button**. It does not render options —
the listbox and its `<li role="option">` children are component-owned.

```ts
export type ChildArgs = {
    /** Currently selected theme slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};
```

Consumers consume it via a `{#snippet}` block:

```svelte
<ThemeChooser
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
>
    {#snippet children({ value, open, labelFor })}
        <span aria-hidden="true">&#9681;</span>
        <span class="theme-chooser-text">{labelFor(value)}</span>
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
    {/snippet}
</ThemeChooser>
```

When no snippet is supplied, the button renders
`<span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>`. When one
is supplied, that span is not emitted.

The snippet's output lives inside a `<button>`, so it must not contain
interactive elements.

## Pure helpers

Exported from the `<script lang="ts" module>` block:

```ts
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(themesUrl: string, slug: string, extension: string): string;
export function themeName(theme: string): string;
export function matchSystemTheme(themes: readonly string[]): string;
export function nextThemeChooserId(): string;
export const CIRCLE_WITH_RIGHT_HALF_BLACK: string;  // "◑", U+25D1
```

- `normaliseThemesUrl(s)` ensures `s` ends with exactly one `/`.
- `themeHref(url, slug, ext)` concatenates the three to build the final
  stylesheet href.
- `themeName(slug)` title-cases each hyphen-separated word
  (`"high-contrast"` → `"High Contrast"`). The internal `labelFor`
  delegates to it, so there is exactly one implementation. Mirrors
  `localeName` in `locale-chooser`.
- `matchSystemTheme(themes)` reads
  `matchMedia("(prefers-color-scheme: dark)")`, maps to `"dark"` /
  `"light"`, and returns `""` when that slug is absent from `themes`
  **or** when `matchMedia` is unavailable (SSR, jsdom). Mirrors
  `matchNavigatorLanguage` in `locale-chooser`.
- `nextThemeChooserId()` increments a module counter to produce stable,
  unique, SSR-safe id prefixes. Never replace with `Math.random()` or
  `Date.now()`.

All except `nextThemeChooserId` (which mutates the counter) are pure
and side-effect-free; consumers can call them from tests, server code
(`hooks.server.ts`), or other components without instantiating the
select.

## DOM contract

```html
<div class="theme-chooser {class}" ...restProps>
    <input type="hidden" name="{name}" value="{value}" />
    <button type="button" class="theme-chooser-button" aria-label="{label}"
            aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
        <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
        <!-- or the children snippet output -->
    </button>
    <ul class="theme-chooser-list" id="{listId}" role="listbox" aria-label="{label}"
        tabindex="-1" hidden aria-activedescendant="{active optionId while open}">
        <li class="theme-chooser-option" id="{optionId}" role="option"
            aria-selected="true|false" data-active>{labelFor(slug)}</li>
    </ul>
</div>
```

Document mutations (only inside `$effect`):

```html
<link rel="stylesheet" data-lily-theme-chooser="{name}" href="{themesUrl}{slug}{extension}" />
```

And on the resolved target:

```html
<html data-theme="{slug}">
```

## Type re-exports

`Props` and `ChildArgs` are re-exported from `index.ts` so consumers
can type their wrapping code:

```ts
import type { Props, ChildArgs } from "lily-design-system-svelte-theme-chooser";

const config: Pick<Props, "themesUrl" | "themes" | "storageKey"> = {
    themesUrl: "/assets/themes/",
    themes: ["light", "dark"],
    storageKey: "my-app:theme",
};
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing prop) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
