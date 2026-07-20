# AGENTS / api — LocaleSelect

API surface contract. The canonical contract is in
[`../spec/index.md §4`](../spec/index.md#4-public-api); this file is a fast index
plus React-specific application notes.

## Required imports

```tsx
import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
    GLOBE_WITH_MERIDIANS,
    type Props,
    type ChildArgs,
} from "./lily-design-system-react-locale-select";
```

The default export is `LocaleSelect` for consumers who prefer
`import LocaleSelect from "./lily-design-system-react-locale-select"`.

## Required props

| Prop      | Type       | Notes                                                  |
| --------- | ---------- | ------------------------------------------------------ |
| `label`   | `string`   | Accessible name (`aria-label`) on the button and the listbox. The glyph is `aria-hidden`, so this is the button's only name. |
| `locales` | `string[]` | Available locale codes (`en`, `fr_CA`, `zh_Hant`).     |

## Optional props

| Prop                  | Type                                     | Default                       |
| --------------------- | ---------------------------------------- | ----------------------------- |
| `value`               | `string`                                 | `undefined` (uncontrolled)    |
| `defaultValue`        | `string`                                 | `"en"` if in locales, else first item |
| `storageKey`          | `string`                                 | `undefined`                   |
| `detectFromNavigator` | `boolean`                                | `false`                       |
| `name`                | `string`                                 | `"locale"` (on the hidden input) |
| `target`              | `HTMLElement \| null`                    | `document.documentElement`    |
| `applyDir`            | `boolean`                                | `true`                        |
| `localeLabels`        | `Record<string, string>`                 | `{}`                          |
| `onChange`            | `(code: string) => void`                 | `undefined`                   |
| `children`            | `(args: ChildArgs) => React.ReactNode`   | default globe glyph span      |
| `className`           | `string`                                 | `""`                          |
| `...restProps`        | `HTMLAttributes<HTMLDivElement>` minus the above | spread onto the root `<div>` |

## Controlled vs uncontrolled

**Controlled.** Consumer passes `value`. The select treats it as
authoritative; consumer is responsible for updating it from `onChange`.

```tsx
const [locale, setLocale] = useState("");
<LocaleSelect value={locale} onChange={setLocale} {...required} />
```

**Uncontrolled.** Consumer omits `value`. The select manages internal
state. Use `defaultValue` or `detectFromNavigator` to seed.

```tsx
<LocaleSelect defaultValue="fr" {...required} />
```

The select decides at first render based on `value !== undefined`.

## ChildArgs

`children` is a render prop for the **button glyph only**. It replaces
the default `<span class="locale-select-icon">🌐</span>` inside
`<button class="locale-select-button">`. It does not render options —
the component owns the listbox, its options, and the keyboard contract.

```ts
type ChildArgs = {
    value: string;
    open: boolean;
    labelFor: (locale: string) => string;
};
```

- `value` — current resolved value, in consumer form (preserves `_` /
  `-` exactly as supplied).
- `open` — `true` while the listbox is expanded. Useful for a
  disclosure chevron.
- `labelFor(code)` — resolves to `localeLabels[code]` →
  `defaultLocaleLabels[code]` → `Intl.DisplayNames` → raw code.

Mark custom glyph content `aria-hidden="true"`: the button is already
named by `aria-label={label}`, so unhidden content is announced twice.

```tsx
<LocaleSelect label="Language" locales={LOCALES} value={locale} onChange={setLocale}>
    {({ value, open, labelFor }) => (
        <span aria-hidden="true" title={labelFor(value)}>
            {value.split("_")[0].toUpperCase()} {open ? "▴" : "▾"}
        </span>
    )}
</LocaleSelect>
```

## Pure helpers

Exported for consumer use without instantiating the component:

```ts
bcp47LocaleTag("en_US")       // "en-US"
bcp47LocaleTag("zh_Hant_TW")  // "zh-Hant-TW"
isRtlLocale("ar")             // true
isRtlLocale("he_IL")          // true
isRtlLocale("uz_Arab_AF")     // true (script subtag)
isRtlLocale("en")             // false
localeName("en_US")           // "English (United States)" (from locales.tsv)
matchNavigatorLanguage(["fr-CA", "en"], ["en", "fr"]) // "fr"
```

All pure, server-safe, no React dependency.

## Static data exports

```ts
defaultLocaleLabels   // Record<string, string> — 436 codes → English names
RTL_LANGUAGE_TAGS     // Set<string> — language subtags that imply RTL
RTL_SCRIPT_SUBTAGS    // Set<string> — script subtags that imply RTL
GLOBE_WITH_MERIDIANS  // "\u{1F310}\uFE0E" — the default button glyph
                      // (VS15 forces monochrome text presentation)
```

`locales.ts` is the canonical source; it has no React dependency and
is safe to import from a server component.

## DOM contract

Rendered markup — root `<div>`, hidden input, icon button, listbox:

```html
<div class="locale-select {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="locale-select-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="locale-select-icon" aria-hidden="true">🌐</span>
  </button>
  <ul class="locale-select-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="locale-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active lang="en-US">English (United States)</li>
  </ul>
</div>
```

Ids come from `useId`, so they are stable across server and client
render. Full contract in
[`../spec/index.md §4.3`](../spec/index.md#43-dom-contract).

Side effects, after mount and on every locale change:

| Side effect              | Element                                                 |
| ------------------------ | ------------------------------------------------------- |
| Set `lang="…"`           | `target` (default `document.documentElement`)           |
| Set `dir="rtl"\|"ltr"`   | same (skipped when `applyDir` is `false`)               |
| Write `localStorage`     | (only if `storageKey` set)                              |
| Call `onChange(code)`    | (only if `onChange` set; argument is consumer form, not BCP 47) |

## Type-level invariants

- `Props` extends `HTMLAttributes<HTMLDivElement>` minus the
  `onChange`, `children`, and `defaultValue` keys (each is redefined
  with locale-specific semantics).
- `ChildArgs.value` is the resolved value in consumer form, never the
  BCP 47-normalised tag.
- `children` returns `React.ReactNode` rendered inside the button; it
  cannot change the root, the button, or the listbox.

## Versioning

The API is at spec version 0.1.0. Any breaking change bumps the
helper's `CHANGELOG.md` and `spec/index.md §9` version.
