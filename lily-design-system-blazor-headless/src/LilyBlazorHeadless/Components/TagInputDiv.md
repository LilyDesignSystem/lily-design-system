# TagInputDiv

An input for adding and removing tags.

See `components/tag-input-div/index.md` for canonical documentation.

The root is the contract's `<div role="group">` with `<input class="tag-input-div-field">` inside. Enter with no text is a normal Enter, so it submits a surrounding form. `TagInputDiv.razor.js` decides that per key, which needs an interactive render mode.

## Parameters

- `Label`: string (required) — names the group and the field
- `Value`, `ValueChanged`: string — the field, two-way with `@bind-Value`
- `OnAdd`: EventCallback<string> — Enter with text: the trimmed text
- `Disabled`: bool
- `Placeholder`, `Name`, `Required`: set on the field
- `ChildContent`: RenderFragment — the tags, which the consumer holds and renders
- `CssClass`: string — extra CSS classes appended to `tag-input-div`
- `AdditionalAttributes`: catches unmatched HTML attributes on the root

## Usage

```razor
<TagInputDiv Label="Tags" OnAdd="@(tag => tags.Add(tag))">
    @foreach (var tag in tags)
    {
        <span>@tag</span>
    }
</TagInputDiv>
```
