# AGENTS — LocalePicker (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md). Read it first; everything
below is a fast index.

## What this package is

A reusable Angular 20 headless locale picker. Renders an icon button
that opens a WAI-ARIA APG listbox of locales, and applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection. Ships
no CSS; consumer styles the `locale-picker` class hook (and needs to
supply positioning for the list — see
[index.md](./index.md#styling-hooks)).

## Files

| File                               | Purpose                                           |
| ---------------------------------- | ------------------------------------------------- |
| `spec/index.md`                    | Specification-driven contract (canonical).        |
| `locale-picker.component.ts`      | Implementation. Standalone, signal-based, OnPush. |
| `locale-picker.component.spec.ts` | Vitest spec, one assertion per §7 acceptance.     |
| `locales.ts`                       | Fallback code → English-name map and RTL sets; default labels are endonyms via `localeEndonym`. |
| `locales.tsv`                      | Canonical 436-row source for `locales.ts`.        |
| `index.ts`                         | Barrel re-export.                                 |
| `index.md`                         | User guide.                                       |

## Public surface

- `LocalePicker` (component class, selector `lily-locale-picker`).
- `LocalePickerIcon` (optional marker directive for the projected
  icon `<ng-template>`; selector `ng-template[lilyLocalePickerIcon]`).
- `GLOBE_WITH_MERIDIANS` (the default button glyph, U+1F310 +
  U+FE0E VARIATION SELECTOR-15 — VS15 forces text presentation so
  the globe renders monochrome, matching theme-picker's ◑).
- `nextLocalePickerId` (module-counter id generator; SSR-safe).
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
<div class="locale-picker {className}">
  <input type="hidden" name="{name}" value="{value}" />
  <button
    type="button"
    class="locale-picker-button"
    aria-label="{label}"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="{listId}"
  >
    <span class="locale-picker-icon" aria-hidden="true">🌐︎</span>
  </button>
  <ul
    class="locale-picker-list"
    id="{listId}"
    role="listbox"
    aria-label="{label}"
    tabindex="-1"
    hidden
    aria-activedescendant="{optionId, open only}"
  >
    <li
      class="locale-picker-option"
      id="{optionId}"
      role="option"
      aria-selected="true|false"
      data-active
      lang="{tag, only when the label is the derived endonym}"
    >
      American English
    </li>
  </ul>
</div>
```

Default labels are endonyms via the exported `localeEndonym`
("Cymraeg", not "Welsh"); the English table and the raw code are
fallbacks. An option carries `lang` only when its label is the
derived endonym — a consumer label's language is unknown, so it makes
no claim; the button and the list carry none. Ids come from
`nextLocalePickerId()` — a module counter, not `Math.random()` /
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
  `Home` / `End` jump, `PageUp` / `PageDown` move by ten (clamped),
  `Enter` / `Space` commit and refocus the button, `Escape` cancels
  and refocuses, `Tab` closes via the button so the default Tab
  proceeds from the picker's position, printable characters run a
  500 ms typeahead over labels with APG same-character cycling. Full
  table in
  [spec/index.md §6.2](./spec/index.md#62-keyboard-contract).
- `aria-label` names both the button and the listbox. The button is
  icon-only and its glyph is `aria-hidden`, so `label` is the whole
  accessible name — a weak `label` breaks the control.
- Each endonym-labelled option carries `lang` so assistive tech
  switches pronunciation; consumer-labelled options carry no `lang`,
  because a claim about text in an unknown language would send the
  speech engine to the wrong voice.
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
