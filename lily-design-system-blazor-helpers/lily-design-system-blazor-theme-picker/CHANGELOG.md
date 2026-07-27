# Changelog — ThemeChooser (Blazor)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

Renamed from `lily-design-system-blazor-theme-select` to
`lily-design-system-blazor-theme-chooser`. The NuGet package is now
`LilyDesignSystem.Blazor.ThemeChooser`.

The rename is the whole change: no behaviour, no API semantics and no
DOM structure moved. This release ships the code exactly as it stood
under the old name, including everything previously listed as
Unreleased there.

Renamed in this package:

- Component and context: `ThemeChooser` -> `ThemeChooser`,
  `ThemeSelectContext` -> `ThemeChooserContext`.
- Class hooks: `.theme-chooser`, `-button`, `-icon`, `-list`, `-option`
  -> `.theme-chooser`, `-button`, `-icon`, `-list`, `-option`.
- The managed `<link>` discriminator: `data-lily-theme-select` ->
  `data-lily-theme-chooser`.
- Generated element ids: `theme-chooser-{n}` -> `theme-chooser-{n}`.
- Files: `ThemeChooser.razor{,.cs}` -> `ThemeChooser.razor{,.cs}`,
  `ThemeSelectTests.cs` -> `ThemeChooserTests.cs`,
  `examples/MultipleSelects.razor` -> `examples/MultipleChoosers.razor`.

`ThemeName`, `ThemesUrl`, `MatchSystemTheme` and every parameter name
are unchanged — they never said "select".

**Version reset to 0.1.0.** Nothing has ever been published under the
new package id, so a `0.4.0` here would imply releases that never
existed. The history below belongs to `lily-design-system-blazor-theme-select`
and is kept for provenance.

Upgrading: rename the package reference, the component tag, and the CSS
selectors. Nothing else moves.

---

## Prior history — released in-tree as `lily-design-system-blazor-theme-select`

#### Unreleased

##### Added

- **`ThemeChooser.ThemeName(string slug)` — public static.** The single
  implementation of the default label rule (`"high-contrast"` ->
  `"High Contrast"`). The private instance `LabelFor` now delegates to
  it, so there is exactly one copy of the rule; `ThemeLabels` still
  overrides. Previously the rule lived only in a private method, which
  forced every example across the seven catalogs to hand-duplicate the
  title-casing. Mirrors `Locales.LocaleName` on LocaleChooser.
- **`DetectFromSystem` parameter (`bool`, default `false`).** Opt in to
  resolving `prefers-color-scheme` on first visit. Slots into the
  resolution order in the position navigator detection occupies for
  LocaleChooser:

  ```
  Value > StorageKey > DetectFromSystem > DefaultValue > "light" > Themes[0]
  ```

  A returning visitor's stored choice therefore always beats the OS
  preference; detection only ever decides the first visit. Off by
  default, so no existing behaviour changes.
- **`ThemeChooser.MatchSystemTheme(bool? prefersDark, themes)` — public
  static.** The pure decision behind `DetectFromSystem`: maps an OS
  colour-scheme preference onto a supported slug, returning `""` when
  the slug is not offered **or when `prefersDark` is null**, which is
  how "matchMedia unavailable" (prerender, static SSR, a host without
  the API) is represented. Mirrors
  `Locales.MatchNavigatorLanguage(navLangs, locales)`, which takes its
  browser-read input the same way — the interop probe reads the
  browser, the pure function makes the decision and is separately
  testable.

##### Changed

- `examples/SystemPreference.razor` and the "Follow the OS colour
  scheme on first visit" recipe now use `DetectFromSystem` instead of
  hand-resolving the media query in `OnAfterRenderAsync` and passing
  the result as `DefaultValue`. The old approach still works but gets
  the precedence subtly wrong.
- `spec/index.md` §8 no longer lists "a `prefers-color-scheme`
  integration" as out of scope. A *live* subscription remains out of
  scope: re-theming a page when the OS flips while the tab is open
  would fight a selection the user made by hand.

##### Changed (BREAKING)

- **The control is no longer a native `<select>`.** It is now an icon
  button that opens a dropdown listbox, built to the WAI-ARIA APG
  listbox pattern. The root element changes from `<select>` to `<div>`:

  ```html
  <div class="theme-chooser {CssClass}">
    <input type="hidden" name="{Name}" value="{Value}" />
    <button type="button" class="theme-chooser-button" aria-label="{Label}"
            aria-haspopup="listbox" aria-expanded="false" aria-controls="{listId}">
      <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
    </button>
    <ul class="theme-chooser-list" id="{listId}" role="listbox" aria-label="{Label}"
        tabindex="-1" hidden aria-activedescendant="{active option id, open only}">
      <li class="theme-chooser-option" id="{optionId}" role="option"
          aria-selected="true|false" data-active>{LabelFor(slug)}</li>
    </ul>
  </div>
  ```

  Consumers must update: any CSS or test selector targeting
  `select.theme-chooser` or `option.theme-chooser-option`;
  `AdditionalAttributes` and `CssClass` now land on the root `<div>`,
  not on a form control.

- **`Placeholder` is removed.** It existed only to pin the native
  `<select>`'s closed display to a short word. There is no `<select>`
  left to pin, so the parameter is gone and passing it is a compile
  error. The closed control is an icon button; to show the active
  theme, render a status region beside it — see
  [`docs/accessibility.md`](./docs/accessibility.md#the-status-region-is-still-the-recommended-pattern).

- **The 0.3.0 snap-back interop write is removed.** The component no
  longer calls `Object.assign(el, { value: "" })` through `IJSRuntime`
  after a change. There is no `<select>` DOM value to reset.

- **`ThemeChooserContext` is narrowed, and `ChildContent` changes
  meaning.** The fragment now **replaces the glyph inside the button**
  rather than rendering the options; options are always
  component-owned, so the listbox semantics cannot be broken by a
  consumer override. The context drops `Themes`, `SetTheme` and
  `Name`, keeping `{ Value, Open, LabelFor }` to mirror the canonical
  Svelte `ChildArgs`. To drive selection imperatively, call the public
  `SetThemeAsync(string)` on a `@ref` to the component.

- **The `.theme-chooser-placeholder` CSS hook is gone.** The hooks are
  now `.theme-chooser`, `.theme-chooser-button`, `.theme-chooser-icon`,
  `.theme-chooser-list`, `.theme-chooser-option`, plus the
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
- `ThemeChooser.CircleWithRightHalfBlack` — the default glyph constant,
  `"◑"` (U+25D1).
- A hidden `<input>` carrying `Name` / `Value` so the control still
  participates in form submission. `Name` continues to discriminate the
  managed `<link data-lily-theme-chooser="{Name}">`.
- Stable, SSR-safe element ids from a monotonic process-wide counter
  (`theme-chooser-{n}-list`, `theme-chooser-{n}-option-{i}`) — no
  randomness and no clock reads.

##### Unchanged

The managed `<link>` swap, `data-theme`, `localStorage` persistence,
`OnChange` / `ValueChanged`, initial-value resolution, SSR safety, and
the static `NormaliseThemesUrl` / `ThemeHref` helpers all behave
exactly as before.

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
  the active theme name, so the control stays narrow regardless of how
  long theme names are. Two parts of the DOM contract change:
  - **Option count and ordering.** A component-owned placeholder
    `<option class="theme-chooser-option theme-chooser-placeholder"
    value="" selected>` is now the FIRST child of the `<select>`, in
    both the default and the `ChildContent` code paths. Consumers and
    tests that count options or index into them must account for it
    (`Themes.Count + 1`; real slugs start at index 1).
  - **The `<select>`'s own value no longer tracks the selection.** The
    placeholder is the only option ever marked `selected`; after every
    change the component resets the live element's value back to `""`
    via `IJSRuntime`. Read the selection from `Value` (still two-way
    bindable via `@bind-Value`) or from `data-theme` on the document
    root — never from the `<select>` element.

  Everything downstream is unchanged: the managed `<link>` swap,
  `data-theme`, `localStorage` persistence, `OnChange` /
  `ValueChanged`, and initial-value resolution all behave as before.

##### Added

- `Placeholder` parameter (`string?`, defaults to `Label`) — the text
  of the always-displayed placeholder option. Like every other
  user-facing string in this package it is consumer-supplied, so no
  hardcoded English is emitted.
- New `.theme-chooser-placeholder` class hook, and a width recipe
  (`field-sizing: content` with a `max-width` fallback) in
  [`docs/styling.md`](docs/styling.md).

##### Accessibility

- Documented tradeoff: because the closed control always reads the
  placeholder, screen-reader users no longer hear the active theme
  announced as the combobox value. Consumers who need it announced
  should surface the active theme in visible text or a polite live
  region — see [`docs/accessibility.md`](docs/accessibility.md).

##### Added (examples & docs)

- The compensating status region is now the **default pattern**, not a
  suggestion: the basic example and the `index.md` quick-start both ship
  a visible `<p class="theme-chooser-status" aria-live="polite">` showing
  the active theme. `aria-live="polite"` announces mutations only, so it
  stays silent on first paint and speaks on each change.
  `docs/accessibility.md` reframes opting *out* as the deliberate choice
  and keeps an explicit "what this does and does not fix" note — the
  region announces transitions, it does not restore combobox value
  semantics.

#### 0.2.0 — 2026-07-03

##### Changed (BREAKING)

- Migrated from the radio-group "picker" rendering to a native
  `<select>` (landed in-tree 2026-06-17): the root element is now
  `<select class="theme-chooser">` with one `<option class="theme-chooser-option">`
  per choice, replacing the former `<fieldset role="radiogroup">` with
  `<input type="radio">` children. The package was renamed from the
  `*-picker` name to `*-select` accordingly.
- Class-hook contract changed: `theme-chooser` now names the `<select>` root
  and `theme-chooser-option` is the only sub-class; the radio/label sub-class
  hooks are gone.
- Keyboard interaction is the native `<select>` contract (Arrow keys,
  Home / End, first-letter typeahead) instead of radio-group cycling.
- Custom rendering (snippet / render prop / slot / template) now renders
  `<option>` elements inside the `<select>`.

##### Unchanged

- The behaviour contract: DOM application (`data-theme` + managed `<link>` swap), optional
  `localStorage` persistence, SSR safety, and the no-hardcoded-strings
  i18n rule are as in 0.1.0.

#### 0.1.0 — 2026-06-05

Initial release.

##### Added

- `ThemeChooser.razor` + `ThemeChooser.razor.cs` — partial-class Blazor
  component in namespace `LilyDesignSystem.Blazor.Helpers`. Implements
  the full Svelte canonical contract:
  - Renders `<select aria-label="…" name="…">` with one `<option>`
    per theme slug.
  - Manages a single
    `<link rel="stylesheet" data-lily-theme-chooser="{Name}">` in
    `document.head` and swaps its `href` on each apply via
    `IJSRuntime.InvokeVoidAsync("eval", …)`.
  - Sets `data-theme="{slug}"` on `document.documentElement`.
  - Optional `StorageKey` persistence to `localStorage` with
    private-mode-safe try/catch.
  - Two-way binding via `@bind-Value`.
  - `OnChange` `EventCallback<string>` for post-apply side effects.
  - `RenderFragment<ThemeChooserContext>` for custom rendering with
    `{ Themes, Value, SetTheme, Name, LabelFor }`.
  - `[Parameter(CaptureUnmatchedValues = true)] AdditionalAttributes`
    for attribute spread (`@attributes="AdditionalAttributes"`).
- `ThemeChooser.NormaliseThemesUrl`, `ThemeChooser.ThemeHref` — public
  static helpers for URL construction.
- `ThemeChooser.BuildApplyScript` — `internal static` for tests.
- `ThemeChooserTests.cs` — bUnit + xUnit suite asserting every
  numbered acceptance criterion in `spec/index.md` §7 (13 items).
- `spec/index.md` — spec-driven contract, version 0.1.0.
- `AGENTS/` subdirectory with `api.md`, `lifecycle.md`,
  `accessibility.md`, `testing.md`, `ssr.md`.
- `docs/` subdirectory with topic guides: `accessibility.md`,
  `custom-rendering.md`, `preloading.md`, `parameters-reference.md`,
  `recipes.md`, `ssr.md`, `styling.md`, `troubleshooting.md`.
- `examples/` subdirectory: `Basic.razor`, `TwoWayBinding.razor`,
  `Persistence.razor`, `CustomLabels.razor`, `CustomRendering.razor`,
  `Preloaded.razor`, `MultipleSelects.razor`, `SystemPreference.razor`,
  `LilyThemes.razor`, plus `BlazorServerCookie/` with `App.razor`,
  `SettingsPage.razor`, and a `Program.snippet.cs` outline.

##### Conventions

- Blazor 10 / .NET 10, `Nullable enable`, `ImplicitUsings enable`.
- Partial class split between `.razor` and `.razor.cs`.
- Namespace: `LilyDesignSystem.Blazor.Helpers`.
- `[Parameter, EditorRequired]` for required parameters.
- `EventCallback<T>` for events; `{Name}` + `{Name}Changed` for
  `@bind-{Name}`.
- `RenderFragment<TContext>` for custom rendering.
- All DOM writes go through `IJSRuntime` inside
  `OnAfterRenderAsync` so the component is SSR / prerender safe.
- Tested under bUnit + xUnit.

##### Parity

This is a direct port of the Svelte canonical
`lily-design-system-svelte-theme-chooser` v0.1.0. The DOM contract,
managed-link discriminator, initial-value resolution, and apply
order match clause-for-clause.

##### Notes

- The `onChange` callback prop from the Svelte canonical maps to the
  `OnChange` Blazor `EventCallback<string>`. Use
  `OnChange="HandlerMethod"` in markup.
- The `children` snippet from Svelte maps to the
  `ChildContent` `RenderFragment<ThemeChooserContext>` in Blazor.
  Use `<ChildContent Context="ctx">` in consumer markup.
- The bindable model name is `Value`, accessed via `@bind-Value`.
- The select requires an interactive render mode
  (`InteractiveServer`, `InteractiveWebAssembly`, or
  `InteractiveAuto`) for its `OnAfterRenderAsync` lifecycle hook to
  fire. Static SSR renders the markup but doesn't mutate the DOM.

[Unreleased]: https://github.com/lilydesignsystem/lily-design-system
[0.3.0]: https://github.com/lilydesignsystem/lily-design-system
[0.1.0]: https://github.com/lilydesignsystem/lily-design-system
