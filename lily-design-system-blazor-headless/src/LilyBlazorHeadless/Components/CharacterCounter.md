# CharacterCounter

A counter showing remaining or used characters in a text field.

See `components/character-counter/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `character-counter`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CharacterCounter>
    Content
</CharacterCounter>
```
