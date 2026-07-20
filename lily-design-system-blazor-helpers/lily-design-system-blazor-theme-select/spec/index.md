# ThemeSelect — Specification (Blazor)

Single source of truth for the `lily-design-system-blazor-theme-select`
Blazor helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `ThemeSelect.razor` — Razor markup
- `ThemeSelect.razor.cs` — C# code-behind (partial class)
- `ThemeSelectTests.cs` — bUnit + xUnit spec exercising every clause in §4–§7
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-blazor-headless/.../ThemeSelect.razor`) is a pure
container — `<select>` + `ChildContent`. This helper is the
opinionated, reusable counterpart that owns the dynamic loading
lifecycle.

---

## 1. Goal

Give a Blazor application a drop-in, headless theme select that:

1. Renders an accessible `<select>` of available themes.
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the choice
   survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-select` class hook.

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
  a single `<link rel="stylesheet" data-lily-theme-select="{Name}">`.
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
| `Label`        | `string`                            | yes      | —                             | Accessible name for the select. |
| `Placeholder`  | `string?`                           | no       | `Label`                       | Text of the always-displayed placeholder option. The closed `<select>` shows this instead of the selected theme name, so the control stays as narrow as this word. |
| `ThemesUrl`    | `string`                            | yes      | —                             | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `Themes`       | `IReadOnlyList<string>`             | yes      | —                             | Available theme slugs. |
| `Value`        | `string`                            | no       | `""`                          | Currently selected theme slug. Two-way bindable via `@bind-Value`. |
| `ValueChanged` | `EventCallback<string>`             | no       | —                             | Fires when the selected slug changes. |
| `DefaultValue` | `string?`                           | no       | `"light"` if present, else `Themes[0]` | Initial theme when nothing else is supplied. |
| `StorageKey`   | `string?`                           | no       | `null`                        | If set, persist selection to `localStorage` under this key. |
| `Name`         | `string`                            | no       | `"theme"`                     | `name` on the `<select>` and the `data-lily-theme-select` discriminator on the managed `<link>`. |
| `Extension`    | `string`                            | no       | `".css"`                      | File extension appended to each slug when constructing the URL. |
| `ThemeLabels`  | `IReadOnlyDictionary<string,string>`| no       | empty                         | Optional pretty labels per slug. |
| `ChildContent` | `RenderFragment<ThemeSelectContext>?`| no      | default option markup         | Custom rendering of the options. |
| `OnChange`     | `EventCallback<string>`             | no       | —                             | Fires after the select applies a new theme. Mirrors `ValueChanged`. |
| `CssClass`     | `string`                            | no       | `""`                          | Extra CSS class merged into the `<select>` root. |
| `AdditionalAttributes` | `Dictionary<string,object>?`| no       | —                             | Captures all unmatched attributes; spread onto the root. |

`ThemeSelectContext` shape:

```csharp
public sealed class ThemeSelectContext
{
    public required IReadOnlyList<string> Themes { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetTheme { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}
```

### 4.2 DOM contract

- Root element: `<select class="theme-select {CssClass}"
  aria-label="{Label}" name="{Name}">`.
- **First child, always:** a component-owned placeholder option

  ```html
  <option class="theme-select-option theme-select-placeholder" value="" selected>
    {Placeholder ?? Label}
  </option>
  ```

  It precedes the real options in BOTH the default and the
  `ChildContent` code paths, and it is the only option ever marked
  `selected`.
- Default children after the placeholder: one
  `<option class="theme-select-option" value="{slug}">{LabelFor(slug)}</option>`
  per theme slug. Real options are never marked `selected` — the
  `<select>`'s own DOM value does not track `Value`.
- **Snap-back:** on `change` the component reads the chosen slug, resets
  the live element's value to `""` (`Object.assign(el, { value: "" })`
  through `IJSRuntime`, wrapped in try/catch so prerender is safe), and
  only then applies the slug. The closed control therefore always reads
  `Placeholder ?? Label`; the real selection lives in `Value`, which
  remains two-way bindable. `data-theme` application, the `<link>` swap,
  `localStorage` persistence, `OnChange` / `ValueChanged`, and
  initial-value resolution are all unchanged.
- `LabelFor(slug)` returns `ThemeLabels[slug]` when supplied;
  otherwise the slug with its first character upper-cased. The select
  never emits the word "default".
- Custom children: rendered via the `ChildContent` render fragment
  with `ThemeSelectContext`.
- A single managed
  `<link rel="stylesheet" data-lily-theme-select="{Name}">` in
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
   `data-lily-theme-select="{Name}"`).
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

- `<select>` has the implicit `role="combobox"` and is the announced
  control.
- `aria-label={Label}` supplies the accessible name.
- `name={Name}` is set on the `<select>`.
- Each `<option>` has the implicit `role="option"`; the browser tracks
  its selected state.

### 6.2 Keyboard contract

Provided by the native `<select>`:

| Key             | Action                                           |
| --------------- | ------------------------------------------------ |
| `Tab`           | Move focus to the select (one stop).             |
| `Shift+Tab`     | Move focus away from the select.                 |
| `Arrow Down`    | Select the next option.                          |
| `Arrow Up`      | Select the previous option.                      |
| `Home` / `End`  | Select the first / last option.                  |
| Typeahead       | Type characters to jump to a matching option.    |
| `Enter` / `Space` | Open the option list (platform-dependent).     |
| `Escape`        | Close the option list.                           |

### 6.3 Internationalisation

- `Label` and entries of `ThemeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

## 7. Testing acceptance criteria

`ThemeSelectTests.cs` must assert every numbered item below. Tests
run under bUnit + xUnit.

1. Renders a `<select>`.
2. `aria-label` is the supplied `Label`.
3. Renders one `<option>` per entry in `Themes`, plus the leading
   placeholder option (so `Themes.Count + 1` options); the `<select>`
   carries the supplied `Name` attribute.
4. Each theme `<option>`'s `value` attribute is the theme slug, after
   the leading placeholder whose value is `""`.
5. The default rendering shows `ThemeLabels[slug]` when supplied, or
   the slug with its first character upper-cased otherwise (e.g.
   `"light"` → `"Light"`). The word `"default"` never appears.
6. After the first render, the resolved initial value is `"light"`
   when present in `Themes`, otherwise `Themes[0]`, and `ValueChanged`
   fires with that value.
7. After the first render, the JS interop call to set up the managed
   `<link>` and `data-theme` is invoked with the constructed href
   `${Normalise(ThemesUrl)}${initial}${Extension}`.
8. Selecting a different `<option>` updates `Value`, invokes the JS
   interop with the new href, and fires `OnChange` / `ValueChanged`
   with the new slug.
9. When `StorageKey` is set, the JS interop call carries the storage
   key so it can persist the slug.
10. When `Value` is supplied as a non-empty parameter, the
    initial-value resolution skips storage and defaults.
11. When `ThemesUrl` does not end with `/`, the constructed URL still
    has exactly one `/` between the directory and the slug.
12. Extra attributes captured by `AdditionalAttributes` spread through
    onto the `<select>` (e.g. `data-testid`).
13. A custom `ChildContent` render fragment renders custom `<option>`
    elements with `ThemeSelectContext`.
14. The placeholder option is the first child of the `<select>`, carries
    `class="theme-select-option theme-select-placeholder"`, `value=""`,
    and the text `Label`; it is the only option marked `selected`; and
    the resolved initial theme is still applied.
15. When `Placeholder` is supplied it overrides `Label` as the
    placeholder text, while `aria-label` still carries `Label`.
16. Choosing an option applies the chosen theme AND snaps the select
    back to the placeholder: the live element's value is reset through
    interop, and the placeholder remains the only `selected` option.

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme.
- A `prefers-color-scheme` integration.
- A non-`<link>` loader that injects a `<style>` block.
- A `Preload` parameter that adds `<link rel="preload" as="style">`
  tags for every available theme.

## 9. Tracking

- Package directory:
  `lily-design-system-blazor-helpers/lily-design-system-blazor-theme-select/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
