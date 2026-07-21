# AGENTS — ThemeChooser (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless theme chooser that **loads theme CSS
files dynamically at runtime** from a developer-supplied directory
URL. The control is an icon button that opens a WAI-ARIA APG
listbox — not a native `<select>` — so the component owns the roles,
focus moves, and the whole keyboard contract itself. Ships no CSS;
consumer styles the `theme-chooser` class hooks and supplies the
listbox positioning.

## Files

| File                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `spec/index.md`                         | Specification-driven contract (canonical).       |
| `theme-chooser.component.ts`       | Implementation. Standalone, signal-based, OnPush.|
| `theme-chooser.component.spec.ts`  | Vitest spec, one assertion per §7 acceptance.    |
| `index.ts`                        | Barrel re-export.                                |
| `index.md`                        | User guide.                                      |

## Public surface

- `ThemeChooser` (component class, selector `lily-theme-chooser`).
- `ThemeChooserIcon` (optional marker directive,
  `ng-template[lilyThemeChooserIcon]`, for typed `let-` variables).
- `CIRCLE_WITH_RIGHT_HALF_BLACK` (the default glyph, `◑` U+25D1).
- `nextThemeChooserId` (per-instance id generator).
- `normaliseThemesUrl`, `themeHref`, `themeName`, `matchSystemTheme`
  (pure helpers).
- `ChildArgs` (type).

Required inputs: `label`, `themesUrl`, `themes`. Full table in
[spec/index.md §4.1](./spec/index.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every theme change the select (1) sets the `href` of one managed
`<link rel="stylesheet" data-lily-theme-chooser="{name}">` in
`document.head` to `${themesUrl}${slug}${extension}`, (2) sets
`data-theme="{slug}"` on `target` (defaults to
`document.documentElement`), (3) optionally writes the slug to
`localStorage[storageKey]`, and (4) emits `themeChange(slug)`.
SSR-safe — all DOM writes guard on `typeof document`. Initial value
resolves from `value` > storage > system detection (if
`detectFromSystem`) > `defaultValue` > `"light"` (if present) >
`themes[0]` — the same shape as locale-chooser's
`value` > storage > navigator > `defaultValue` > `"en"` >
`locales[0]`. `value` is the single source of truth; the hidden input
mirrors it for form participation.

## HTML

```html
<div class="theme-chooser {className}">
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="theme-chooser-button" aria-label="{label}"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-chooser-list" id="{listId}" role="listbox" aria-label="{label}"
      tabindex="-1" hidden aria-activedescendant="{optionId, only while open}">
    <li class="theme-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Light</li>
  </ul>
</div>
```

`@for` is used (not `*ngFor`). Ids come from `nextThemeChooserId()`, an
incrementing module counter — stable, unique per instance, SSR-safe.
A projected `<ng-template>` (queried via `contentChild(TemplateRef)`)
replaces the glyph inside the button and receives `ChildArgs`
(`{ $implicit, value, open, labelFor }`); it does **not** render
options.

## Accessibility

- WCAG 2.2 AAA target.
- Custom APG listbox: the component owns roles, `aria-expanded`,
  `aria-activedescendant`, focus moves, and every key. Nothing is
  inherited from a native control. See
  [spec/index.md §6.2](./spec/index.md#62-keyboard-contract).
- Button keys: `ArrowDown` / `Enter` / `Space` open on the selected
  option; `ArrowUp` opens on the last. Listbox keys: `ArrowDown` /
  `ArrowUp` (clamped, no wrap), `Home` / `End`, `Enter` / `Space` to
  select and refocus the button, `Escape` to dismiss unchanged, `Tab`
  to close without stealing focus, printable chars for a 500 ms
  typeahead over labels.
- The button is icon-only, so `aria-label` is its **entire**
  accessible name — a poor label makes the control unusable.
- Option labels default to title-cased slugs via the exported
  `themeName`; the word "default" is never emitted.

## Conventions this package follows

- Angular 20 standalone component with `input<T>()` /
  `input.required<T>()`, `model<string>()`, `output<T>()`.
- `ChangeDetectionStrategy.OnPush`.
- `@for` control flow (not `*ngFor`).
- No template casts are needed here — the component handles
  `(click)` / `(keydown)` events with typed handler methods rather
  than reading `$event.target` inline. (The catalog's
  `$any($event.target).value` rule still applies to helpers that do
  bind a native input's value.)
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs.
