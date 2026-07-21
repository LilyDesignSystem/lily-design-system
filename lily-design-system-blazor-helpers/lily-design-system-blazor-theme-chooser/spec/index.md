# ThemeChooser — Specification (Blazor)

Single source of truth for the `lily-design-system-blazor-theme-chooser`
Blazor helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `ThemeChooser.razor` — Razor markup
- `ThemeChooser.razor.cs` — C# code-behind (partial class)
- `ThemeChooserTests.cs` — bUnit + xUnit spec exercising every clause in §4–§7
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-blazor-headless/.../ThemeChooser.razor`) is a pure
container. This helper is the opinionated, reusable counterpart that
owns the dynamic loading lifecycle.

The canonical cross-framework reference is
`lily-design-system-svelte-helpers/lily-design-system-svelte-theme-chooser`;
where the two disagree, the Svelte side wins.

---

## 1. Goal

Give a Blazor application a drop-in, headless theme select that:

1. Renders an accessible icon button that opens a dropdown listbox of
   available themes (WAI-ARIA APG listbox pattern).
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the choice
   survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-chooser` class hook.

## 2. Non-goals

- Bundling theme CSS files inside the component. Themes are author-owned
  static assets the consumer drops into their `wwwroot/` directory.
- Auto-discovering themes via directory listing. The consumer always
  supplies the list of available theme slugs.
- Providing colour, spacing, or typography values. Theme tokens live
  inside each theme CSS file.
- A `ThemeProvider` style wrapper. Theme application happens at the
  document root, not in a wrapping element.
- Blazor-Server-only or WebAssembly-only features. The component runs
  in both hosting models and is safe under static SSR (no DOM is
  touched until `OnAfterRenderAsync`).

## 3. Architectural decisions

- **One `<link>` per select name.** Switching themes mutates `href` on
  a single `<link rel="stylesheet" data-lily-theme-chooser="{Name}">`.
  Only the active theme is fetched; previously-active CSS is unloaded
  when the href changes. Multiple selects can coexist by passing
  distinct `Name` parameters.
- **`data-theme` attribute is the activation switch.** Theme CSS files
  scope their `:root[data-theme="slug"]` rules so that authors can
  preload multiple themes and switch between them with only the
  attribute change.
- **`IJSRuntime` for all DOM writes.** Blazor cannot mutate
  `document.head` directly; the component issues `eval`-equivalent
  module calls through `IJSRuntime.InvokeVoidAsync`.
- **SSR-safe.** No DOM access occurs before `OnAfterRenderAsync`. The
  component renders its markup during prerender; the link swap and
  `data-theme` set only happen client-side after the first interactive
  render.
- **Two-way bindable `Value`.** Consumers can `@bind-Value` to the
  selected theme slug. The component is fully controlled when `Value`
  is provided as a non-empty string.

## 4. Public API

### 4.1 Parameters

| Parameter      | Type                                | Required | Default                       | Purpose |
| -------------- | ----------------------------------- | -------- | ----------------------------- | ------- |
| `Label`        | `string`                            | yes      | —                             | Accessible name for the button AND the listbox. The button is icon-only, so this is its entire accessible name. |
| `ThemesUrl`    | `string`                            | yes      | —                             | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `Themes`       | `IReadOnlyList<string>`             | yes      | —                             | Available theme slugs. |
| `Value`        | `string`                            | no       | `""`                          | Currently selected theme slug. Two-way bindable via `@bind-Value`. |
| `ValueChanged` | `EventCallback<string>`             | no       | —                             | Fires when the selected slug changes. |
| `DefaultValue` | `string?`                           | no       | `"light"` if present, else `Themes[0]` | Initial theme when nothing else is supplied. |
| `StorageKey`   | `string?`                           | no       | `null`                        | If set, persist selection to `localStorage` under this key. |
| `DetectFromSystem` | `bool`                          | no       | `false`                       | Resolve `prefers-color-scheme` to a supported theme on first visit. Mirrors `DetectFromNavigator` on LocaleChooser. |
| `Name`         | `string`                            | no       | `"theme"`                     | `name` on the hidden input AND the `data-lily-theme-chooser` discriminator on the managed `<link>`. |
| `Extension`    | `string`                            | no       | `".css"`                      | File extension appended to each slug when constructing the URL. |
| `ThemeLabels`  | `IReadOnlyDictionary<string,string>`| no       | empty                         | Optional pretty labels per slug. |
| `ChildContent` | `RenderFragment<ThemeChooserContext>?`| no      | the default glyph             | **Replaces the glyph inside the button.** It does not render options. |
| `OnChange`     | `EventCallback<string>`             | no       | —                             | Fires after the control applies a new theme. Mirrors `ValueChanged`. |
| `CssClass`     | `string`                            | no       | `""`                          | Extra CSS class merged into the root `<div>`. |
| `AdditionalAttributes` | `Dictionary<string,object>?`| no       | —                             | Captures all unmatched attributes; spread onto the root `<div>`. |

There is **no `Placeholder` parameter**. It existed only to pin a native
`<select>`'s closed display; there is no `<select>` any more.

`ThemeChooserContext` shape — mirrors the canonical Svelte `ChildArgs`:

```csharp
public sealed class ThemeChooserContext
{
    /// Currently selected theme slug.
    public required string Value { get; init; }
    /// Is the listbox open?
    public required bool Open { get; init; }
    /// Resolve a slug to its display label.
    public required Func<string, string> LabelFor { get; init; }
}
```

Public constant: `ThemeChooser.CircleWithRightHalfBlack` — the default
glyph, `"◑"` (U+25D1, `&#9681;`).

Public method: `Task SetThemeAsync(string slug)` — apply a theme
imperatively, for consumers driving the control from their own UI.

### 4.2 DOM contract

The control is an icon button plus a dropdown listbox:

```html
<div class="theme-chooser {CssClass}" ...AdditionalAttributes>
  <input type="hidden" name="{Name}" value="{Value}" />
  <button type="button" class="theme-chooser-button"
          aria-label="{Label}" aria-haspopup="listbox"
          aria-expanded="false" aria-controls="{listId}">
    <span class="theme-chooser-icon" aria-hidden="true">&#9681;</span>
  </button>
  <ul class="theme-chooser-list" id="{listId}" role="listbox"
      aria-label="{Label}" tabindex="-1" hidden
      aria-activedescendant="{optionId of active, only while open}">
    <li class="theme-chooser-option" id="{optionId}" role="option"
        aria-selected="true|false" data-active>{LabelFor(slug)}</li>
  </ul>
</div>
```

- The root is a `<div>` carrying the `theme-chooser` class hook plus
  `CssClass`; `AdditionalAttributes` spread onto it.
- The glyph is `◑` (U+25D1 CIRCLE WITH RIGHT HALF BLACK, `&#9681;`),
  wrapped in `aria-hidden="true"`. The accessible name comes from the
  button's `aria-label` — never from the glyph.
- `ChildContent` **replaces the glyph inside the button** and receives
  `{ Value, Open, LabelFor }`. It no longer renders options.
- The hidden input preserves form participation and the `Name`
  parameter. `Name` ALSO still discriminates the managed
  `<link data-lily-theme-chooser="{Name}">`.
- `hidden` is present on the `<ul>` while closed and absent while open;
  `aria-expanded` on the button tracks the same state.
- `aria-activedescendant` is emitted only while open and only when it
  points at a real option. The active option additionally carries a
  `data-active` attribute as a styling hook.
- Option ids are `{instance}-option-{index}` and the list id is
  `{instance}-list`, where `{instance}` is `theme-chooser-{n}` from a
  monotonic process-wide counter. Stable and SSR-safe — never
  `Random` or a clock read.
- `LabelFor(slug)` returns `ThemeLabels[slug]` when supplied; otherwise
  each hyphen-separated word of the slug title-cased. The control never
  emits the word "default".
- There is no `<select>`, no placeholder option, and no snap-back
  interop write. The real selection lives in `Value`, which remains
  two-way bindable.
- A single managed
  `<link rel="stylesheet" data-lily-theme-chooser="{Name}">` in
  `document.head`. Created on first apply, reused thereafter.
- `data-theme="{slug}"` is set on `document.documentElement` on every
  apply.

## 5. Behaviour

### 5.1 URL construction

For a theme slug `slug`, the loaded URL is exactly:

```
Normalise(ThemesUrl) + slug + Extension
```

`Normalise` ensures exactly one trailing `/`. The component does not
URL-encode the slug; consumers must pick slugs that are safe URL path
segments (kebab-case ASCII is recommended).

### 5.2 Initial value resolution

On first `OnAfterRenderAsync(firstRender: true)` in the browser, the
initial theme is the first non-empty value of:

1. `Value` (if a consumer supplied a non-empty string).
2. `localStorage.getItem(StorageKey)` (only if `StorageKey` is set and
   the read does not throw).
3. `DefaultValue`.
4. `"light"` if present in `Themes`, else `Themes[0]`.
5. `""` (no apply happens — the select waits for user interaction).

Resolution writes back to `Value` via the `ValueChanged` callback so
consumers `@bind-Value`-ing the variable see the resolved value.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-chooser="{Name}"`).
2. Set `link.href = Normalise(ThemesUrl) + slug + Extension`.
3. Set `data-theme="{slug}"` on `document.documentElement`.
4. If `StorageKey` is set, write the slug to `localStorage` inside a
   try/catch (so private-mode / quota errors are silently swallowed).
5. Invoke `OnChange` and `ValueChanged` with the new slug.

All four DOM-touching steps are performed by a tiny JavaScript helper
invoked via `IJSRuntime.InvokeVoidAsync("eval", script)`.

### 5.4 Reactivity

Parameter changes that alter `Value` re-trigger the apply effect.
Other parameter changes (`ThemesUrl`, `Extension`, `Name`) take effect
on the next theme change, not retroactively.

### 5.5 Prerender / SSR

During static SSR or Blazor Server prerender, no JS interop is
attempted and no DOM is touched. The markup renders with the
consumer-supplied `Value` (if any). The apply step runs on the first
`OnAfterRenderAsync(true)` after the component becomes interactive.

## 6. Accessibility

### 6.1 Roles and properties

- The `<button type="button">` is the trigger. It carries
  `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`
  pointing at the list id.
- `aria-label={Label}` supplies the accessible name for the button and
  the listbox. The button is icon-only, so `Label` is load-bearing:
  without it the control is unnameable.
- The `<ul role="listbox" tabindex="-1">` receives focus while open;
  the active option is conveyed by `aria-activedescendant`, per the
  APG listbox pattern (focus stays on the list, not on the options).
- Each `<li role="option">` carries `aria-selected`. Exactly one option
  is `aria-selected="true"` whenever `Value` matches a slug.
- The glyph is `aria-hidden="true"` and never contributes to the name.
- `name={Name}` is carried by the hidden input, not by an ARIA
  attribute.

### 6.2 Keyboard contract

Implemented by the component, following the WAI-ARIA APG listbox
pattern.

On the **button**:

| Key                        | Action                                                   |
| -------------------------- | -------------------------------------------------------- |
| `Tab` / `Shift+Tab`        | Move focus to / away from the button (one stop).         |
| `Arrow Down`               | Open, active option = the selected one (else index 0).   |
| `Enter` / `Space`          | Open, active option = the selected one (else index 0).   |
| `Arrow Up`                 | Open with the **last** option active.                    |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key             | Action                                                              |
| --------------- | ------------------------------------------------------------------- |
| `Arrow Down`    | Move the active option down one; **clamps** at the last (no wrap).  |
| `Arrow Up`      | Move the active option up one; **clamps** at the first (no wrap).   |
| `Home`          | Jump to the first option.                                           |
| `End`           | Jump to the last option.                                            |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape`        | Close and return focus **without** changing the value.              |
| `Tab`           | Close **without** stealing focus back.                              |
| Printable chars | Typeahead over the option *labels*, 500 ms buffer reset.            |

Pointer and focus:

- Clicking an option selects it, applies it, and closes.
- Focus leaving the root closes the listbox without changing the value.

### 6.4 Framework deviations

Two clauses cannot be met faithfully with Blazor's declarative event
bindings; both are behavioural refinements, not contract breaks.

- **No `preventDefault` on keydown.** Blazor evaluates
  `@onkeydown:preventDefault` at render time, not per event, so it
  cannot be applied to arrow keys while leaving `Tab` alone. Arrow keys
  and `Space` therefore also scroll the page in their default way. To
  keep `Enter` / `Space` from toggling the listbox twice (a `<button>`
  synthesises a click for both), the component swallows the click that
  follows a keydown it already handled.
- **No document-level click listener.** The Svelte reference closes on
  any outside click via `<svelte:document onclick>`. Blazor has no
  declarative equivalent and this package ships no JavaScript, so
  closing on outside interaction is driven by the root's `focusout`
  instead. Because Blazor's `FocusEventArgs` does not expose
  `relatedTarget`, the component flags focus moves it makes itself and
  ignores the matching `focusout`.

`@onmousedown:preventDefault` **is** applied to the `<ul>`: that one is
unconditional and correct, and it stops a click on an option from
blurring the listbox before the click handler runs.

### 6.3 Internationalisation

- `Label` and entries of `ThemeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

## 7. Testing acceptance criteria

`ThemeChooserTests.cs` must assert every numbered item below. Tests
run under bUnit + xUnit.

**Markup contract**

1. The root is a `<div class="theme-chooser">` containing a
   `<button type="button" class="theme-chooser-button">` with
   `aria-haspopup="listbox"`, `aria-expanded="false"`, and
   `aria-controls` pointing at a `<ul role="listbox" tabindex="-1">`.
   No `<select>` is rendered.
2. The button renders `<span class="theme-chooser-icon"
   aria-hidden="true">◑</span>` (U+25D1), matching the public
   `ThemeChooser.CircleWithRightHalfBlack` constant.
3. `aria-label` is the supplied `Label` on BOTH the button and the
   listbox.
4. One `<li class="theme-chooser-option" role="option">` per entry in
   `Themes`; the hidden input carries the supplied `Name` and the
   resolved `Value`.
5. The listbox carries `hidden` until the button is activated;
   activating toggles both `hidden` and `aria-expanded`.
6. Exactly one option is `aria-selected="true"` — the active theme.
   While closed there is no `aria-activedescendant`; opening points it
   at the active option, which also carries `data-active`.
7. The default rendering shows `ThemeLabels[slug]` when supplied, or
   each hyphen-separated word title-cased otherwise (`"light"` →
   `"Light"`). The word `"default"` never appears in an option label.
8. List and option ids are stable across re-render and unique across
   instances, prefixed `theme-chooser-`.

**Keyboard contract (WAI-ARIA APG listbox)**

9. `ArrowDown`, `Enter` and `Space` on the button each open the listbox
   with the currently-selected option active.
10. `ArrowUp` on the button opens with the **last** option active.
11. `ArrowDown` / `ArrowUp` inside the listbox move the active option
    and **clamp** at both ends (no wrapping).
12. `Home` / `End` jump to the first / last option.
13. `Enter` and `Space` inside the listbox select the active option,
    apply it, and close the listbox.
14. `Escape` closes the listbox **without** changing the value and
    without applying anything.
15. Printable characters run a typeahead over the option labels; a
    buffer that matches nothing leaves the active option unmoved.
16. Clicking an option selects it, applies it, and closes the listbox.
17. Focus leaving the root closes the listbox without changing the
    value.

**Dynamic loading and lifecycle**

18. After the first render, the resolved initial value is `"light"`
    when present in `Themes`, otherwise `Themes[0]`, and `ValueChanged`
    fires with that value.
19. After the first render, the JS interop call is invoked with the
    constructed href
    `${Normalise(ThemesUrl)}${initial}${Extension}`.
20. When `StorageKey` is set, the apply script carries the storage key;
    when it is not set, the script contains no `localStorage` write.
    The managed `<link>` selector is discriminated by `Name`.
21. When `Value` is supplied as a non-empty parameter, the
    initial-value resolution skips storage, detection, and defaults.
    The public `ThemeName(slug)` static is the ONE title-casing rule —
    the instance label resolution delegates to it, and `ThemeLabels`
    still overrides it.
22. When `ThemesUrl` does not end with `/`, the constructed URL still
    has exactly one `/` between the directory and the slug.

**Spread and custom rendering**

23. Extra attributes captured by `AdditionalAttributes` spread through
    onto the root `<div>` (e.g. `data-testid`).
24. A custom `ChildContent` render fragment **replaces** the glyph
    inside the button (the default `.theme-chooser-icon` is absent) and
    receives `Value`, `Open`, and `LabelFor`.

**System-preference detection**

25. The pure `MatchSystemTheme(bool? prefersDark, themes)` helper
    resolves `"dark"` when `prefersDark` is true and `"dark"` is in
    `themes`, `"light"` when it is false and `"light"` is in `themes`,
    `""` when the resolved slug is not in `themes`, and `""` when
    `prefersDark` is null (matchMedia unavailable — prerender / static
    SSR / a host without the API). With `DetectFromSystem` set, the
    probe result resolves the initial theme; `StorageKey` and a
    non-empty `Value` both still beat it; and with `DetectFromSystem`
    unset the media query is never probed.

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme.
- A live `prefers-color-scheme` subscription. First-visit detection
  shipped as `DetectFromSystem` (§4, §7.25); re-theming a page when the
  OS flips *while the tab is open* is deliberately not implemented,
  because it would fight a selection the user made by hand. Consumers
  who want it can add a listener and call `SetThemeAsync`.
- A non-`<link>` loader that injects a `<style>` block.
- A `Preload` parameter that adds `<link rel="preload" as="style">`
  tags for every available theme.

## 9. Tracking

- Package directory:
  `lily-design-system-blazor-helpers/lily-design-system-blazor-theme-chooser/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
