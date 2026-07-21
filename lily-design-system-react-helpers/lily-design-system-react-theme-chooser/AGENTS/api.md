# AGENTS / api — ThemeChooser

API surface contract. The canonical contract is in
[`../spec/index.md §4`](../spec/index.md#4-public-api); this file is a fast index
plus React-specific application notes.

## Required imports

```tsx
import {
    ThemeChooser,
    normalizeThemesUrl,
    themeHref,
    type Props,
    type ChildArgs,
} from "./lily-design-system-react-theme-chooser";
```

The default export is `ThemeChooser` for consumers who prefer
`import ThemeChooser from "./lily-design-system-react-theme-chooser"`.

The default glyph constant `CIRCLE_WITH_RIGHT_HALF_BLACK` is exported
from `ThemeChooser.tsx` but is not re-exported by the barrel; import it
from `./ThemeChooser` directly if needed.

## Required props

| Prop        | Type     | Notes                                                  |
| ----------- | -------- | ------------------------------------------------------ |
| `label`     | `string` | Accessible name (`aria-label`) on the button and the listbox. |
| `themesUrl` | `string` | Base URL of the themes directory. Trailing `/` optional. |
| `themes`    | `string[]` | Available theme slugs.                               |

Omit any required prop and TypeScript errors at the call site.

## Optional props

| Prop           | Type                                     | Default                                          |
| -------------- | ---------------------------------------- | ------------------------------------------------ |
| `value`        | `string`                                 | `undefined` (uncontrolled)                       |
| `defaultValue` | `string`                                 | `"light"` if in themes, else first item          |
| `storageKey`   | `string`                                 | `undefined` (no persistence)                     |
| `name`         | `string`                                 | `"theme"` (managed `<link>` discriminator + hidden input name) |
| `extension`    | `string`                                 | `".css"`                                         |
| `target`       | `HTMLElement \| null`                    | `document.documentElement`                       |
| `themeLabels`  | `Record<string, string>`                 | `{}`                                             |
| `onChange`     | `(slug: string) => void`                 | `undefined`                                      |
| `children`     | `(args: ChildArgs) => React.ReactNode`   | the half-circle glyph inside the button          |
| `className`    | `string`                                 | `""`                                             |
| `...restProps` | `HTMLAttributes<HTMLDivElement>` minus the above | spread onto the root `<div>`             |

## Controlled vs uncontrolled

**Controlled.** Consumer passes `value`. The select treats it as
authoritative; consumer is responsible for updating it from `onChange`.

```tsx
const [theme, setTheme] = useState("");
<ThemeChooser value={theme} onChange={setTheme} {...required} />
```

**Uncontrolled.** Consumer omits `value`. The select manages internal
state. Use `defaultValue` to seed.

```tsx
<ThemeChooser defaultValue="dark" {...required} />
```

The select decides at first render based on whether `value !==
undefined`; switching mid-lifecycle is not supported (React's
controlled/uncontrolled warning fires).

## ChildArgs

`children` replaces the glyph **inside the button**. It does not render
the options — the component owns those, along with their ids, ARIA
state, and the keyboard contract.

```ts
type ChildArgs = {
    value: string;
    open: boolean;
    labelFor: (theme: string) => string;
};
```

- `value` — current resolved value. Empty string before first-mount
  resolution completes.
- `open` — whether the listbox is currently expanded. Useful for
  swapping a caret direction.
- `labelFor(slug)` — resolves to `themeLabels[slug]` if defined,
  otherwise the slug with each hyphen-separated word title-cased.

There is no `setTheme` and no `themes` / `name` pass-through: a glyph
has no reason to mutate the selection. Consumers who need imperative
control use the controlled `value` + `onChange` pair instead.

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

Rendered tree (full contract in
[`../spec/index.md §4.2`](../spec/index.md#42-dom-contract)):

```html
<div class="theme-chooser {className}" ...restProps>
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="theme-chooser-button"
          aria-label="{label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-chooser-list" id="{listId}" role="listbox"
      aria-label="{label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="theme-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Light</li>
  </ul>
</div>
```

After mount and on every theme change:

| Side effect            | Element                                                 |
| ---------------------- | ------------------------------------------------------- |
| Set `data-theme=…`     | `target` (default `document.documentElement`)           |
| Set / create `<link>`  | `document.head` (`link[data-lily-theme-chooser="<name>"]`) |
| Write `localStorage`   | (only if `storageKey` set)                              |
| Call `onChange(slug)`  | (only if `onChange` set)                                |

## Type-level invariants

- `Props` extends `HTMLAttributes<HTMLDivElement>` minus the
  `onChange`, `children`, and `defaultValue` keys, which the component
  reserves.
- `children` is `(args: ChildArgs) => React.ReactNode`, not
  `React.ReactNode`. Passing a raw element is a TypeScript error, by
  design.
- `ChildArgs.labelFor` is re-created on each render; it is a pure
  function of `themeLabels`, so do not rely on referential equality.

## Versioning

The API is at spec version 0.1.0. Any breaking change bumps the
helper's `CHANGELOG.md` and `spec/index.md §9` version.
