# AccordionNav

An accordion navigation area for collapsible accordion information.

See `components/accordion-nav/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `accordion-nav`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<AccordionNav>
    Content
</AccordionNav>
```
