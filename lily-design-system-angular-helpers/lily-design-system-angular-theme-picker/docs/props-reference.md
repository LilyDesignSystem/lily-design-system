# Props reference

Field-by-field reference for every public input. The contract is
owned by [`../spec.md`](../spec.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

`aria-label` on the `<fieldset role="radiogroup">`. Always
supplied, always translatable. Screen readers announce it as the
group's name.

```html
<lily-theme-picker label="Theme" themesUrl="/t/" [themes]="themes" />
```

The input is marked `input.required<string>()`, so the TypeScript
compiler enforces it on every binding site.

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

The slugs of the themes the picker exposes as options. The slug is
used both as the radio `value` and as the URL path segment when
constructing the stylesheet href. Choose slugs that are safe URL
path segments — kebab-case ASCII is recommended.

```html
<lily-theme-picker
    label="Theme"
    themesUrl="/assets/themes/"
    [themes]="['light', 'dark', 'abyss']"
/>
```

The picker reads the array once on each effect tick — mid-session
changes to the array trigger a re-render but don't re-apply the
current theme.

## `value` — optional, string (`model`)

The active slug. Two-way bindable with `[(value)]` so the
surrounding code can read and write the selection.

```html
<lily-theme-picker [(value)]="theme" ... />
```

```ts
theme = signal("");
```

When supplied as a non-empty string, the picker treats it as the
authoritative initial value — `storageKey` and `defaultValue` are
both skipped on first effect run.

## `defaultValue` — optional, string

Used during initial-value resolution when `value` is empty and
nothing was stored. If `defaultValue` is itself empty, the resolver
falls back to `"light"` (when present in `themes`) and then to
`themes[0]`.

```html
<lily-theme-picker defaultValue="dark" ... />
```

## `storageKey` — optional, string

`localStorage` key for persistence. When set, the picker:

- Reads the stored slug during initial-value resolution.
- Writes the slug to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed — the picker continues to work in-memory.

```html
<lily-theme-picker storageKey="my-app:theme" ... />
```

## `name` — optional, string — defaults to `"theme"`

The `name` attribute shared by the radio inputs. It also serves as
the discriminator on the managed `<link>` element
(`data-lily-theme-picker="{name}"`), so multiple pickers can
coexist by giving each a distinct `name`.

```html
<lily-theme-picker name="picker-1" ... />
<lily-theme-picker name="picker-2" ... />
```

## `extension` — optional, string — defaults to `".css"`

File extension appended to each slug when constructing the URL.
Pass `".css?v=2"` to bust a cached version, or `".module.css"` to
point at CSS-module-style files.

```html
<lily-theme-picker extension=".css?v=2026-06-05" ... />
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
import { ThemePicker } from "./theme-picker.component";

@Component({
    standalone: true,
    imports: [ThemePicker],
    template: `
        <section #section>
            <lily-theme-picker
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

Per-slug display label override. When unset, default labels
title-case the slug: `"light"` → `"Light"`, `"abyss"` → `"Abyss"`.
Use `themeLabels` for i18n or for slugs that don't gracefully
title-case (e.g.
`"united-kingdom-national-health-service-england-for-patients"`).

```ts
const labels = {
    light: "Clair",
    dark: "Sombre",
    "united-kingdom-national-health-service-england-for-patients":
        "NHS England (patients)",
};
```

```html
<lily-theme-picker [themeLabels]="labels" ... />
```

## `className` — optional, string

Extra CSS class hook on the `<fieldset>`. Always emitted after
`"theme-picker"`, so consumer styles can use either selector.

```html
<lily-theme-picker className="my-extra" ... />
```

Renders:

```html
<fieldset class="theme-picker my-extra" role="radiogroup" ...>
```

The `className` input is Angular's equivalent of Vue's
`inheritAttrs: true`-driven `class` fall-through. Angular has no
implicit attribute spread, so the helper exposes an explicit
input.

## `themeChange` — output, string

Emits the new slug after every successful apply. Use it for
analytics, server sync, or cookie writes.

```html
<lily-theme-picker (themeChange)="onThemeChange($event)" ... />
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
<lily-theme-picker [(value)]="theme" ... />

<!-- Equivalent explicit form -->
<lily-theme-picker
    [value]="theme()"
    (valueChange)="theme.set($event)"
    ...
/>
```

## Future: content projection slot

A future revision will expose `<ng-content>` for custom rendering
inside the `<fieldset>`. The contract will mirror the Svelte
canonical's snippet args and the Vue port's scoped-slot args:
`{ themes, value, setTheme, name, labelFor }`. See
[custom-rendering.md](./custom-rendering.md).
