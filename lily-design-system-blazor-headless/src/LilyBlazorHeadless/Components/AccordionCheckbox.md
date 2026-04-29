# AccordionCheckbox

A compound disclosure widget that pairs a checkbox option with a revealable panel. The user sees a checkbox option; checking the box reveals an accordion panel of additional content beneath it. Multiple `AccordionCheckbox` instances stacked vertically form a list of independent toggleable options.

Unlike `Details`, which uses a `<summary>` toggle, this component uses a real form control. The `Checked` parameter is the source of truth and is bindable via `@bind-Checked`.

## When to use it

- Conditional follow-up questions in a form ("I have additional comments" → text-area-input)
- Opt-in disclosures that hide non-essential detail until requested
- A vertical list of independent expandable options

## When not to use it

- Use `Details` when the trigger is a non-form summary toggle.
- Use `SwitchButton` when the toggle does not reveal additional content.
- Use `RadioGroup` when only one option may be active.

## Parameters

| Parameter              | Type                  | Default | Description                                                              |
| ---------------------- | --------------------- | ------- | ------------------------------------------------------------------------ |
| `Label`                | `string`              | —       | The checkbox label text. Required.                                       |
| `Checked`              | `bool`                | `false` | Whether the checkbox is checked. Bindable via `@bind-Checked`.           |
| `CheckedChanged`       | `EventCallback<bool>` | —       | Fired when the checked state changes.                                    |
| `Id`                   | `string?`             | auto    | Base id for the checkbox (`<Id>-checkbox`) and panel (`<Id>-panel`).     |
| `ChildContent`         | `RenderFragment`      | —       | Content shown when checked. Required.                                    |
| `CssClass`             | `string`              | `""`    | Extra CSS classes appended to `accordion-checkbox`.                      |
| `AdditionalAttributes` | `Dictionary<...>`     | —       | Captured and rendered on the root `<div>`.                               |

## Usage

```razor
@using LilyBlazorHeadless.Components

<AccordionCheckbox Label="I have additional comments" @bind-Checked="hasComments">
    <textarea aria-label="Your comments"></textarea>
</AccordionCheckbox>

@code {
    private bool hasComments;
}
```

## Accessibility

- `aria-controls` on the checkbox references the panel id.
- `aria-expanded` on the checkbox reflects the checked state.
- `role="region"` + `aria-labelledby` on the panel announces it as a labeled region tied to the checkbox.
- The native `hidden` attribute removes the panel from the accessibility tree when unchecked.

## Keyboard

- `Tab` — moves focus onto the checkbox.
- `Space` — toggles the checkbox (native), revealing or hiding the panel.

## Related components

- `Details` — disclosure using `<details>` / `<summary>`.
- `Collapsible` — generic collapsible container.
- `CheckboxInput` — single checkbox without a revealable panel.
