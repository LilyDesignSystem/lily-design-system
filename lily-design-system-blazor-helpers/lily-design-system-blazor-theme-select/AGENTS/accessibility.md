# Accessibility — ThemeSelect (Blazor)

The select targets WCAG 2.2 AAA and uses a native HTML `<select>`.
This file is the Blazor-flavoured view of the contract; the canonical
contract is in [`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element      | Role / Property                | Source             |
| ------------ | ------------------------------ | ------------------ |
| `<select>`   | implicit `role="combobox"`     | Browser            |
| `<select>`   | `aria-label="@Label"`          | Consumer parameter |
| `<select>`   | `name`                         | Component          |
| `<option>`   | implicit `role="option"`       | Browser            |
| `<option>`   | selected state (implicit)      | Browser            |

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
3. The `Value` parameter (bound via `@bind-Value`).

## Internationalisation

- `Label` is consumer-supplied; pass a translated string.
- `ThemeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

For a `IStringLocalizer<T>` example, see
[`../../AGENTS/shared/i18n-principles.md`](../../AGENTS/shared/i18n-principles.md).

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring.
NHS-UK and Lily themes ship a high-contrast focus outline that
meets AAA.

## Reduced motion

The select performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{Label}, pop-up button"
  and each option as "{LabelFor(slug)}, selected / not selected".
- NVDA announces "{Label} combo box" and each option similarly.
- Narrator (Windows) announces "combo box, {Label}" and the current
  option's selected state.
- JAWS announces "{Label} combo box" with current selection.
- Selection changes are announced because the control's value
  changes.

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
- **Using `InputSelect<T>` from Blazor's form components.** It
  requires an `EditContext` ancestor and adds its own class hooks.
  The helper uses a raw `<select>` for flexibility.

## Blazor-specific notes

- `aria-label` is bound via `aria-label="@Label"`. Avoid passing it
  twice (e.g. via `AdditionalAttributes`); the static value wins
  and you lose the parameter.
- When a consumer scopes the select via `ChildContent`, the
  `<select>` and its `aria-label` still apply. The fragment replaces
  the **inside** (the options), not the wrapping control.
- Blazor's render tree does not affect ARIA announcements. The
  browser announces what's in the DOM; making sure the DOM is
  correct is enough.

## Testing for a11y

```csharp
[Fact]
public void Section_7_1_Renders_Select()
{
    var cut = RenderComponent<ThemeSelect>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/t/")
        .Add(x => x.Themes, new[] { "light", "dark" }));

    var root = cut.Find("select");
    Assert.Equal("Theme", root.GetAttribute("aria-label"));
}
```

For broader a11y testing run axe-core in a real Blazor host. See
[`../../../AGENTS/accessibility.md`](../../../AGENTS/accessibility.md)
for the catalog-wide guidance.

## High Contrast Mode

The raw `<select>` automatically respects Windows High Contrast Mode
and Forced Colors Mode — the OS provides the selected / focused
styling. Don't override `forced-color-adjust` in consumer CSS unless
you've measured the trade-off.

## Mobile

On iOS and Android, the native `<select>` renders as the platform-
appropriate widget (a wheel select on iOS, a Material Design menu on
Android). Both are fully accessible via TalkBack / VoiceOver mobile
screen readers.
