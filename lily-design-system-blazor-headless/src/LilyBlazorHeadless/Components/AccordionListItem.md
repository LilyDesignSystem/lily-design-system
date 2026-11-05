# AccordionListItem

An accordion list item component.

See `components/accordion-list-item/index.md` for canonical documentation.

The contract's `<li>`, holding a native `<details>`.

## Parameters

- `Summary`: string — the header; leave it out to put your own `<summary>` in the content
- `Open`, `OpenChanged`: bool — two-way with `@bind-Open`
- `ChildContent`, `CssClass`, `AdditionalAttributes` (on the `<li>`)

## Usage

```razor
<AccordionListItem Summary="First question" @bind-Open="open"><p>Answer</p></AccordionListItem>
```
