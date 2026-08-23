# Changelog — LocalePicker (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-30

First published release. Nothing earlier shipped, so the
accessibility hardening completed after the initial entry below is
part of 0.1.0 rather than a later version.

### Pointer-selection close is now part of the contract (2026-07-31)

#### Changed

- **Clicking an option is specified to close the listbox**, not just to
  select and apply. The behaviour was already correct — and is now
  asserted: the pointer test checks `aria-expanded="false"` and the
  list's `hidden` alongside the applied value. Only `Enter` promised the
  close before, and an untested asymmetry is one refactor away from
  becoming real: a selection that leaves `aria-expanded="true"` over a
  hidden list reports an open popup to assistive technology and makes
  every later click miss the options.

### Accessibility hardening (2026-07-29/30)

#### Changed

- **`Tab` from the open list is documented — and deliberately NOT given
  the canonical Svelte button-refocus.** The canonical fix moves focus
  to the trigger before hiding the list, because Svelte hides
  synchronously, ahead of the browser's default Tab, which otherwise
  restarts from the top of the document. Blazor cannot reproduce that
  bug — the default Tab always runs before the async handler, so it
  proceeds from the still-visible list — and mirroring the refocus
  would run *after* the default Tab and yank the user back to the
  trigger they just left. Both implementations end with focus on the
  tab stop after the picker; the divergence is recorded in spec §6.2.1.
- **Typeahead follows the APG single-character rule** (canonical
  §7.30). A single character advances to the *next* matching option,
  and repeating that character cycles through the matches; only a
  buffer of differing characters refines the match anchored on the
  active option. Previously a character that matched the active option
  went nowhere.

#### Changed (labels)

- **Default option labels are endonyms** — each language named in
  itself, "Cymraeg" not "Welsh" — via the new public
  `Locales.LocaleEndonym()`. The canonical Svelte helper asks
  `Intl.DisplayNames` *in that language*; .NET has no `Intl`, so this
  port reads `CultureInfo.NativeName` (with
  `GetCultureInfo(tag, predefinedOnly: true)` so a fabricated culture
  cannot echo its own tag back as a "name", and a memoising cache so
  unknown codes do not pay a thrown `CultureNotFoundException` per
  render). The two ICU surfaces can format slightly differently —
  "English (United States)" here vs "American English" there; both are
  true endonyms and the divergence is accepted and documented. The
  English table in `Locales.cs` becomes a fallback for cultures the
  runtime has no data for. Resolution order: `LocaleLabels` → endonym →
  English table → raw code.
- **`lang` on an option is now a claim we can stand behind.** It is set
  only when the label is the derived endonym. Previously every option
  carried `lang` while showing an English label, sending screen-reader
  speech engines to the wrong voice — the English word "Arabic" read
  out by an Arabic synthesizer.

#### Added

- **`PageUp` / `PageDown`** move the active option by ten, clamped —
  an APG-optional key for long locale lists (canonical §7.31).
- Internal `ButtonReferenceId` / `ListReferenceId` test seams
  (InternalsVisibleTo), so the bUnit suite can compare recorded
  `FocusAsync` interop targets the way the DateTimePicker suite does.

#### Fixed

- Opening with an empty option list no longer refuses to open (and, as
  in the canonical fix, never points `aria-activedescendant` at an id
  that does not exist): the active index is `-1` and the attribute is
  simply absent (canonical §7.32).

### Initial entry — 2026-07-21

Renamed from `lily-design-system-blazor-locale-select` to
`lily-design-system-blazor-locale-picker`. The NuGet package is now
`LilyDesignSystem.Blazor.LocalePicker`.

The rename is the whole change: no behaviour, no API semantics and no
DOM structure moved. This release ships the code exactly as it stood
under the old name, including everything previously listed as
Unreleased there.

Renamed in this package:

- Component and context: `LocalePicker` -> `LocalePicker`,
  `LocaleSelectContext` -> `LocalePickerContext`.
- Class hooks: `.locale-picker*` -> `.locale-picker*`, including the
  `--locale-picker-{bg,fg,border}` custom properties documented in
  `docs/styling.md`.
- Generated element ids: `locale-picker-{n}` -> `locale-picker-{n}`.
- Files: `LocalePicker.razor{,.cs}` -> `LocalePicker.razor{,.cs}`,
  `LocaleSelectTests.cs` -> `LocalePickerTests.cs`.

`Locales.LocaleName`, `MatchNavigatorLanguage` and every parameter name
are unchanged — they never said "select".

**Version reset to 0.1.0.** Nothing has ever been published under the
new package id, so a `0.4.0` here would imply releases that never
existed. The history below belongs to `lily-design-system-blazor-locale-select`
and is kept for provenance.

Upgrading: rename the package reference, the component tag, and the CSS
selectors. Nothing else moves.

---

## Prior history — released in-tree as `lily-design-system-blazor-locale-select`

#### Unreleased

##### Changed

- **The default glyph gains U+FE0E VARIATION SELECTOR-15.**
  `LocalePicker.GlobeWithMeridians` is now the two-codepoint sequence
  `"\U0001F310\uFE0E"` (was `"\U0001F310"`). VS15 requests the _text_
  presentation, so the globe renders monochrome in the current text
  colour instead of as a blue colour-emoji — matching ThemePicker's
  `◑` (U+25D1), which is not an emoji codepoint and already rendered as
  text. Verified in Chromium.

  Consumers asserting on the exact glyph string must update to the
  two-codepoint sequence. VS15 is a _request_: platforms that ignore it
  still paint a colour globe, so `docs/styling.md` documents a
  font-stack fallback and `ChildContent` remains the guaranteed route
  to a monochrome mark.

##### Added

- **Five shared topic docs**, bringing the doc set level with
  theme-picker's: `docs/parameters-reference.md`, `docs/styling.md`,
  `docs/custom-rendering.md`, `docs/recipes.md`, and
  `docs/troubleshooting.md`. Written for locale-picker rather than
  adapted from the theme-picker copies. The locale-specific docs
  (`bcp47`, `rtl`, `i18n-integration`, `concepts`) are unchanged;
  `preloading` stays theme-only, since it is about stylesheet
  preloading and has no locale counterpart.

- **Examples renamed to descriptive names**, matching theme-picker's
  convention and dropping the numeric prefixes left over from the
  radio-group era. None of these files has rendered radios, a
  `<select>`, or a button group since the icon-button/listbox port:

  | Was                             | Now                          |
  | ------------------------------- | ---------------------------- |
  | `01_Radios.razor`               | `Basic.razor`                |
  | `02_Select.razor`               | `CustomRendering.razor`      |
  | `03_Buttons.razor`              | `ExternalButtons.razor`      |
  | `04_RtlDemo.razor`              | `RtlDemo.razor`              |
  | `05_NhsStyle.razor`             | `NhsStyle.razor`             |
  | `06_WithIStringLocalizer.razor` | `WithIStringLocalizer.razor` |
  | `07_WithResX.razor`             | `WithResX.razor`             |
  | `08_SsrCookie.razor`            | `SsrCookie.razor`            |
  | `09_ScopedTarget.razor`         | `ScopedTarget.razor`         |
  | `10_Combobox.razor`             | `Combobox.razor`             |

  All inbound links updated (`examples/README.md`, `index.md`,
  `AGENTS/ssr.md`, and the ResX layout comment inside `WithResX.razor`).

##### Fixed

- `index.md` no longer marks examples 2, 3, 5, and 10 as "⚠️ Stale —
  written against the previous native-`<select>` API". They were
  rewritten for the icon-button/listbox API; no example passes the
  removed `Placeholder` parameter. The warning was itself stale.

##### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a dropdown listbox, built to the WAI-ARIA APG
  listbox pattern. The root element changes from `<select>` to `<div>`:

  ```html
  <div class="locale-picker {CssClass}">
    <input type="hidden" name="{Name}" value="{Value}" />
    <button
      type="button"
      class="locale-picker-button"
      aria-label="{Label}"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-controls="{listId}"
    >
      <span class="locale-picker-icon" aria-hidden="true">&#127760;</span>
    </button>
    <ul
      class="locale-picker-list"
      id="{listId}"
      role="listbox"
      aria-label="{Label}"
      tabindex="-1"
      hidden
      aria-activedescendant="{active option id, open only}"
    >
      <li
        class="locale-picker-option"
        id="{optionId}"
        role="option"
        aria-selected="true|false"
        data-active
        lang="{TagFor(code)}"
      >
        {LabelFor(code)}
      </li>
    </ul>
  </div>
  ```

  Consumers must update: any CSS or test selector targeting
  `select.locale-picker` or `option.locale-picker-option`;
  `AdditionalAttributes` and `CssClass` now land on the root `<div>`,
  not on a form control. Per-option `lang` is preserved — and is now
  honoured more reliably, since the options are real DOM nodes rather
  than an OS-drawn popup. The button and the list carry no `lang`.

- **`Placeholder` is removed.** It existed only to pin the native
  `<select>`'s closed display to a short word. There is no `<select>`
  left to pin, so the parameter is gone and passing it is a compile
  error. The closed control is an icon button; to show the active
  locale, render a status region beside it — see
  [`docs/accessibility.md`](./docs/accessibility.md#the-status-region-is-still-the-recommended-pattern).

- **The 0.3.0 snap-back interop write is removed.** The component no
  longer calls `Object.assign(el, { value: "" })` through `IJSRuntime`.
  There is no `<select>` DOM value to reset.

- **`LocalePickerContext` is narrowed, and `ChildContent` changes
  meaning.** The fragment now **replaces the glyph inside the button**
  rather than rendering the options; options are always
  component-owned, so neither the listbox semantics nor the per-option
  `lang` can be broken by a consumer override. The context drops
  `Locales`, `SetLocale`, `Name`, `TagFor` and `IsRtl`, keeping
  `{ Value, Open, LabelFor }` to mirror the canonical Svelte
  `ChildArgs`. The dropped helpers remain available as statics on the
  `Locales` class; to drive selection imperatively, call the public
  `SetLocaleAsync(string)` on a `@ref` to the component.

- **The `.locale-picker-placeholder` CSS hook is gone.** The hooks are
  now `.locale-picker`, `.locale-picker-button`, `.locale-picker-icon`,
  `.locale-picker-list`, `.locale-picker-option`, plus the
  `[data-active]` and `[aria-selected]` state selectors.

##### Added

- Full WAI-ARIA APG listbox keyboard contract, implemented by the
  component: `ArrowDown` / `Enter` / `Space` open on the selected
  option and `ArrowUp` opens on the last; arrows move and **clamp**
  (no wrapping); `Home` / `End` jump; `Enter` / `Space` select-apply-
  close-and-refocus; `Escape` closes without changing the value; `Tab`
  closes without stealing focus; printable characters run a 500 ms
  typeahead over the labels. Clicking an option selects it; focus
  leaving the root closes the listbox.
- Focus management via `ElementReference.FocusAsync()` — opening moves
  focus to the `<ul>`, selecting or escaping returns it to the button.
- `LocalePicker.GlobeWithMeridians` — the default glyph constant,
  `"🌐"` (U+1F310).
- A hidden `<input>` carrying `Name` / `Value` so the control still
  participates in form submission.
- Stable, SSR-safe element ids from a monotonic process-wide counter
  (`locale-picker-{n}-list`, `locale-picker-{n}-option-{i}`) — no
  randomness and no clock reads.

##### Unchanged

`lang` / `dir` application, RTL detection, `localStorage` persistence,
`navigator` detection, `OnChange` / `ValueChanged`, initial-value
resolution, SSR safety, and every pure helper on the static `Locales`
class (`Bcp47LocaleTag`, `IsRtlLocale`, `LocaleName`,
`MatchNavigatorLanguage`, `DefaultLocaleLabels`, `RtlLanguageTags`,
`RtlScriptSubtags`) all behave exactly as before.

##### Known deviations from the canonical Svelte implementation

- No `preventDefault` on keydown: Blazor evaluates
  `@onkeydown:preventDefault` at render time, not per event, so it
  cannot spare `Tab`. Arrow keys and `Space` therefore still scroll the
  page. A suppress-next-click flag stops `Enter` / `Space` toggling the
  listbox twice.
- No document-level click listener (this package ships no JavaScript);
  outside interaction closes the listbox via the root's `focusout`
  instead.

#### 0.3.0 — 2026-07-20

##### Changed (BREAKING)

- The closed `<select>` now always reads a placeholder word instead of
  the active locale name, so the control stays narrow regardless of how
  long locale names are. Two parts of the DOM contract change:
  - **Option count and ordering.** A component-owned placeholder
    `<option class="locale-picker-option locale-picker-placeholder"
value="" selected>` is now the FIRST child of the `<select>`, in
    both the default and the `ChildContent` code paths. It carries no
    `lang`, since it is not a locale. Consumers and tests that count
    options or index into them must account for it (`Locales.Count + 1`;
    real codes start at index 1).
  - **The `<select>`'s own value no longer tracks the selection.** The
    placeholder is the only option ever marked `selected`; after every
    change the component resets the live element's value back to `""`
    via `IJSRuntime`. Read the selection from `Value` (still two-way
    bindable via `@bind-Value`) or from `lang` on the document root —
    never from the `<select>` element.

  Everything downstream is unchanged: `lang` / `dir` application,
  `localStorage` persistence, `navigator` detection, `OnChange` /
  `ValueChanged`, and initial-value resolution all behave as before.

##### Added

- `Placeholder` parameter (`string?`, defaults to `Label`) — the text
  of the always-displayed placeholder option. Like every other
  user-facing string in this package it is consumer-supplied, so no
  hardcoded English is emitted.
- New `.locale-picker-placeholder` class hook, and a width recipe
  (`field-sizing: content` with a `max-width` fallback) in
  [`index.md`](index.md).

##### Accessibility

- Documented tradeoff: because the closed control always reads the
  placeholder, screen-reader users no longer hear the active locale
  announced as the combobox value. Consumers who need it announced
  should surface the active locale in visible text (with its own `lang`)
  or a polite live region — see
  [`docs/accessibility.md`](docs/accessibility.md).

##### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the entry-point example and the `index.md` quick-start both
  ship a visible `<p class="locale-picker-status" aria-live="polite">`
  showing the active locale via the exported `localeName`.
  `aria-live="polite"` announces mutations only, so it stays silent on
  first paint and speaks on each change. `docs/accessibility.md`
  reframes opting _out_ as the deliberate choice and keeps an explicit
  "what this does and does not fix" note — the region announces
  transitions, it does not restore combobox value semantics.

#### 0.2.0 — 2026-07-03

##### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="locale-picker">` with one `<option class="locale-picker-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `locale-picker` now names the `<select>` root
  and `locale-picker-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

##### Unchanged

- The behaviour contract: DOM application (`lang` / `dir`), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

#### 0.1.0 — 2026-06-05

Initial release.

##### Added

- `LocalePicker.razor` + `LocalePicker.razor.cs` — partial-class
  Blazor component in namespace `LilyDesignSystem.Blazor.Helpers`.
  Implements the full Svelte canonical contract:
  - Renders `<select aria-label="…" name="…">` with one
    `<option value="{locale}" lang="{TagFor(locale)}">` per locale
    code per WCAG 3.1.2 (Language of Parts).
  - Sets `lang="{Bcp47LocaleTag(code)}"` on
    `document.documentElement` via `IJSRuntime.InvokeVoidAsync`.
  - Sets `dir="rtl"` / `dir="ltr"` on the document root via
    `Locales.IsRtlLocale()` auto-detection. Opt-out via
    `ApplyDir="false"`.
  - Optional `StorageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Optional `DetectFromNavigator` first-visit fallback via
    `navigator.languages`.
  - Two-way binding via `@bind-Value`.
  - `OnChange` `EventCallback<string>` for post-apply side effects
    (consumer-form code, not BCP 47 normalised).
  - `RenderFragment<LocalePickerContext>` for custom rendering
    with `{ Locales, Value, SetLocale, Name, LabelFor, TagFor,
IsRtl }`.
  - `[Parameter(CaptureUnmatchedValues = true)] AdditionalAttributes`
    for attribute spread.
- `Locales` static class with 436-row built-in locale-code →
  English-name table plus RTL language and script subtag sets.
  Public methods: `Bcp47LocaleTag`, `IsRtlLocale`, `LocaleName`,
  `MatchNavigatorLanguage`. Public properties:
  `DefaultLocaleLabels`, `RtlLanguageTags`, `RtlScriptSubtags`.
- `locales.tsv` — canonical 436-row source for `Locales.cs`.
  Byte-identical to the Svelte canonical helper's
  `locales.tsv`.
- `LocalePickerTests.cs` — bUnit + xUnit suite asserting every
  numbered acceptance criterion in `spec/index.md` §7 (23 items).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `ssr.md`, `testing.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `bcp47.md`, `concepts.md`, `i18n-integration.md`, `rtl.md`,
  `ssr.md`.
- `examples/` subdirectory: `01_Radios.razor`, `02_Select.razor`,
  `03_Buttons.razor`, `04_RtlDemo.razor`, `05_NhsStyle.razor`,
  `06_WithIStringLocalizer.razor`, `07_WithResX.razor`,
  `08_SsrCookie.razor`, `09_ScopedTarget.razor`,
  `10_Combobox.razor`, plus a `README.md` index.

##### Conventions

- Blazor 10 / .NET 10, `Nullable enable`, `ImplicitUsings enable`.
- Partial class split between `.razor` and `.razor.cs`.
- Namespace: `LilyDesignSystem.Blazor.Helpers`.
- `[Parameter, EditorRequired]` for required parameters.
- `EventCallback<T>` for events; `{Name}` + `{Name}Changed` for
  `@bind-{Name}`.
- `RenderFragment<LocalePickerContext>` for custom rendering.
- All DOM writes go through `IJSRuntime` inside
  `OnAfterRenderAsync` so the component is SSR / prerender safe.
- Tested under bUnit + xUnit.

##### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-locale-picker` v0.1.0. The DOM contract,
BCP 47 normalisation rules, RTL detection sets, initial-value
resolution order, and apply order match clause-for-clause.

##### Notes

- The `onChange` callback prop from the Svelte canonical maps to
  the `OnChange` Blazor `EventCallback<string>`. Use
  `OnChange="HandlerMethod"` in markup.
- The `children` snippet from Svelte maps to the `ChildContent`
  `RenderFragment<LocalePickerContext>` in Blazor. Use
  `<ChildContent Context="ctx">` in consumer markup.
- The bindable model name is `Value`, accessed via `@bind-Value`.
- The pure helpers from the Svelte canonical (`bcp47LocaleTag`,
  `isRtlLocale`, `localeName`, `matchNavigatorLanguage`,
  `defaultLocaleLabels`, `RTL_LANGUAGE_TAGS`,
  `RTL_SCRIPT_SUBTAGS`) live on the `Locales` static class with
  PascalCase names per .NET convention.
- The select requires an interactive render mode
  (`InteractiveServer`, `InteractiveWebAssembly`, or
  `InteractiveAuto`) for its `OnAfterRenderAsync` lifecycle hook to
  fire. Static SSR renders the markup but doesn't mutate the DOM.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
