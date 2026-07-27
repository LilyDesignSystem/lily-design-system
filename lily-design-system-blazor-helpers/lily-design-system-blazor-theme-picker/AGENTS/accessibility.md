# Accessibility — ThemeChooser (Blazor)

The select targets WCAG 2.2 AAA. It is an icon button that opens a
dropdown listbox, following the WAI-ARIA APG listbox pattern — not a
native `<select>`. This file is the Blazor-flavoured view of the
contract; the canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                    | Role / Property                       | Source             |
| -------------------------- | ------------------------------------- | ------------------ |
| `<button type="button">`   | `aria-haspopup="listbox"`             | Component          |
| `<button>`                 | `aria-expanded="true\|false"`          | Component          |
| `<button>`                 | `aria-controls="{listId}"`            | Component          |
| `<button>`                 | `aria-label="@Label"`                 | Consumer parameter |
| `<span class="theme-chooser-icon">` | `aria-hidden="true"`          | Component          |
| `<ul>`                     | `role="listbox"`                      | Component          |
| `<ul>`                     | `tabindex="-1"`                       | Component          |
| `<ul>`                     | `aria-label="@Label"`                 | Consumer parameter |
| `<ul>`                     | `aria-activedescendant` (open only)   | Component          |
| `<li>`                     | `role="option"`                       | Component          |
| `<li>`                     | `aria-selected="true\|false"`          | Component          |
| `<li>`                     | `data-active` (styling hook)          | Component          |
| `<input type="hidden">`    | `name`                                | Component          |

Focus stays on the `<ul>` while the listbox is open; the active
option is conveyed by `aria-activedescendant`, per the APG. The
options themselves are never focused. The `name` attribute rides the
hidden input, not an ARIA attribute.

## Keyboard contract

Implemented by the component. On the **button**:

| Key                 | Action                                                  |
| ------------------- | ------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus to / away from the button (one stop).        |
| `Arrow Down`        | Open, active option = the selected one (else index 0).  |
| `Enter` / `Space`   | Open, active option = the selected one (else index 0).  |
| `Arrow Up`          | Open with the **last** option active.                   |

Opening moves focus to the `<ul>`.

On the **listbox**:

| Key               | Action                                                              |
| ----------------- | ------------------------------------------------------------------- |
| `Arrow Down`      | Move the active option down one; **clamps** at the last (no wrap).  |
| `Arrow Up`        | Move the active option up one; **clamps** at the first (no wrap).   |
| `Home`            | Jump to the first option.                                           |
| `End`             | Jump to the last option.                                            |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape`          | Close and return focus **without** changing the value.              |
| `Tab`             | Close **without** stealing focus back.                              |
| Printable chars   | Typeahead over the option *labels*, 500 ms buffer reset.            |

Pointer and focus: clicking an option selects, applies, and closes;
focus leaving the root closes the listbox without changing the value.

## Framework deviations

Two clauses cannot be met faithfully with Blazor's declarative event
bindings. Both are behavioural refinements, not contract breaks; see
[`../spec/index.md`](../spec/index.md) §6.4.

- **No `preventDefault` on keydown.** Blazor evaluates
  `@onkeydown:preventDefault` at render time, not per event, so it
  cannot be applied to the arrow keys while sparing `Tab`. Arrow keys
  and `Space` therefore also scroll the page in their default way. To
  stop `Enter` / `Space` toggling the listbox twice (a `<button>`
  synthesises a click for both), a `_suppressNextClick` flag swallows
  the click that follows a keydown the component already handled.
- **No document-level click listener.** This package ships no
  JavaScript, and Blazor has no declarative equivalent of the Svelte
  canonical's `<svelte:document onclick>`. Closing on outside
  interaction is driven by the root's `focusout` instead. Because
  Blazor's `FocusEventArgs` does not expose `relatedTarget`, the
  component flags focus moves it makes itself
  (`_suppressFocusOut`) and ignores the matching `focusout`.

`@onmousedown:preventDefault` **is** applied to the `<ul>`: that one
is unconditional and correct, and it stops a click on an option from
blurring the listbox before the click handler runs.

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on `<html>`.
2. The `Value` parameter (bound via `@bind-Value`), mirrored on the
   hidden input.
3. `aria-selected="true"` on exactly one `<li role="option">`.

The tradeoffs this design carries — an icon-only button whose entire
accessible name is `aria-label`, a custom listbox with weaker
assistive-technology support than a native `<select>`, and a glyph
that may render differently or be missing on some platform fonts —
are documented in
[`../docs/accessibility.md`](../docs/accessibility.md).

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

- VoiceOver (macOS) announces the trigger as "{Label}, pop-up button"
  and, once open, the list as "{Label}, listbox" with each option as
  "{LabelFor(slug)}, selected / not selected".
- NVDA announces "{Label} button, collapsed / expanded", then the
  listbox and the active option.
- Narrator (Windows) announces "button, {Label}" and the active
  option's selected state once the listbox opens.
- JAWS announces "{Label} button" and reads the active option as
  `aria-activedescendant` moves.
- The glyph is never announced: it is `aria-hidden="true"`.

## Common mistakes to avoid

- **Rendering options in `ChildContent`.** The fragment replaces the
  glyph *inside the button*; the `<li role="option">` elements are
  always component-owned.
- **Hiding the options with `display: none`.** Use the component's
  own `hidden` on the `<ul>`, which it toggles with `aria-expanded`.
  Don't add a second, competing hiding mechanism.
- **Omitting or duplicating `Label`.** It is the button's entire
  accessible name; without it the control is unnameable, and passing
  `aria-label` again through `AdditionalAttributes` fights the
  parameter.
- **Forgetting to translate `ThemeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.

## Blazor-specific notes

- `aria-label` is bound via `aria-label="@Label"` on both the button
  and the `<ul>`. Avoid passing it twice (e.g. via
  `AdditionalAttributes`); the static value wins and you lose the
  parameter.
- Focus moves are deferred to `OnAfterRenderAsync`: the `<ul>` cannot
  take focus while it still carries `hidden`, so `OpenList` sets a
  pending flag and the post-render pass calls `FocusAsync`. See
  [`./lifecycle.md`](./lifecycle.md).
- Blazor's render tree does not affect ARIA announcements. The
  browser announces what's in the DOM; making sure the DOM is
  correct is enough.

## Testing for a11y

```csharp
[Fact]
public void Section_7_3_AriaLabel_Names_Button_And_Listbox()
{
    var cut = RenderComponent<ThemeChooser>(p => p
        .Add(x => x.Label, "Theme")
        .Add(x => x.ThemesUrl, "/t/")
        .Add(x => x.Themes, new[] { "light", "dark" }));

    Assert.Equal("Theme", cut.Find("button").GetAttribute("aria-label"));
    Assert.Equal("Theme", cut.Find("ul").GetAttribute("aria-label"));
    Assert.Equal("listbox", cut.Find("button").GetAttribute("aria-haspopup"));
}
```

For broader a11y testing run axe-core in a real Blazor host. See
[`../../../AGENTS/accessibility.md`](../../../AGENTS/accessibility.md)
for the catalog-wide guidance.

## High Contrast Mode

A custom listbox does not get the OS-provided selected / focused
styling that a native `<select>` inherits. Consumer CSS must make the
focus ring, the `data-active` option, and the `aria-selected` option
visible under Windows High Contrast Mode and Forced Colors Mode —
prefer system colour keywords over `forced-color-adjust` overrides.

## Mobile

The control renders as the same button + list on every platform: no
native wheel select on iOS, no Material menu on Android. TalkBack and
VoiceOver mobile both support the APG listbox pattern, but touch
targets and list scrolling are the consumer's CSS responsibility.
