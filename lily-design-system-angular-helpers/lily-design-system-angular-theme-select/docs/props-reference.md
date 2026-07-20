# Props reference

Field-by-field reference for every public input. The contract is
owned by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

Applied as `aria-label` to **both** the trigger button and the
listbox. Always supplied, always translatable.

```html
<lily-theme-select label="Theme" themesUrl="/t/" [themes]="themes" />
```

The input is marked `input.required<string>()`, so the TypeScript
compiler enforces it on every binding site — and it is required for a
reason. The button is icon-only and its glyph is `aria-hidden`, so
`aria-label` is the **entire** accessible name the control has. A
vague value leaves screen-reader users without a description and
voice-control users without a phrase to say. Name the setting
("Theme", "Colour theme"), not the widget ("Select", "Options"). See
[`accessibility.md`](accessibility.md#1-the-button-is-icon-only-so-aria-label-is-load-bearing).

## `themesUrl` — required, string

Base URL of the directory the theme CSS files are served from. A
trailing `/` is appended automatically if missing, so both
`"/assets/themes/"` and `"/assets/themes"` work.

Acceptable values:

- Absolute path: `"/assets/themes/"` — recommended for in-app
  assets.
- Absolute URL: `"https://cdn.example.com/themes/"` — for
  CDN-hosted themes (CORS-permitting).
- Relative path: `"./themes/"` — works but depends on the current
  document base URL; not recommended for production.

## `themes` — required, string[]

The slugs of the themes the select exposes as options — one
`<li role="option">` each, in array order. The slug is both the
identity of the selection and the URL path segment used to construct
the stylesheet href. Choose slugs that are safe URL path segments —
kebab-case ASCII is recommended.

```html
<lily-theme-select
    label="Theme"
    themesUrl="/assets/themes/"
    [themes]="['light', 'dark', 'abyss']"
/>
```

The select reads the array once on each effect tick — mid-session
changes to the array trigger a re-render but don't re-apply the
current theme.

## `value` — optional, string (`model`)

The active slug. Two-way bindable with `[(value)]` so the
surrounding code can read and write the selection.

```html
<lily-theme-select [(value)]="theme" ... />
```

```ts
theme = signal("");
```

When supplied as a non-empty string, the select treats it as the
authoritative initial value — `storageKey` and `defaultValue` are
both skipped on first effect run.

## `defaultValue` — optional, string

Used during initial-value resolution when `value` is empty and
nothing was stored. If `defaultValue` is itself empty, the resolver
falls back to `"light"` (when present in `themes`) and then to
`themes[0]`.

```html
<lily-theme-select defaultValue="dark" ... />
```

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the select:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the select continues to work in-memory.

```html
<lily-theme-select storageKey="my-app:theme" ... />
```

## `detectFromSystem` — optional, boolean — defaults to `false`

Resolve the operating system's colour-scheme preference to a theme on
first visit. This is the mirror of `detectFromNavigator` on
locale-select, and it sits in the same slot in the resolution order:

```
value > storage > detection > defaultValue > "light" > themes[0]
```

When `true`, the select reads
`matchMedia("(prefers-color-scheme: dark)")` and resolves it to
`"dark"` or `"light"`. Two conditions have to hold for that to take
effect:

- The resolved slug must actually be in your `themes` array. If you
  ship `["solarized", "abyss"]`, detection contributes nothing and
  resolution falls through to `defaultValue`.
- Nothing higher in the order supplied a value. Storage sits above
  detection, so a returning visitor's stored choice still wins. The OS
  preference is a **first-visit default, not an override** — if you
  want the select to keep tracking the OS setting as the user toggles
  it, add a `matchMedia(...).addEventListener("change", …)` listener
  and write to the `[(value)]`-bound signal yourself.

```html
<lily-theme-select
    label="Theme"
    themesUrl="/assets/themes/"
    [themes]="['light', 'dark']"
    [detectFromSystem]="true"
    storageKey="my-app:theme"
    [(value)]="theme"
/>
```

Detection is off unless you opt in, so the default behaviour is
unchanged: no `matchMedia` call happens at all.

Working example:
[`../examples/system-preference.component.ts`](../examples/system-preference.component.ts).

## `name` — optional, string — defaults to `"theme"`

Two jobs, both of them real:

1. The `name` attribute on the hidden `<input type="hidden">` that
   keeps the control participating in a surrounding `<form>`. There is
   no native form control in the markup any more, so this input is how
   the selection reaches a form submission.
2. The discriminator on the managed `<link>` element
   (`data-lily-theme-select="{name}"`).

Because of (2), multiple selects on one page **must** be given
distinct `name` values — otherwise they fight over the same managed
`<link>`.

```html
<lily-theme-select name="select-1" ... />
<lily-theme-select name="select-2" ... />
```

## `extension` — optional, string — defaults to `".css"`

File extension appended to each slug when constructing the URL.
Pass `".css?v=2"` to bust a cached version, or `".module.css"` to
point at CSS-module-style files.

```html
<lily-theme-select extension=".css?v=2026-06-05" ... />
```

## `target` — optional, HTMLElement | null

Element that receives `data-theme` on each apply. Defaults to
`document.documentElement` (i.e. `<html>`). Pass a specific element
when you want themes scoped to a section of the page rather than
the whole document.

In Angular, use a template reference variable plus a `ViewChild`
ref or `viewChild()` query:

```ts
import { Component, viewChild, signal } from "@angular/core";
import { ThemeSelect } from "./theme-select.component";

@Component({
    standalone: true,
    imports: [ThemeSelect],
    template: `
        <section #section>
            <lily-theme-select
                label="Section theme"
                themesUrl="/assets/themes/"
                [themes]="['light', 'dark']"
                [target]="section.nativeElement"
            />
        </section>
    `,
})
export class ScopedSection {
    section = viewChild<ElementRef<HTMLElement>>("section");
}
```

A simpler form for trivial scoping is to use the template ref
directly: `[target]="section"` where `section` is the local
`#section` ref — Angular resolves it to the underlying
`HTMLElement` at template-binding time.

## `themeLabels` — optional, Record<string, string>

Per-slug display label override. When unset, default labels come from
the exported `themeName`, which title-cases each hyphen-separated word
of the slug and joins with spaces: `"light"` → `"Light"`,
`"high-contrast"` → `"High Contrast"`.
Use `themeLabels` for i18n or for slugs whose title-cased form isn't
what you want (e.g.
`"united-kingdom-national-health-service-england-for-patients"`).

These labels are also what the listbox typeahead matches against, so
localising them localises the typeahead.

```ts
const labels = {
    light: "Clair",
    dark: "Sombre",
    "united-kingdom-national-health-service-england-for-patients":
        "NHS England (patients)",
};
```

```html
<lily-theme-select [themeLabels]="labels" ... />
```

## `className` — optional, string

Extra CSS class hook on the root `<div>`. Always emitted after
`"theme-select"`, so consumer styles can use either selector.

```html
<lily-theme-select className="my-extra" ... />
```

Renders:

```html
<div class="theme-select my-extra">
```

The `className` input is Angular's equivalent of Vue's
`inheritAttrs: true`-driven `class` fall-through. Angular has no
implicit attribute spread, so the helper exposes an explicit
input.

## `themeChange` — output, string

Emits the new slug after every successful apply. Use it for
analytics, server sync, or cookie writes.

```html
<lily-theme-select (themeChange)="onThemeChange($event)" ... />
```

```ts
onThemeChange(slug: string): void {
    console.log("theme changed:", slug);
}
```

## Implicit `valueChange` — output, string

`model<string>()` exposes both a read accessor (`value()`) and an
implicit `valueChange` output. `[(value)]` two-way binding
subscribes to that output automatically. You rarely need to
subscribe directly:

```html
<!-- Two-way binding (recommended) -->
<lily-theme-select [(value)]="theme" ... />

<!-- Equivalent explicit form -->
<lily-theme-select
    [value]="theme()"
    (valueChange)="theme.set($event)"
    ...
/>
```

## Content projection — the icon `<ng-template>`

Not an input, but part of the public surface. A projected
`<ng-template>` replaces the default glyph inside the trigger button:

```html
<lily-theme-select label="Theme" [themesUrl]="url" [themes]="themes">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-theme-select>
```

The context is `ChildArgs` — `{ value, open, labelFor }`, supplied as
both `$implicit` and named properties. The optional `ThemeSelectIcon`
marker directive (`ng-template[lilyThemeSelectIcon]`) gives typed
`let-` variables under `strictTemplates`.

The template replaces the **glyph only**; it does not render options,
and the listbox stays component-owned. Full guide:
[custom-rendering.md](./custom-rendering.md).

## Exported helpers and constants

Not inputs, but part of the public surface. Import them from the
barrel when you build a sibling affordance, resolve a theme
server-side, or write a test.

| Export | Signature | Purpose |
| ------ | --------- | ------- |
| `themeName` | `(theme: string) => string` | Title-cases each hyphen-separated word: `"high-contrast"` → `"High Contrast"`. The single implementation of the default-label rule — the component's own `labelFor` delegates to it. Mirror of locale-select's `localeName`. |
| `matchSystemTheme` | `(themes: readonly string[]) => string` | Resolves `prefers-color-scheme` to `"dark"` / `"light"`, or `""` when that slug is absent from `themes` or `matchMedia` is unavailable. Mirror of locale-select's `matchNavigatorLanguage`. |
| `normaliseThemesUrl` | `(themesUrl: string) => string` | Ensures exactly one trailing `/`. |
| `themeHref` | `(themesUrl: string, slug: string, extension: string) => string` | Builds the stylesheet href. |
| `nextThemeSelectId` | `() => string` | Per-instance id prefix from a module counter — SSR-safe, no `Math.random()` / `Date.now()`. |
| `CIRCLE_WITH_RIGHT_HALF_BLACK` | `string` | The default button glyph, `◑` (U+25D1). |
| `ThemeSelectIcon` | directive | Optional marker for the projected icon `<ng-template>`; typing only, not matching. |
| `ChildArgs` | type | The projected template's context. |

`matchSystemTheme` returning `""` rather than throwing is the SSR
guard: there is no `window.matchMedia` on a server, and jsdom does not
implement it either, so the same code path covers both.

```ts
import {
    matchSystemTheme,
    themeName,
} from "./lily-design-system-angular-theme-select";

matchSystemTheme(["light", "dark"]); // "dark" | "light"
matchSystemTheme(["solarized"]);     // "" — neither slug is available
themeName("high-contrast");          // "High Contrast"
```

---

Lily™ and Lily Design System™ are trademarks.
