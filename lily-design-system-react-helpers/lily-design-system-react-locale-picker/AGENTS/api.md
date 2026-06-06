# AGENTS / api — LocalePicker

API surface contract. The canonical contract is in
[`../spec.md §4`](../spec.md#4-public-api); this file is a fast index
plus React-specific application notes.

## Required imports

```tsx
import {
    LocalePicker,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
    type Props,
    type ChildArgs,
} from "./lily-design-system-react-locale-picker";
```

The default export is `LocalePicker` for consumers who prefer
`import LocalePicker from "./lily-design-system-react-locale-picker"`.

## Required props

| Prop      | Type       | Notes                                                  |
| --------- | ---------- | ------------------------------------------------------ |
| `label`   | `string`   | Accessible name on `<fieldset role="radiogroup">`.     |
| `locales` | `string[]` | Available locale codes (`en`, `fr_CA`, `zh_Hant`).     |

## Optional props

| Prop                  | Type                                     | Default                       |
| --------------------- | ---------------------------------------- | ----------------------------- |
| `value`               | `string`                                 | `undefined` (uncontrolled)    |
| `defaultValue`        | `string`                                 | `"en"` if in locales, else first item |
| `storageKey`          | `string`                                 | `undefined`                   |
| `detectFromNavigator` | `boolean`                                | `false`                       |
| `name`                | `string`                                 | `"locale"`                    |
| `target`              | `HTMLElement \| null`                    | `document.documentElement`    |
| `applyDir`            | `boolean`                                | `true`                        |
| `localeLabels`        | `Record<string, string>`                 | `{}`                          |
| `onChange`            | `(code: string) => void`                 | `undefined`                   |
| `children`            | `(args: ChildArgs) => React.ReactNode`   | default radio markup          |
| `className`           | `string`                                 | `""`                          |
| `...restProps`        | `FieldsetHTMLAttributes` minus the above | spread onto root              |

## Controlled vs uncontrolled

**Controlled.** Consumer passes `value`. The picker treats it as
authoritative; consumer is responsible for updating it from `onChange`.

```tsx
const [locale, setLocale] = useState("");
<LocalePicker value={locale} onChange={setLocale} {...required} />
```

**Uncontrolled.** Consumer omits `value`. The picker manages internal
state. Use `defaultValue` or `detectFromNavigator` to seed.

```tsx
<LocalePicker defaultValue="fr" {...required} />
```

The picker decides at first render based on `value !== undefined`.

## ChildArgs

```ts
type ChildArgs = {
    locales: string[];
    value: string;
    setLocale: (locale: string) => void;
    name: string;
    labelFor: (locale: string) => string;
    tagFor: (locale: string) => string;
    isRtl: (locale: string) => boolean;
};
```

- `locales` — pass-through.
- `value` — current resolved value, in consumer form (preserves `_` /
  `-` exactly as supplied).
- `setLocale` — imperative setter.
- `name` — pass-through (default `"locale"`).
- `labelFor(code)` — resolves to `localeLabels[code]` →
  `defaultLocaleLabels[code]` → `Intl.DisplayNames` → raw code.
- `tagFor(code)` — BCP 47 hyphen form of the code.
- `isRtl(code)` — `true` for RTL locales (see `isRtlLocale` rules).

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
defaultLocaleLabels  // Record<string, string> — 436 codes → English names
RTL_LANGUAGE_TAGS    // Set<string> — language subtags that imply RTL
RTL_SCRIPT_SUBTAGS   // Set<string> — script subtags that imply RTL
```

`locales.ts` is the canonical source; it has no React dependency and
is safe to import from a server component.

## DOM contract

After mount and on every locale change:

| Side effect              | Element                                                 |
| ------------------------ | ------------------------------------------------------- |
| Set `lang="…"`           | `target` (default `document.documentElement`)           |
| Set `dir="rtl"\|"ltr"`   | same (skipped when `applyDir` is `false`)               |
| Write `localStorage`     | (only if `storageKey` set)                              |
| Call `onChange(code)`    | (only if `onChange` set; argument is consumer form, not BCP 47) |

## Type-level invariants

- `Props` extends `FieldsetHTMLAttributes<HTMLFieldSetElement>` minus
  the `onChange` and `children` keys.
- `ChildArgs.locales` is the same array reference passed in via
  `locales`.
- `tagFor` and `isRtl` in `ChildArgs` are stable references across
  renders (they wrap pure helpers).

## Versioning

The API is at spec version 0.1.0. Any breaking change bumps the
helper's `CHANGELOG.md` and `spec.md §9` version.
