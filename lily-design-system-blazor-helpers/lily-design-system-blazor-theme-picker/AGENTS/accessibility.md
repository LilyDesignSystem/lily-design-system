# Accessibility — ThemePicker (Blazor)

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern. This file is the Blazor-flavoured
view of the contract; the canonical contract is in
[`../spec.md`](../spec.md) §6.

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
3. The `Value` parameter (bound via `@bind-Value`).

## Internationalisation

- `Label` is consumer-supplied; pass a translated string.
- `ThemeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

For a `IStringLocalizer<T>` example, see
[`../../AGENTS/shared/i18n-principles.md`](../../AGENTS/shared/i18n-principles.md).

## Visible focus

The picker does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring.
NHS-UK and Lily themes ship a high-contrast focus outline that
meets AAA.

## Reduced motion

The picker performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the group as "{Label}, radiogroup"
  and each option as "{LabelFor(slug)}, radio button, selected /
  not selected".
- NVDA announces "{Label} grouping" and each option similarly.
- Narrator (Windows) announces "radio button group, {Label}" and
  each option's selected state.
- JAWS announces "{Label} radio button" with current selection.
- Selection changes are announced because the underlying control
  state (checked) changes.

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
- **Using `InputRadio<T>` from Blazor's form components.** It
  requires an `EditContext` ancestor and adds its own class hooks.
  The helper uses raw `<input type="radio">` for flexibility.

## Blazor-specific notes

- `aria-label` is bound via `aria-label="@Label"`. Avoid passing it
  twice (e.g. via `AdditionalAttributes`); the static value wins
  and you lose the parameter.
- When a consumer scopes the picker via `ChildContent`, the
  fieldset and its `role="radiogroup"` + `aria-label` still apply.
  The fragment replaces the **inside**, not the wrapping group.
- Blazor's render tree does not affect ARIA announcements. The
  browser announces what's in the DOM; making sure the DOM is
  correct is enough.

## Testing for a11y

```csharp
[Fact]
public void Section_7_1_Renders_Fieldset_With_Radiogroup_Role()
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

For broader a11y testing run axe-core in a real Blazor host. See
[`../../../AGENTS/accessibility.md`](../../../AGENTS/accessibility.md)
for the catalog-wide guidance.

## High Contrast Mode

The raw `<input type="radio">` automatically respects Windows
High Contrast Mode and Forced Colors Mode — the OS provides the
selected / focused styling. Don't override `forced-color-adjust`
in consumer CSS unless you've measured the trade-off.

## Mobile

On iOS and Android, native radio inputs render as the platform-
appropriate widget (a row of radios on iOS, Material Design ripples
on Android). Both are fully accessible via TalkBack / VoiceOver
mobile screen readers.
