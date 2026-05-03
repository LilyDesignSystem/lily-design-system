# AccordionList

An accordion ordered list of list item components.

See `components/accordion-list/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `accordion-list`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AccordionList>
    Content
</AccordionList>
```
