# ThemePicker (Solid helper)

A headless Solid 2.0 theme picker that **loads themes at runtime** from a directory you serve: an icon button that
opens a WAI-ARIA listbox, swaps a managed theme stylesheet and sets `data-theme`.

The contract is [spec/index.md](./spec/index.md), ported from the
[Svelte reference](../lily-design-system-svelte-theme-picker/spec/index.md). Working code: [examples/](./examples/).

## Install

```bash
pnpm add @lilydesignsystem/solid-theme-picker
```

`solid-js` and `@solidjs/web` 2.0 are peer dependencies. A Solid app resolves the package's `solid` export condition and compiles the source itself; other bundlers get `dist/index.js`.

## Quick start

1. Serve theme CSS files from a directory, for example `public/assets/themes/light.css` and `dark.css`. Each scopes its
   tokens to `:root[data-theme="<slug>"]`, as every Lily theme does.
2. Render the picker with the directory and the slugs.

```tsx
import { createSignal } from "solid-js";
import { ThemePicker, themeName } from "@lilydesignsystem/solid-theme-picker";

export function Header() {
  const [theme, setTheme] = createSignal("");
  return (
    <>
      <ThemePicker
        label="Theme"
        themesUrl="/assets/themes/"
        themes={["light", "dark", "abyss"]}
        value={theme() || undefined}
        onChange={setTheme}
      />
      <p
        class="theme-picker-status"
        aria-live="polite"
      >
        Active theme: {themeName(theme())}
      </p>
    </>
  );
}
```

The status line is part of the pattern: the closed control shows only an icon and never states the active theme, so
without it the theme is shown to nobody and announced to nobody. `aria-live="polite"` stays quiet on first paint and
speaks once per change. Hide it visually if you must ([docs/styling.md](./docs/styling.md)); do not drop it.

When the user picks `dark`, the picker swaps the managed `<link rel="stylesheet" data-lily-theme-picker="theme">` to
`/assets/themes/dark.css`, sets `data-theme="dark"` on `<html>`, keeps the choice in `localStorage` and a first-party
cookie (both `lily-theme` by default), and calls `onChange("dark", "dark")`.

## Keyboard

On the **button**: `Tab` reaches it; `ArrowDown`, `Enter` and `Space` open the list with the current theme active;
`ArrowUp` opens it with the last option active.

On the **listbox**: `ArrowDown` / `ArrowUp` move and clamp; `Home` / `End` jump; `PageUp` / `PageDown` move by ten;
`Enter` / `Space` choose, close and return focus to the button; `Escape` closes without changing the theme; `Tab` closes
and lets focus move on from the button; printable characters type ahead over the labels. A click on an option chooses
it; a click outside, or focus leaving the control, closes it.

## First value

Resolved once, after the first render (so the server renders the same markup): `value`, then the cookie, then
`localStorage`, then `prefers-color-scheme` (with `detectFromSystem`), then `defaultValue`, then `"system"` (with a
`systemLabel`), then `"light"` when offered, then the first theme. The starting value is not written to storage; only a
change is.

## Props

The full table is in [spec/index.md §4](./spec/index.md). In brief:

| Prop                                  | Type                                      | Notes                                                                         |
| ------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| `label`                               | `string`                                  | Required. Names the button and the listbox.                                   |
| `themesUrl`, `themes`                 | `string`, `string[]`                      | Required. The directory (a trailing `/` is added) and the slugs.              |
| `value` / `defaultValue`              | `string`                                  | Controlled value, or the start of an uncontrolled one.                        |
| `onChange`                            | `(theme: string, choice: string) => void` | After each applied change; a controlled consumer stores `choice`.             |
| `storageKey`, `cookieName`            | `string`                                  | Default `lily-{name}`; `""` turns that store off.                             |
| `systemLabel`                         | `string`                                  | Adds a first "follow this device" option, value `"system"`.                   |
| `systemThemes`                        | `{ light, dark }`                         | The themes `"system"` applies. Default `{ light: "light", dark: "dark" }`.    |
| `detectFromSystem`                    | `boolean`                                 | Resolve `prefers-color-scheme` on a first visit.                              |
| `themeColor`                          | `boolean`                                 | Set `<meta name="theme-color">` from `--lily-brand` once loaded.              |
| `viewTransition`                      | `boolean`                                 | Wrap a change in `document.startViewTransition()` (not under reduced motion). |
| `name`, `extension`                   | `string`                                  | The hidden input's name and the link's discriminator; the file suffix.        |
| `target`                              | `HTMLElement \| null`                     | Receives `data-theme`; default `<html>`.                                      |
| `themeLabels`                         | `Record<string, string>`                  | Display names per slug; otherwise the slug title-cased.                       |
| `open`, `defaultOpen`, `onOpenChange` | `boolean`, …                              | Controlled or uncontrolled popup state.                                       |
| `disabled`                            | `boolean`                                 | Disables the button; an open list closes.                                     |
| `variant`                             | `"listbox" \| "select"`                   | `"select"` renders a native `<select>` instead.                               |
| `children`                            | `(args: ChildArgs) => JSX.Element`        | Replaces the icon (not the options); receives `{ value, open, labelFor }`.    |
| `class`                               | `string`                                  | Added after `theme-picker` on the root.                                       |

## Exported helpers

`themeName(slug)` (the title-casing label rule), `matchSystemTheme(themes)`, `normalizeThemesUrl(url)`,
`themeHref(url, slug, ext)`, and from `theme-choice`: `SYSTEM_THEME`, `readThemeCookie` (for a server) and the rest.

## SSR

The picker touches `document`, `localStorage` and `matchMedia` only after the first render, never on the server. To
send the page in the right theme with no flash, read the `lily-theme` cookie on the server with `readThemeCookie`, set
`data-theme` in the document template, and pass the same value as `value`. Guide: [AGENTS/ssr.md](./AGENTS/ssr.md).

## Accessibility

The WAI-ARIA APG listbox pattern: a button with `aria-haspopup="listbox"`, `aria-expanded` and `aria-controls`; a
`<ul role="listbox">` that follows the active option with `aria-activedescendant` (and `data-active` for CSS); a tooltip
(`role="tooltip"`, the label, shown on hover and keyboard focus, dismissed with `Escape`). The icon is `aria-hidden`, so
`label` is the only name. Visible focus is your CSS. See [docs/accessibility.md](./docs/accessibility.md).

## Testing

```bash
pnpm test    # 126 tests: the React helper's, in their Solid form
pnpm check   # tsc --noEmit
pnpm build
```

---

Lily™ and Lily Design System™ are trademarks.
