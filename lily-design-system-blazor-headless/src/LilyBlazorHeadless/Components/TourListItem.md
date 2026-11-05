# TourListItem

One step in a tour guide list.

See `components/tour-list-item/index.md` for canonical documentation.

The step's name is the consumer's words.

## Parameters

- `Label`: string (required)
- `Current`: bool — only the current step shows
- `StepNumber`, `TotalSteps`: int?
- `StepTemplate`: string — with both numbers, replaces `Label`; `{label}`, `{step}` and `{total}` are filled in
- `ChildContent`, `CssClass`, `AdditionalAttributes`

## Usage

```razor
<TourListItem Label="Welcome" Current="true" StepNumber="1" TotalSteps="3" StepTemplate="{label}, step {step} of {total}">...</TourListItem>
```
