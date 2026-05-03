# EndNotes

A section of titled endnote items at the end of an article.

See `components/end-notes/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `end-notes`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<EndNotes>
    Content
</EndNotes>
```
