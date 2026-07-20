# AGENTS — LocaleSelect (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless locale select. Renders an icon button
that opens a WAI-ARIA APG listbox of locales, and applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-select` class hook (and needs to
supply positioning for the list — see
[index.md](./index.md#styling-hooks)).

## Files

| File                                | Purpose                                          |
| ----------------------------------- | ------------------------------------------------ |
| `spec/index.md`                           | Specification-driven contract (canonical).       |
| `locale-select.component.ts`        | Implementation. Standalone, signal-based, OnPush.|
| `locale-select.component.spec.ts`   | Vitest spec, one assertion per §7 acceptance.    |
| `locales.ts`                        | Code → English-name map and RTL sets.            |
| `locales.tsv`                       | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                          | Barrel re-export.                                |
| `index.md`                          | User guide.                                      |

## Public surface

- `LocaleSelect` (component class, selector `lily-locale-select`).
- `LocaleSelectIcon` (optional marker directive for the projected
  icon `<ng-template>`; selector `ng-template[lilyLocaleSelectIcon]`).
- `GLOBE_WITH_MERIDIANS` (the default button glyph, U+1F310 +
  U+FE0E VARIATION SELECTOR-15 — VS15 forces text presentation so
  the globe renders monochrome, matching theme-select's ◑).
- `nextLocaleSelectId` (module-counter id generator; SSR-safe).
- `bcp47LocaleTag`, `isRtlLocale`, `localeName`,
  `matchNavigatorLanguage` (pure helpers).
- `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`, `RTL_SCRIPT_SUBTAGS`
  (constants).
- `ChildArgs` (type-only — the projected template's context).

Required inputs: `label`, `locales`. Full table in
[spec/index.md §4.1](./spec/index.md#41-inputs--outputs).

## Behaviour contract (one paragraph)

On every locale change the select (1) sets
`target.lang = bcp47LocaleTag(code)`, (2) optionally sets
`target.dir = isRtlLocale(code) ? "rtl" : "ltr"`, (3) optionally
writes `code` to `localStorage[storageKey]`, and (4) emits
`localeChange(code)` with the consumer-form code. SSR-safe — all DOM
writes guard on `typeof document`. Initial value resolves from
`value` > storage > navigator (if `detectFromNavigator`) >
`defaultValue` > `"en"` (if present) > `locales[0]`.

**The control is a button + listbox, not a `<select>`.** The button
toggles the list; `value` is the single source of truth and a hidden
input carries it into an enclosing form. Choosing an option writes to
the `value` model signal, closes the list, and returns focus to the
button — the apply pipeline then runs off the `value` change.

## HTML

```html
<div class="locale-select {className}">
  <input type="hidden" name="{name}" value="{value}" />
  <button type="button" class="locale-select-button" aria-label="{label}"
          aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
    <span class="locale-select-icon" aria-hidden="true">&#127760;</span>
  </button>
  <ul class="locale-select-list" id="{listId}" role="listbox" aria-label="{label}"
      tabindex="-1" hidden aria-activedescendant="{optionId, open only}">
    <li class="locale-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active lang="en-US">English (United States)</li>
  </ul>
</div>
```

Each option carries its own `lang` so its name is pronounced in its
own language; the button and the list carry none. Ids come from
`nextLocaleSelectId()` — a module counter, not `Math.random()` /
`Date.now()` — so SSR and hydration agree. `@for` is used (not
`*ngFor`). A projected `<ng-template>` replaces the glyph span only;
it never renders options, and its context is
`{ $implicit, value, open, labelFor }`.

## Accessibility

- WCAG 2.2 AAA target. WCAG 3.1.1 (Language of Page) and 3.1.2
  (Language of Parts).
- The keyboard contract is the component's own, implementing the APG
  listbox pattern — nothing is inherited from a native `<select>`.
  Button: `ArrowDown` / `Enter` / `Space` open on the selection,
  `ArrowUp` opens on the last option. List: arrows clamp,
  `Home` / `End` jump, `Enter` / `Space` commit and refocus the
  button, `Escape` cancels and refocuses, `Tab` closes without
  stealing focus, printable characters run a 500 ms typeahead over
  labels. Full table in
  [spec/index.md §6.2](./spec/index.md#62-keyboard-contract).
- `aria-label` names both the button and the listbox. The button is
  icon-only and its glyph is `aria-hidden`, so `label` is the whole
  accessible name — a weak `label` breaks the control.
- Each option carries `lang` so assistive tech switches pronunciation.
- The closed button shows only a glyph, never the active locale.
  Tradeoffs and the compensating status-region pattern:
  [docs/accessibility.md](./docs/accessibility.md).

## Conventions this package follows

- Angular 20 standalone component with `input<T>()` /
  `input.required<T>()`, `model<string>()`, `output<T>()`.
- `ChangeDetectionStrategy.OnPush`.
- `@for` control flow.
- No template casts. The catalog's `$any($event.target).value` idiom
  does not apply here — there is no native control whose `value` a
  `(change)` handler must read. Handlers take typed events
  (`KeyboardEvent`, `FocusEvent`) or an index.
- Content projection via `contentChild(TemplateRef)` + `NgTemplateOutlet`.
- Document / focus listeners are declarative: a
  `host: { "(document:click)": … }` binding and a `(focusout)`
  binding on the root `<div>`. No manual `addEventListener`.
- Strict TypeScript on the public surface.
- No runtime dependency beyond `@angular/core` / `@angular/common`.
- No bundled CSS, fonts, icons, or images.
- All user-facing strings come from inputs.
