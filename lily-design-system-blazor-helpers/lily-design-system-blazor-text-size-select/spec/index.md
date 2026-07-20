# TextSizeSelect — Specification (Blazor)

Single source of truth for the
`lily-design-system-blazor-text-size-select` Blazor helper. This file
drives implementation, testing, and documentation in the
spec-driven-development style: anything not in this spec is out of
scope; anything in this spec must be exercised by a test.

This is a one-to-one port of the canonical Svelte helper
`lily-design-system-svelte-text-size-select`; when the two disagree,
the Svelte side wins and the Blazor side is patched.

Sibling files in this directory:

- `TextSizeSelect.razor` — Razor markup
- `TextSizeSelect.razor.cs` — C# code-behind (partial class)
- `TextSizeSelectTests.cs` — bUnit + xUnit spec exercising every clause in §4–§7
- `index.md` — user-facing readme
- `docs/` — accessibility and styling guides
- `examples/` — copy-pasteable Razor snippets

The Blazor headless library does not include a canonical
`TextSizeSelect`; this helper is the opinionated, reusable counterpart
that owns the text-size-application lifecycle (the `data-text-size`
attribute on the document root) and the persistence choice.

---

## 1. Goal

Give a Blazor application a drop-in, headless text-size select that:

1. Renders an **icon button that opens a dropdown listbox** of the
   available text-size slugs, built to the WAI-ARIA APG listbox
   pattern.
2. **Applies the chosen size** by setting `data-text-size="{slug}"` on
   the document root.
3. Optionally persists the chosen size to `localStorage` so the choice
   survives reload.
4. Ships zero CSS — the consumer styles every visual aspect via the
   `text-size-select`, `text-size-select-button`, `text-size-select-icon`,
   `text-size-select-list`, and `text-size-select-option` class hooks,
   and maps each `[data-text-size="{slug}"]` to real typography.

## 2. Non-goals

- **Typography**. This component does not declare `font-size` or a
  type scale. It only signals the chosen slug via `data-text-size`,
  the `OnChange` callback, and the bindable `Value`. The CSS that maps
  a slug to a size is the consumer's job.
- **Picking default sizes**. The consumer always supplies the list of
  available size slugs.
- **Detecting an OS preference.** There is no "preferred text size"
  media query equivalent to `prefers-color-scheme` or
  `navigator.languages`, so this helper deliberately ships **no**
  `DetectFromSystem` parameter. Users who scale text at the OS level
  are already served by the browser's own zoom / minimum-font-size,
  which this helper must not fight.
- **`lang` / `dir`**. Out of scope here — see `LocaleSelect`.
- **A `<link>` swap**. No managed stylesheet element is created — see
  `ThemeSelect`.

## 3. Architectural decisions

- **`data-text-size` on the document root is the source of truth.**
  Consumer CSS keys off `[data-text-size="{slug}"]`.
- **Icon button plus a custom listbox, not a native `<select>`.** This
  matches `ThemeSelect` and `LocaleSelect`, so all three helpers are one
  shape. The tradeoffs are stated plainly in
  [`docs/accessibility.md`](../docs/accessibility.md).
- **The button glyph is `"A"` (U+0041 LATIN CAPITAL LETTER A).** A
  letter, not a pictograph: U+1F5DB DECREASE FONT SIZE SYMBOL has no
  real glyph in common font stacks and means *decrease* rather than
  *size*, whereas "A" renders in the page's own font everywhere, stays
  monochrome like `◑`, and is the conventional text-size affordance.
- **A hidden `<input>` preserves form participation.** The listbox is
  not a form control, so `Name` / `Value` ride a hidden input.
- **Ids come from a monotonic process-wide counter**
  (`text-size-select-{n}`) — stable and SSR-safe, never `Random` or a
  clock read.
- **`IJSRuntime` for all DOM writes.** The `data-text-size` attribute
  is set via `IJSRuntime.InvokeVoidAsync("eval", …)`.
- **SSR-safe**. No DOM access occurs before `OnAfterRenderAsync`.

## 4. Public API

### 4.1 Parameters

| Parameter             | Type                                     | Required | Default                                | Purpose |
| --------------------- | ---------------------------------------- | -------- | -------------------------------------- | ------- |
| `Label`               | `string`                                 | yes      | —                                      | Accessible name for the button **and** the listbox. |
| `Sizes`               | `IReadOnlyList<string>`                  | yes      | —                                      | Available size slugs. |
| `Value`               | `string`                                 | no       | `""`                                   | Currently selected size slug. Two-way bindable via `@bind-Value`. |
| `ValueChanged`        | `EventCallback<string>`                  | no       | —                                      | Two-way binding callback. |
| `DefaultValue`        | `string?`                                | no       | `"medium"` if present, else `Sizes[0]` | Initial size when nothing else is supplied. |
| `StorageKey`          | `string?`                                | no       | `null`                                 | If set, persist selection to `localStorage`. |
| `Name`                | `string`                                 | no       | `"text-size"`                          | `name` set on the hidden `<input>`. |
| `SizeLabels`          | `IReadOnlyDictionary<string,string>`     | no       | empty                                  | Optional pretty labels per size slug. |
| `ChildContent`        | `RenderFragment<TextSizeSelectContext>?` | no       | the `"A"` glyph                        | **Replaces the glyph inside the button.** It does not render options. |
| `OnChange`            | `EventCallback<string>`                  | no       | —                                      | Fires after the control applies a new size. |
| `CssClass`            | `string`                                 | no       | `""`                                   | Extra CSS class merged into the root `<div>`. |
| `AdditionalAttributes`| `Dictionary<string,object>?`             | no       | —                                      | Captures unmatched attributes; spread onto the root `<div>`. |

### 4.2 `TextSizeSelectContext`

`ChildContent` replaces the glyph, so the context is narrowed to what a
glyph needs. Options are component-owned and cannot be overridden — the
listbox semantics therefore cannot be broken by a consumer.

```csharp
public sealed class TextSizeSelectContext
{
    public required string Value { get; init; }
    public required bool Open { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}
```

### 4.3 Statics

- `TextSizeSelect.LatinCapitalLetterA` — the default glyph `"A"`
  (U+0041).
- `TextSizeSelect.SizeName(string slug)` — the ONE title-casing rule
  (`"x-large"` → `"X Large"`). The private instance `LabelFor`
  delegates to it, so consumers rendering their own UI never duplicate
  it. Mirrors `ThemeSelect.ThemeName` and `Locales.LocaleName`.
- `TextSizeSelect.SetSizeAsync(string slug)` — apply a size
  imperatively via a `@ref`.

### 4.4 DOM contract

```html
<div class="text-size-select {CssClass}" ...AdditionalAttributes>
  <input type="hidden" name="{Name}" value="{Value}" />
  <button type="button" class="text-size-select-button"
          aria-label="{Label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="text-size-select-icon" aria-hidden="true">A</span>
  </button>
  <ul class="text-size-select-list" id="{listId}" role="listbox"
      aria-label="{Label}" tabindex="-1" hidden
      aria-activedescendant="{active option id, only while open}">
    <li class="text-size-select-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>Medium</li>
  </ul>
</div>
```

`data-text-size="{slug}"` is set on `document.documentElement` via JS
interop on every apply.

## 5. Behaviour

### 5.1 Initial value resolution

On first `OnAfterRenderAsync(firstRender: true)`, the initial size is
the first non-empty value of:

1. `Value` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(StorageKey)` (only if `StorageKey` is set).
3. `DefaultValue`.
4. `"medium"` if present in `Sizes`, else `Sizes[0]`.
5. `""` (no apply happens — the control waits for user interaction).

There is no detection step: see §2.

### 5.2 Labels

`LabelFor(slug)` returns `SizeLabels[slug]` if present, else
`SizeName(slug)` — the slug title-cased per hyphen-word (`x-large` →
`X Large`).

### 5.3 Applying a size

Applying a size `slug` performs, in order:

1. Set `data-text-size="{slug}"` on `document.documentElement`.
2. If `StorageKey` is set, write `slug` to `localStorage` inside a
   try/catch.
3. Invoke `OnChange` and `ValueChanged` with the chosen slug.

### 5.4 Keyboard (WAI-ARIA APG listbox)

On the **button**:

| Key                 | Action                                                 |
| ------------------- | ------------------------------------------------------ |
| `Tab` / `Shift+Tab` | Move focus to / away from the button (one stop).       |
| `Arrow Down`        | Open, active option = the selected one (else index 0). |
| `Enter` / `Space`   | Open, active option = the selected one (else index 0). |
| `Arrow Up`          | Open with the **last** option active.                  |

Opening moves focus to the `<ul>`; the cursor is carried by
`aria-activedescendant` and mirrored onto the active `<li>` as
`data-active`.

On the **listbox**:

| Key               | Action                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `Arrow Down`      | Move the active option down one; **clamps** at the last (no wrap).     |
| `Arrow Up`        | Move the active option up one; **clamps** at the first (no wrap).      |
| `Home`            | Jump to the first option.                                              |
| `End`             | Jump to the last option.                                               |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape`          | Close and return focus **without** changing the value.                 |
| `Tab`             | Close **without** stealing focus back.                                 |
| Printable chars   | Typeahead over the option *labels*, 500 ms buffer reset.               |

Clicking an option selects it; focus leaving the root closes the
listbox without changing the value.

### 5.5 Prerender / SSR

During static SSR or Blazor Server prerender, no JS interop is
attempted and no DOM is touched. Focus moves are deferred to
`OnAfterRenderAsync` — the `<ul>` cannot take focus while it still
carries `hidden`.

### 5.6 Blazor deviations from the canonical Svelte implementation

Two clauses of the canonical keyboard contract could not be implemented
identically. Both are shared with `ThemeSelect` and `LocaleSelect`.

- **No `preventDefault` on keydown.** Blazor evaluates
  `@onkeydown:preventDefault` at render time, not per event, so it
  cannot be applied to the arrow keys while sparing `Tab` (suppressing
  `Tab` would trap focus). A `_suppressNextClick` flag instead stops the
  click a `<button>` synthesises for `Enter` / `Space` from toggling the
  listbox a second time.
- **No document-level click listener.** This package ships no
  JavaScript, so the root's `focusout` closes the listbox instead of an
  outside-click listener. Blazor's `FocusEventArgs` has no
  `relatedTarget`, so the component flags focus moves it makes itself
  and ignores the matching `focusout`.

`@onmousedown:preventDefault` **is** applied to the `<ul>`, so clicking
an option does not blur the listbox before the click handler runs.

## 6. Accessibility

- WCAG 2.2 AAA target; directly supports 1.4.4 (Resize Text).
- WAI-ARIA APG listbox pattern with `aria-activedescendant`; focus
  stays on the `<ul>` while open.
- `aria-label` is the button's **entire** accessible name — the button
  is icon-only and the glyph is `aria-hidden="true"`.
- Option labels default to title-cased slugs; the component emits no
  hardcoded natural-language strings.
- Known tradeoffs (icon-only naming, custom-listbox AT support, glyph
  font coverage) are documented in
  [`docs/accessibility.md`](../docs/accessibility.md).

## 7. Testing acceptance criteria

`TextSizeSelectTests.cs` must assert every numbered item below, one
`[Fact]` per clause. Tests run under bUnit + xUnit.

### Markup contract

1. §7.1 — The root is a `<div class="text-size-select">` containing a
   `<button type="button" class="text-size-select-button">` with
   `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`
   pointing at a `<ul role="listbox" tabindex="-1">`. No `<select>`.
2. §7.2 — The button renders the `"A"` glyph in
   `span.text-size-select-icon` with `aria-hidden="true"`, and
   `LatinCapitalLetterA` is `"A"`.
3. §7.3 — `aria-label` equals `Label` on both the button and the list.
4. §7.4 — One `<li role="option">` per size; the hidden input carries
   `Name` (default `"text-size"`) and the resolved `Value`.
5. §7.5 — The `<ul>` is `hidden` until the button is activated;
   `aria-expanded` tracks the open state and toggling closes it.
6. §7.6 — Exactly one option is `aria-selected="true"`; while open,
   `aria-activedescendant` points at the active option, which also
   carries `data-active`; while closed there is no
   `aria-activedescendant`.
7. §7.7 — Default labels title-case the slug (`x-large` → `X Large`);
   `SizeLabels` overrides.
8. §7.8 — List and option ids are stable across re-render and unique
   across instances, prefixed `text-size-select-`.

### Keyboard contract

9. §7.9 — `ArrowDown`, `Enter` and `Space` on the button open the
   listbox with the selected option active.
10. §7.10 — `ArrowUp` on the button opens with the **last** option
    active.
11. §7.11 — Arrows move the active option and **clamp** at both ends.
12. §7.12 — `Home` / `End` jump to the first / last option.
13. §7.13 — `Enter` selects the active option, applies it, and closes;
    `Space` behaves identically.
14. §7.14 — `Escape` closes without changing the value or applying.
15. §7.15 — Printable characters run a typeahead over the labels.
16. §7.16 — Clicking an option selects it, applies it, and closes.
17. §7.17 — Focus leaving the root closes the listbox without changing
    the value.

### Application and lifecycle

18. §7.18 — Initial value resolves to `"medium"` if present, else
    `Sizes[0]`, and `ValueChanged` fires with it.
19. §7.19 — `data-text-size` is applied on first render;
    `BuildApplyScript` embeds the slug.
20. §7.20 — When `StorageKey` is set, the apply script writes to
    `localStorage`; without it there is no `setItem`.
21. §7.21 — An explicit `Value` wins over storage and defaults.
22. §7.22 — `SizeName` is the single public title-casing rule and the
    rendered labels come from it; `SizeLabels` still overrides.

### Spread and custom rendering

23. §7.23 — Extra attributes captured by `AdditionalAttributes` spread
    onto the root `<div>`.
24. §7.24 — `ChildContent` **replaces** the glyph inside the button and
    receives `Value`, `Open`, and `LabelFor`.

## 8. Out-of-scope (future, not implemented here)

- A complementary `TextSizeView` helper.
- A `DetectFromSystem` parameter — see §2, there is nothing to detect.

## 9. Tracking

- Package directory:
  `lily-design-system-blazor-helpers/lily-design-system-blazor-text-size-select/`
- Spec version: 0.1.0
- Created: 2026-06-17
- Updated: 2026-07-20
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
- Canonical contract:
  [`../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md`](../../../lily-design-system-svelte-helpers/lily-design-system-svelte-text-size-select/spec/index.md)

---

Lily™ and Lily Design System™ are trademarks.
