# API — LocaleSelect (Svelte)

Authoritative API surface lives in [`../spec/index.md`](../spec/index.md) §4.
This file documents the Svelte 5-flavoured shape of the contract.

## Exports

The barrel (`index.ts`) re-exports:

```ts
export {
    default,
    default as LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./LocaleSelect.svelte";
export type { Props, ChildArgs } from "./LocaleSelect.svelte";
```

A consumer can import either the component or the pure helpers:

```ts
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    type Props,
    type ChildArgs,
} from "lily-design-system-svelte-locale-select";
```

## Props

| Prop                  | Type                     | Required | Default                                              |
| --------------------- | ------------------------ | -------- | ---------------------------------------------------- |
| `label`               | `string`                 | yes      | —                                                    |
| `locales`             | `string[]`               | yes      | —                                                    |
| `value`               | `string` (bindable)      | no       | `""`                                                 |
| `defaultValue`        | `string`                 | no       | `undefined` (resolves to `"en"` or `locales[0]`)     |
| `storageKey`          | `string`                 | no       | `undefined`                                          |
| `detectFromNavigator` | `boolean`                | no       | `false`                                              |
| `name`                | `string`                 | no       | `"locale"`                                           |
| `target`              | `HTMLElement \| null`    | no       | `undefined` (resolves to `document.documentElement`) |
| `applyDir`            | `boolean`                | no       | `true`                                               |
| `localeLabels`        | `Record<string, string>` | no       | `{}`                                                 |
| `children`            | `Snippet<[ChildArgs]>`   | no       | default `<option>` markup                            |
| `onChange`            | `(locale: string) => void` | no     | `undefined`                                          |
| `class`               | `string`                 | no       | `""`                                                 |

`value` is two-way bindable via `bind:value`. Other attributes
(`id`, `data-*`, event handlers, ARIA overrides) fall through to
the root `<select>` via the `{...restProps}` spread.

## Callbacks

The select uses a callback prop, not an event dispatcher:

```ts
onChange?: (locale: string) => void;
```

`onChange` fires every time the select successfully applies a
locale:

- after a `<select>` change, with the new code,
- once when `$effect` resolves the initial value, with the resolved
  code.

Use it for analytics, server cookie writes, or for telling your
i18n library to load message bundles.

The argument is the **consumer-form** code (the literal string from
the `locales` array — `en_US` if you put `en_US` in the array). The
DOM `lang` attribute is BCP 47-normalised (`en-US`), but the
callback payload and the bindable `value` preserve the consumer
form so round-trips are lossless.

## Children snippet

The `children` prop is typed as `Snippet<[ChildArgs]>`:

```ts
export type ChildArgs = {
    /** The locale codes to render as options. */
    locales: string[];
    /** Currently selected locale code (consumer form, not BCP 47-normalised). */
    value: string;
    /** Apply a locale imperatively (also writes back to `value`). */
    setLocale: (locale: string) => void;
    /** `name` attribute of the `<select>`. */
    name: string;
    /** Resolve a locale code to its display label. */
    labelFor: (locale: string) => string;
    /** BCP 47 hyphen form of a locale code (`en_US` → `en-US`). */
    tagFor: (locale: string) => string;
    /** Is the locale right-to-left? */
    isRtl: (locale: string) => boolean;
};
```

Consumers consume it via a `{#snippet}` block:

```svelte
<LocaleSelect label="Language" locales={["en", "fr", "ar"]}>
    {#snippet children({ locales, value, setLocale, name, labelFor, tagFor, isRtl })}
        <select onchange={(e) => setLocale(e.currentTarget.value)}>
            {#each locales as locale}
                <option
                    value={locale}
                    selected={value === locale}
                    lang={tagFor(locale)}
                >
                    {labelFor(locale)}
                </option>
            {/each}
        </select>
    {/snippet}
</LocaleSelect>
```

When no snippet is supplied, the select renders the default
`<option>` markup documented in `spec/index.md §4.3`.

## Pure helpers

Five pure helpers are exported from the `<script lang="ts" module>`
block:

```ts
export function bcp47LocaleTag(locale: string): string;
export function isRtlLocale(locale: string): boolean;
export function localeName(locale: string): string;
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "";
// + the constants:
export const defaultLocaleLabels: Record<string, string>;
export const RTL_LANGUAGE_TAGS: ReadonlySet<string>;
export const RTL_SCRIPT_SUBTAGS: ReadonlySet<string>;
```

| Helper                  | Purpose                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| `bcp47LocaleTag`        | `"en_US"` → `"en-US"`. RFC 5646 hyphen normalisation.                |
| `isRtlLocale`           | Detect RTL by language subtag or script subtag (case-insensitive).   |
| `localeName`            | Look up the English name from the built-in 436-row table.            |
| `matchNavigatorLanguage`| Two-step exact-then-prefix match against a supported-locales list.   |
| `defaultLocaleLabels`   | The 436-row built-in label table itself.                             |
| `RTL_LANGUAGE_TAGS`     | Set of language subtags treated as RTL (`ar`, `he`, `fa`, etc.).     |
| `RTL_SCRIPT_SUBTAGS`    | Set of script subtags treated as RTL (`arab`, `hebr`, `nkoo`, etc.). |

All pure functions are side-effect-free; consumers can call them
from tests, server code (`hooks.server.ts`), or other components
without instantiating the select.

## DOM contract

Root element:

```html
<select class="locale-select {class}" aria-label="{label}" name="{name}">
    <!-- children snippet output, or default markup -->
</select>
```

Default option markup (one per `locales` entry):

```html
<option class="locale-select-option" value="{locale}" lang="{tagFor(locale)}">
    {labelFor(locale)}
</option>
```

Document mutations (only inside `$effect`):

```html
<html lang="{tagFor(locale)}" dir="rtl|ltr">
```

`dir` is only written when `applyDir` is `true` (the default).

## Type re-exports

`Props` and `ChildArgs` are re-exported from `index.ts` so consumers
can type their wrapping code:

```ts
import type { Props, ChildArgs } from "lily-design-system-svelte-locale-select";

const config: Pick<Props, "locales" | "storageKey" | "detectFromNavigator"> = {
    locales: ["en", "fr", "ar"],
    storageKey: "my-app:locale",
    detectFromNavigator: true,
};
```

## Versioning

The API surface above is the v0.1.0 contract. Any breaking change
(rename, removal, type narrowing of an existing prop) bumps the
minor version while v0.x; once v1.0 ships, breaking changes bump
the major.
