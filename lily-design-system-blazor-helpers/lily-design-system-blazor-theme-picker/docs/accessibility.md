# Accessibility

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<fieldset>`                  | `role="radiogroup"`        | Picker        |
| `<fieldset>`                  | `aria-label="@Label"`      | Consumer parameter |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Picker        |

The picker does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no roving tabindex, no manual
focus management — the native radio behaviour is exactly the
WAI-ARIA Authoring Practices pattern.

## Keyboard contract

Provided entirely by the platform's native radio inputs:

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `Tab`              | Move focus into / out of the group.               |
| `Shift+Tab`        | Move focus backwards out of the group.            |
| `Arrow Down/Right` | Move selection to the next option.                |
| `Arrow Up/Left`    | Move selection to the previous option.            |
| `Space`            | Re-select the focused option (rarely needed).     |
| `Home` / `End`     | Move to first / last option (most browsers).      |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio.
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

<ThemePicker
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

The picker does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring. NHS-UK
and Lily themes ship a high-contrast focus outline that meets AAA.

A safe default:

```css
.theme-picker-option:focus-within {
    outline: 2px solid var(--color-primary, currentColor);
    outline-offset: 2px;
}
```

## Reduced motion

The picker performs no animation. Theme CSS files are responsible
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

| Reader     | OS       | Browser   | What's announced when user lands on the group |
| ---------- | -------- | --------- | ---------------------------------------------- |
| VoiceOver  | macOS 14 | Safari 17 | "Theme, group" → "Light, selected, radio button, 1 of 3". |
| NVDA       | Windows  | Firefox   | "Theme grouping" → "Light radio button checked 1 of 3". |
| Narrator   | Windows  | Edge      | "Theme radio button group, Light selected".   |
| JAWS       | Windows  | Chrome    | "Theme group, Light radio button checked, 1 of 3". |
| TalkBack   | Android  | Chrome    | "Theme, Light, radio button, 1 of 3, double-tap to activate". |

## Common mistakes to avoid

- **Replacing the fieldset with a div in `ChildContent`.** The
  fragment renders inside the fieldset; do not wrap a div *around*
  the picker if you need group semantics.
- **Hiding the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `ThemeLabels`.** The picker only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Using `InputRadio<T>` instead of raw `<input type="radio">`.**
  `InputRadio<T>` requires an `EditContext` ancestor and adds its
  own class hooks. The helper uses raw radios for flexibility.

## Focus order under RTL

In RTL layout, focus moves visually right-to-left but logically in
source order — Tab still walks the radios in the order they appear
in `Themes`, and Arrow Right (in RTL) moves to the *previous*
option. This is the browser's job.

## High contrast mode

Raw `<input type="radio">` automatically respects Windows High
Contrast Mode and Forced Colors Mode. Don't override
`forced-color-adjust` in consumer CSS unless you've measured the
trade-off.

## Testing for a11y in bUnit

```csharp
[Fact]
public void Has_Accessible_Name_And_Role()
{
    var cut = RenderComponent<ThemePicker>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/t/")
        .Add(x => x.Themes, new[] { "light", "dark" }));

    var root = cut.Find("fieldset");
    Assert.Equal("radiogroup", root.GetAttribute("role"));
    Assert.Equal("Theme", root.GetAttribute("aria-label"));
}
```

For broader a11y testing run axe-core in a real Blazor host.

## References

- WAI-ARIA APG — Radio Group:
  <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>
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
