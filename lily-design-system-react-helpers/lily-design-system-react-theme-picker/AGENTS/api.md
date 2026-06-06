# AGENTS / api — ThemePicker

API surface contract. The canonical contract is in
[`../spec.md §4`](../spec.md#4-public-api); this file is a fast index
plus React-specific application notes.

## Required imports

```tsx
import {
    ThemePicker,
    normalizeThemesUrl,
    themeHref,
    type Props,
    type ChildArgs,
} from "./lily-design-system-react-theme-picker";
```

The default export is `ThemePicker` for consumers who prefer
`import ThemePicker from "./lily-design-system-react-theme-picker"`.

## Required props

| Prop        | Type     | Notes                                                  |
| ----------- | -------- | ------------------------------------------------------ |
| `label`     | `string` | Accessible name on `<fieldset role="radiogroup">`.     |
| `themesUrl` | `string` | Base URL of the themes directory. Trailing `/` optional. |
| `themes`    | `string[]` | Available theme slugs.                               |

Omit any required prop and TypeScript errors at the call site.

## Optional props

| Prop           | Type                                     | Default                                          |
| -------------- | ---------------------------------------- | ------------------------------------------------ |
| `value`        | `string`                                 | `undefined` (uncontrolled)                       |
| `defaultValue` | `string`                                 | `"light"` if in themes, else first item          |
| `storageKey`   | `string`                                 | `undefined` (no persistence)                     |
| `name`         | `string`                                 | `"theme"`                                        |
| `extension`    | `string`                                 | `".css"`                                         |
| `target`       | `HTMLElement \| null`                    | `document.documentElement`                       |
| `themeLabels`  | `Record<string, string>`                 | `{}`                                             |
| `onChange`     | `(slug: string) => void`                 | `undefined`                                      |
| `children`     | `(args: ChildArgs) => React.ReactNode`   | default radio markup                             |
| `className`    | `string`                                 | `""`                                             |
| `...restProps` | `FieldsetHTMLAttributes` minus the above | spread onto root                                 |

## Controlled vs uncontrolled

**Controlled.** Consumer passes `value`. The picker treats it as
authoritative; consumer is responsible for updating it from `onChange`.

```tsx
const [theme, setTheme] = useState("");
<ThemePicker value={theme} onChange={setTheme} {...required} />
```

**Uncontrolled.** Consumer omits `value`. The picker manages internal
state. Use `defaultValue` to seed.

```tsx
<ThemePicker defaultValue="dark" {...required} />
```

The picker decides at first render based on whether `value !==
undefined`; switching mid-lifecycle is not supported (React's
controlled/uncontrolled warning fires).

## ChildArgs

```ts
type ChildArgs = {
    themes: string[];
    value: string;
    setTheme: (theme: string) => void;
    name: string;
    labelFor: (theme: string) => string;
};
```

- `themes` — pass-through of the `themes` prop.
- `value` — current resolved value. Empty string before first-mount
  resolution completes.
- `setTheme` — imperative setter. Updates internal state (uncontrolled)
  and applies to the DOM. Consumer's `onChange` fires.
- `name` — pass-through of the `name` prop (default `"theme"`).
- `labelFor(slug)` — resolves to `themeLabels[slug]` if defined,
  otherwise slug with first character upper-cased.

## Pure helpers

Exported for consumer use without instantiating the component:

```ts
normalizeThemesUrl("/t/")   // "/t/"
normalizeThemesUrl("/t")    // "/t/"
themeHref("/t/", "dark", ".css") // "/t/dark.css"
themeHref("/t",  "dark", ".css") // "/t/dark.css"
```

These functions are pure, server-safe, and have no React dependency.

## DOM contract

After mount and on every theme change:

| Side effect            | Element                                                 |
| ---------------------- | ------------------------------------------------------- |
| Set `data-theme=…`     | `target` (default `document.documentElement`)           |
| Set / create `<link>`  | `document.head` (`link[data-lily-theme-picker="<name>"]`) |
| Write `localStorage`   | (only if `storageKey` set)                              |
| Call `onChange(slug)`  | (only if `onChange` set)                                |

## Type-level invariants

- `Props` extends `FieldsetHTMLAttributes<HTMLFieldSetElement>` minus
  the `onChange` and `children` keys, which the picker reserves.
- `ChildArgs.themes` is the same array reference passed in via
  `themes`; not a copy.
- `ChildArgs.setTheme` is stable across renders (no useCallback
  wrapper provided; React treats it as a function identity).

## Versioning

The API is at spec version 0.1.0. Any breaking change bumps the
helper's `CHANGELOG.md` and `spec.md §9` version.
