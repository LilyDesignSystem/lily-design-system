# MotionPicker (Blazor helper)

A reusable Blazor headless **motion (reduced-motion) picker** — an
icon button that opens a dropdown listbox of motion-preference slugs.
On every change it sets `data-motion="{slug}"` on the document root,
optionally persisting the choice to `localStorage`. Ships no CSS — the
consumer decides what `data-motion="reduce"` actually suppresses, e.g.:

```css
:root[data-motion="reduce"] * {
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.001ms !important;
  scroll-behavior: auto !important;
}
```

Unlike its `ThemePicker` and `TextSizePicker` siblings, MotionPicker's
initial value defers to the platform's own
`(prefers-reduced-motion: reduce)` media query before falling back to
an arbitrary default.

## Usage

```razor
@using LilyDesignSystem.Blazor.Helpers

<MotionPicker
    Label="Motion"
    Motions="@(new[] { "no-preference", "reduce" })"
    @bind-Value="motion"
    StorageKey="lily-motion" />

@code {
    private string motion = "";
}
```

## Parameters

| Parameter      | Type                              | Required | Description                                                |
| -------------- | ---------------------------------- | -------- | ------------------------------------------------------------ |
| `Label`        | `string`                           | yes      | Accessible name (`aria-label`) for the button + listbox.      |
| `Motions`      | `IReadOnlyList<string>`            | yes      | Available motion slugs.                                        |
| `Value`        | `string`                           | no       | Selected slug. Two-way bindable via `@bind-Value`.              |
| `DefaultValue` | `string?`                          | no       | Initial slug when nothing else is supplied.                     |
| `StorageKey`   | `string?`                          | no       | If set, persist the slug to `localStorage`.                     |
| `Name`         | `string`                           | no       | `name` of the hidden input (default `"motion"`).                |
| `MotionLabels` | `IReadOnlyDictionary<string,string>` | no     | Pretty labels per slug.                                         |
| `OnChange`     | `EventCallback<string>`            | no       | Called after a new motion preference is applied.                |
| `CssClass`     | `string`                           | no       | Extra CSS class on the root.                                    |
| `ChildContent` | `RenderFragment<MotionPickerContext>?` | no   | Replaces the default glyph inside the button.                   |

## Behaviour

Initial value resolves from `Value` > storage > `DefaultValue` > the
platform's `(prefers-reduced-motion: reduce)` preference (mapped to
`"reduce"` / `"no-preference"` if either is in `Motions`) > `Motions[0]`.
All DOM writes happen through `IJSRuntime` inside `OnAfterRenderAsync`,
so the component is SSR / prerender safe.

## Accessibility

- WCAG 2.2 AAA target; directly supports 2.3.3 (Animation from
  Interactions).
- APG listbox keyboard contract: arrows (clamped), `Home` / `End`,
  `PageUp` / `PageDown` (by ten), typeahead with same-character
  cycling, `Escape` discards, `Tab` closes.
- `aria-label` carries the consumer-supplied accessible name.
- Default labels title-case the slug.

---

Lily™ and Lily Design System™ are trademarks.
