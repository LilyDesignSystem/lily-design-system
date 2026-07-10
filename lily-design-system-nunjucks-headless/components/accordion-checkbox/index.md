# Accordion Checkbox

A compound disclosure widget that pairs a checkbox option with a revealable panel. The user sees a checkbox option; checking the box reveals an accordion panel of additional content beneath it. Multiple `accordion-checkbox` instances stacked vertically form a list of independent toggleable options.

Unlike `details`, which uses a `<summary>` toggle, this component uses a real form control. The `checked` param renders the initial state on the server; the consumer attaches a small JavaScript handler to toggle the panel `hidden` attribute and the checkbox `aria-expanded` attribute on the `change` event.

## When to use it

- Conditional follow-up questions in a form (e.g., "I have additional comments" → text-area-input)
- Opt-in disclosures that hide non-essential detail until requested
- A vertical list of independent expandable options

## When not to use it

- Use `details` when the trigger is a non-form summary toggle.
- Use `switch-button` when the toggle does not reveal additional content.
- Use `radio-group` when only one option may be active.
- Use `accordion-list` / `accordion-list-item` when only one of many panels may be open at a time.

## Params

| Param        | Type      | Required | Description                                                              |
| ------------ | --------- | -------- | ------------------------------------------------------------------------ |
| `id`         | `string`  | yes      | Base id; the checkbox uses `<id>-checkbox`, the panel `<id>-panel`.      |
| `label`      | `string`  | yes      | Checkbox label text.                                                     |
| `checked`    | `boolean` | no       | Initial checked state. Default: `false`.                                 |
| `text`       | `string`  | no       | Plain-text panel content (rendered as `<p>`).                            |
| `html`       | `string`  | no       | Raw HTML panel content (rendered via `| safe`).                          |
| `classes`    | `string`  | no       | Extra CSS classes appended to the root `<div>`.                          |
| `attributes` | `object`  | no       | Extra HTML attributes rendered on the root `<div>`.                      |

The macro can also be invoked with `{% call accordionCheckbox(...) %}…{% endcall %}` to provide rich panel content.

## Usage

```njk
{% from "components/accordion-checkbox/macro.njk" import accordionCheckbox %}

{% call accordionCheckbox({
  id: "comments",
  label: "I have additional comments"
}) %}
  <textarea aria-label="Your comments"></textarea>
{% endcall %}
```

## Accessibility

- `aria-controls` on the checkbox references the panel id.
- `aria-expanded` on the checkbox reflects the checked state at render time.
- `role="region"` + `aria-labelledby` on the panel announces it as a labeled region tied to the checkbox.
- The native `hidden` attribute removes the panel from the accessibility tree when unchecked.

## Keyboard

- `Tab` — moves focus onto the checkbox.
- `Space` — toggles the checkbox (native), revealing or hiding the panel.

## Consumer JavaScript

This headless macro renders only the static HTML. To toggle the panel at runtime, attach a `change` handler that mirrors the checkbox's checked state into `aria-expanded` on the input and toggles the `hidden` attribute on the panel.

## Related components

- `details` — disclosure using `<details>` / `<summary>`.
- `collapsible` — generic collapsible container.
- `checkbox-input` — single checkbox without a revealable panel.
- `accordion-list` / `accordion-list-item` — accordion list where one panel may be open at a time.

---

Lily™ and Lily Design System™ are trademarks.
