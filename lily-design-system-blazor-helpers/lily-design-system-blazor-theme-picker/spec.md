# ThemePicker — Specification (Blazor)

Single source of truth for the `lily-design-system-blazor-theme-picker`
Blazor helper. This file drives implementation, testing, and
documentation in the spec-driven-development style: anything not in
this spec is out of scope; anything in this spec must be exercised by
a test.

Sibling files in this directory:

- `ThemePicker.razor` — Razor markup
- `ThemePicker.razor.cs` — C# code-behind (partial class)
- `ThemePickerTests.cs` — bUnit + xUnit spec exercising every clause in §4–§7
- `index.md` — user-facing readme

The companion headless catalog entry
(`lily-design-system-blazor-headless/.../ThemePicker.razor`) is a pure
container — `<div role="radiogroup">` + `ChildContent`. This helper is
the opinionated, reusable counterpart that owns the dynamic loading
lifecycle.

---

## 1. Goal

Give a Blazor application a drop-in, headless theme picker that:

1. Renders an accessible radio group of available themes.
2. **Loads themes dynamically at runtime** from a developer-specified
   directory URL (e.g. `/assets/themes/`).
3. Applies the chosen theme by injecting / swapping one
   `<link rel="stylesheet">` in `document.head` and by setting a
   `data-theme="…"` attribute on the document root.
4. Optionally persists the chosen theme to `localStorage` so the choice
   survives reload.
5. Ships zero CSS — the consumer styles every visual aspect via the
   `theme-picker` class hook.

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

- **One `<link>` per picker name.** Switching themes mutates `href` on
  a single `<link rel="stylesheet" data-lily-theme-picker="{Name}">`.
  Only the active theme is fetched; previously-active CSS is unloaded
  when the href changes. Multiple pickers can coexist by passing
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
| `Label`        | `string`                            | yes      | —                             | Accessible name for the radiogroup. |
| `ThemesUrl`    | `string`                            | yes      | —                             | Base URL of the themes directory. Trailing `/` is auto-normalised. |
| `Themes`       | `IReadOnlyList<string>`             | yes      | —                             | Available theme slugs. |
| `Value`        | `string`                            | no       | `""`                          | Currently selected theme slug. Two-way bindable via `@bind-Value`. |
| `ValueChanged` | `EventCallback<string>`             | no       | —                             | Fires when the selected slug changes. |
| `DefaultValue` | `string?`                           | no       | `"light"` if present, else `Themes[0]` | Initial theme when nothing else is supplied. |
| `StorageKey`   | `string?`                           | no       | `null`                        | If set, persist selection to `localStorage` under this key. |
| `Name`         | `string`                            | no       | `"theme"`                     | `name` shared by the radio inputs and the `data-lily-theme-picker` discriminator on the managed `<link>`. |
| `Extension`    | `string`                            | no       | `".css"`                      | File extension appended to each slug when constructing the URL. |
| `ThemeLabels`  | `IReadOnlyDictionary<string,string>`| no       | empty                         | Optional pretty labels per slug. |
| `ChildContent` | `RenderFragment<ThemePickerContext>?`| no      | default radio markup          | Custom rendering of the options. |
| `OnChange`     | `EventCallback<string>`             | no       | —                             | Fires after the picker applies a new theme. Mirrors `ValueChanged`. |
| `CssClass`     | `string`                            | no       | `""`                          | Extra CSS class merged into the `<fieldset>` root. |
| `AdditionalAttributes` | `Dictionary<string,object>?`| no       | —                             | Captures all unmatched attributes; spread onto the root. |

`ThemePickerContext` shape:

```csharp
public sealed class ThemePickerContext
{
    public required IReadOnlyList<string> Themes { get; init; }
    public required string Value { get; init; }
    public required Func<string, Task> SetTheme { get; init; }
    public required string Name { get; init; }
    public required Func<string, string> LabelFor { get; init; }
}
```

### 4.2 DOM contract

- Root element: `<fieldset class="theme-picker {CssClass}"
  role="radiogroup" aria-label="{Label}">`.
- Default children: one `<label class="theme-picker-option">` per
  theme slug containing
  `<input type="radio" name="{Name}" value="{slug}" checked={Value == slug}>`
  followed by
  `<span class="theme-picker-option-label">{LabelFor(slug)}</span>`.
- `LabelFor(slug)` returns `ThemeLabels[slug]` when supplied;
  otherwise the slug with its first character upper-cased. The picker
  never emits the word "default".
- Custom children: rendered via the `ChildContent` render fragment
  with `ThemePickerContext`.
- A single managed
  `<link rel="stylesheet" data-lily-theme-picker="{Name}">` in
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
5. `""` (no apply happens — the picker waits for user interaction).

Resolution writes back to `Value` via the `ValueChanged` callback so
consumers `@bind-Value`-ing the variable see the resolved value.

### 5.3 Applying a theme

Applying a theme `slug` performs, in order:

1. Locate or create the managed `<link>` (matched by
   `data-lily-theme-picker="{Name}"`).
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

- `<fieldset>` with `role="radiogroup"` is the announced container.
- `aria-label={Label}` supplies the group name.
- Native `<input type="radio">` elements get the radio role, checked
  state, and keyboard semantics for free.

### 6.2 Keyboard contract

Provided by the platform:

| Key            | Action                                           |
| -------------- | ------------------------------------------------ |
| `Tab`          | Move focus into / out of the group.              |
| `Arrow` keys   | Move selection between options inside the group. |
| `Space`        | Select the focused option (when not already).    |

### 6.3 Internationalisation

- `Label` and entries of `ThemeLabels` are passed through verbatim.
- No user-facing strings are hardcoded.
- `dir` and writing direction inherit from the document.

## 7. Testing acceptance criteria

`ThemePickerTests.cs` must assert every numbered item below. Tests
run under bUnit + xUnit.

1. Renders a `<fieldset>` with `role="radiogroup"`.
2. `aria-label` is the supplied `Label`.
3. Renders one radio input per entry in `Themes`, sharing the supplied
   `Name` attribute.
4. Each radio's `value` attribute is the theme slug.
5. The default rendering shows `ThemeLabels[slug]` when supplied, or
   the slug with its first character upper-cased otherwise (e.g.
   `"light"` → `"Light"`). The word `"default"` never appears.
6. After the first render, the resolved initial value is `"light"`
   when present in `Themes`, otherwise `Themes[0]`, and `ValueChanged`
   fires with that value.
7. After the first render, the JS interop call to set up the managed
   `<link>` and `data-theme` is invoked with the constructed href
   `${Normalise(ThemesUrl)}${initial}${Extension}`.
8. Selecting a different radio updates `Value`, invokes the JS interop
   with the new href, and fires `OnChange` / `ValueChanged` with the
   new slug.
9. When `StorageKey` is set, the JS interop call carries the storage
   key so it can persist the slug.
10. When `Value` is supplied as a non-empty parameter, the
    initial-value resolution skips storage and defaults.
11. When `ThemesUrl` does not end with `/`, the constructed URL still
    has exactly one `/` between the directory and the slug.
12. Extra attributes captured by `AdditionalAttributes` spread through
    onto the `<fieldset>` (e.g. `data-testid`).
13. A custom `ChildContent` render fragment is rendered with
    `ThemePickerContext`.

## 8. Out-of-scope (future, not implemented here)

- A complementary `ThemeView` helper that displays the active theme.
- A `prefers-color-scheme` integration.
- A non-`<link>` loader that injects a `<style>` block.
- A `Preload` parameter that adds `<link rel="preload" as="style">`
  tags for every available theme.

## 9. Tracking

- Package directory:
  `lily-design-system-blazor-helpers/lily-design-system-blazor-theme-picker/`
- Spec version: 0.1.0
- Created: 2026-06-05
- License: MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause (or
  contact for other terms)
- Contact: Joel Parker Henderson &lt;joel@joelparkerhenderson.com&gt;
