# API — ThemeSelect (Svelte)

Authoritative API surface lives in [`../spec.md`](../spec.md) §4.
This file documents the Svelte 5-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    default,
    default as ThemeSelect,
    normaliseThemesUrl,
    themeHref,
} from "./ThemeSelect.svelte";
export type { Props, ChildArgs } from "./ThemeSelect.svelte";
```

A consumer can import either the component or the helpers:

```ts
import ThemeSelect, {
    normaliseThemesUrl,
    themeHref,
    type Props,
    type ChildArgs,
} from "lily-design-system-svelte-theme-select";
```

## Props

| Prop           | Type                     | Required | Default                                                |
| -------------- | ------------------------ | -------- | ------------------------------------------------------ |
| `label`        | `string`                 | yes      | —                                                      |
| `themesUrl`    | `string`                 | yes      | —                                                      |
| `themes`       | `string[]`               | yes      | —                                                      |
| `value`        | `string` (bindable)      | no       | `""`                                                   |
| `defaultValue` | `string`                 | no       | `undefined` (resolves to `"light"` or `themes[0]`)     |
| `storageKey`   | `string`                 | no       | `undefined`                                            |
| `name`         | `string`                 | no       | `"theme"`                                              |
| `extension`    | `string`                 | no       | `".css"`                                               |
| `target`       | `HTMLElement \| null`    | no       | `undefined` (resolves to `document.documentElement`)   |
| `themeLabels`  | `Record<string, string>` | no       | `{}`                                                   |
| `children`     | `Snippet<[ChildArgs]>`   | no       | default radio markup                                   |
| `onChange`     | `(theme: string) => void`| no       | `undefined`                                            |
| `class`        | `string`                 | no       | `""`                                                   |

The `value` prop is two-way bindable via `bind:value`. Other
attributes (`id`, `data-*`, event handlers, ARIA overrides) fall
through to the root `<fieldset>` via the `{...restProps}` spread.

## Callbacks

The picker uses a callback prop, not an event dispatcher:

```ts
onChange?: (theme: string) => void;
```

`onChange` fires every time the picker successfully applies a theme:

- after a radio-input change, with the new slug,
- once when `$effect` resolves the initial value, with the resolved
  slug.

Use it for analytics, server sync, or cookie writes.

The picker also writes back to `value` via `$bindable`, so a parent
component using `bind:value={theme}` sees `theme` update on every
change without needing `onChange`.

## Children snippet

The `children` prop is typed as `Snippet<[ChildArgs]>`:

```ts
export type ChildArgs = {
    themes: string[];
    value: string;
    setTheme: (theme: string) => void;
    name: string;
    labelFor: (theme: string) => string;
};
```

Consumers consume it via a `{#snippet}` block:

```svelte
<ThemeSelect
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
>
    {#snippet children({ themes, value, setTheme, name, labelFor })}
        <!-- custom markup -->
        {#each themes as theme}
            <button
                type="button"
                class:active={value === theme}
                onclick={() => setTheme(theme)}
            >
                {labelFor(theme)}
            </button>
        {/each}
    {/snippet}
</ThemeSelect>
```

When no snippet is supplied, the picker renders the default radio
markup documented in `spec.md §4.2`.

## Pure helpers

Two pure helpers are exported from the `<script lang="ts" module>`
block:

```ts
export function normaliseThemesUrl(themesUrl: string): string;
export function themeHref(themesUrl: string, slug: string, extension: string): string;
```

`normaliseThemesUrl(s)` ensures `s` ends with exactly one `/`.
`themeHref(url, slug, ext)` concatenates the three to build the
final stylesheet href.

Both are pure and side-effect-free; consumers can call them from
tests, server code (`hooks.server.ts`), or other components without
instantiating the picker.

## DOM contract

Root element:

```html
<fieldset class="theme-select {class}" role="radiogroup" aria-label="{label}">
    <!-- children snippet output, or default markup -->
</fieldset>
```

Default option markup (one per `themes` entry):

```html
<label class="theme-select-option">
    <input type="radio" name="{name}" value="{slug}" checked={value === slug} />
    <span class="theme-select-option-label">{labelFor(slug)}</span>
</label>
```

Document mutations (only inside `$effect`):

```html
<link rel="stylesheet" data-lily-theme-select="{name}" href="{themesUrl}{slug}{extension}" />
```

And on the resolved target:

```html
<html data-theme="{slug}">
```

## Type re-exports

`Props` and `ChildArgs` are re-exported from `index.ts` so consumers
can type their wrapping code:

```ts
import type { Props, ChildArgs } from "lily-design-system-svelte-theme-select";

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
