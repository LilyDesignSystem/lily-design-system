# Accessibility

The select targets WCAG 2.2 AAA and uses a native HTML `<select>`.

## Roles and properties

| Element      | Role / Property             | Source             |
| ------------ | --------------------------- | ------------------ |
| `<select>`   | implicit `role="combobox"`  | Browser            |
| `<select>`   | `aria-label="@Label"`       | Consumer parameter |
| `<select>`   | `name`                      | Component          |
| `<option>`   | implicit `role="option"`    | Browser            |
| `<option>`   | selected state (implicit)   | Browser            |

The select does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no manual focus management —
the native `<select>` behaviour is exactly what assistive technology
expects.

## Keyboard contract

Provided entirely by the native `<select>`:

| Key               | Action                                          |
| ----------------- | ----------------------------------------------- |
| `Tab`             | Move focus to the select (one stop).            |
| `Shift+Tab`       | Move focus away from the select.                |
| `Arrow Down`      | Select the next option.                         |
| `Arrow Up`        | Select the previous option.                     |
| `Home` / `End`    | Select the first / last option.                 |
| Typeahead         | Type characters to jump to a matching option.   |
| `Enter` / `Space` | Open the option list (platform-dependent).      |
| `Escape`          | Close the option list.                          |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. The selected `<option>`.
2. `data-theme="<slug>"` on `<html>`.
3. The `@bind-Value` binding in user code.

## Internationalisation

- `Label` is consumer-supplied; pass a translated string.
- `ThemeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

A `IStringLocalizer<T>` example:

```razor
@inject IStringLocalizer<SharedResources> Localizer

<ThemeSelect
    Label="@Localizer["chooseTheme"]"
    ThemesUrl="/assets/themes/"
    Themes="@(new[]{ "light", "dark", "abyss" })"
    ThemeLabels="@(new Dictionary<string, string>
    {
        ["light"] = Localizer["light"],
        ["dark"] = Localizer["dark"],
        ["abyss"] = Localizer["abyss"],
    })"
    @bind-Value="theme" />
```

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring. NHS-UK
and Lily™ themes ship a high-contrast focus outline that meets AAA.

A safe default:

```css
.theme-select:focus-visible {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

## Reduced motion

The select performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap:

```css
:root[data-theme] {
    transition: background-color 0.2s, color 0.2s;
}

@media (prefers-reduced-motion: reduce) {
    :root[data-theme] {
        transition: none;
    }
}
```

## Screen-reader behaviour matrix

| Reader     | OS       | Browser   | What's announced when user focuses the select |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Theme, pop-up button, Light". |
| NVDA       | Windows  | Firefox   | "Theme combo box, Light, 1 of 3". |
| Narrator   | Windows  | Edge      | "Theme combo box, Light selected". |
| JAWS       | Windows  | Chrome    | "Theme combo box, Light, 1 of 3". |
| TalkBack   | Android  | Chrome    | "Theme, Light, drop-down list, double-tap to activate". |

## Common mistakes to avoid

- **Replacing the `<select>` with a div in `ChildContent`.** The
  fragment renders inside the `<select>`; do not wrap a div *around*
  the select if you need its semantics.
- **Hiding the options with `display: none`.** That removes them
  from the accessibility tree. Keep the native `<option>` elements
  in the DOM.
- **Forgetting to translate `ThemeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Using `InputSelect<T>` instead of a raw `<select>`.**
  `InputSelect<T>` requires an `EditContext` ancestor and adds its
  own class hooks. The helper uses a raw `<select>` for flexibility.

## Focus order under RTL

In RTL layout, focus moves visually right-to-left but logically in
source order — Tab still reaches the select in source order, and the
option order inside it follows `Themes`. This is the browser's job.

## High contrast mode

The raw `<select>` automatically respects Windows High Contrast Mode
and Forced Colors Mode. Don't override `forced-color-adjust` in
consumer CSS unless you've measured the trade-off.

## Testing for a11y in bUnit

```csharp
[Fact]
public void Has_Accessible_Name()
{
    var cut = RenderComponent<ThemeSelect>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/t/")
        .Add(x => x.Themes, new[] { "light", "dark" }));

    var root = cut.Find("select");
    Assert.Equal("Theme", root.GetAttribute("aria-label"));
}
```

For broader a11y testing run axe-core in a real Blazor host.

## References

- MDN — the `<select>` element:
  <https://developer.mozilla.org/docs/Web/HTML/Element/select>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 1.4.1 Use of Color:
  <https://www.w3.org/WAI/WCAG22/Understanding/use-of-color>
- WCAG 2.4.7 Focus Visible:
  <https://www.w3.org/WAI/WCAG22/Understanding/focus-visible>
- WCAG 3.2.2 On Input (focus / context preservation):
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
- Microsoft Learn — Accessibility in Blazor:
  <https://learn.microsoft.com/aspnet/core/blazor/accessibility>

---

Lily™ and Lily Design System™ are trademarks.
