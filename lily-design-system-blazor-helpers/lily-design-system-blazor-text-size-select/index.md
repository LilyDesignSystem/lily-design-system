# TextSizeSelect (Blazor helper)

A reusable, headless Blazor text-size select. Renders a native
`<select>` of size slugs and applies the chosen slug to the document
root via `data-text-size`, with optional `localStorage` persistence.
Ships no CSS — you style the `text-size-select` class hook and map
each `[data-text-size="{slug}"]` to real typography.

Single source of truth: [spec/index.md](./spec/index.md).

## Install

Add a project reference to
`LilyDesignSystem.Blazor.TextSizeSelect.csproj`, or the published
`LilyDesignSystem.Blazor.TextSizeSelect` NuGet package.

## Usage

```razor
@using LilyDesignSystem.Blazor.Helpers

<TextSizeSelect Label="Text size"
                Sizes='new[] { "small", "medium", "large", "x-large" }'
                StorageKey="lily-text-size"
                @bind-Value="size" />

@code {
    private string size = "";
}
```

Then style the slugs in your own CSS:

```css
:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 112.5%; }
:root[data-text-size="x-large"] { font-size: 125%; }
```

## Parameters

| Parameter             | Type                                     | Required | Default                                |
| --------------------- | ---------------------------------------- | -------- | -------------------------------------- |
| `Label`               | `string`                                 | yes      | —                                      |
| `Sizes`               | `IReadOnlyList<string>`                  | yes      | —                                      |
| `Value`               | `string`                                 | no       | `""`                                   |
| `ValueChanged`        | `EventCallback<string>`                  | no       | —                                      |
| `DefaultValue`        | `string?`                                | no       | `"medium"` if present, else `Sizes[0]` |
| `StorageKey`          | `string?`                                | no       | `null`                                 |
| `Name`                | `string`                                 | no       | `"text-size"`                          |
| `SizeLabels`          | `IReadOnlyDictionary<string,string>`     | no       | empty                                  |
| `ChildContent`        | `RenderFragment<TextSizeSelectContext>?` | no       | default option markup                  |
| `OnChange`            | `EventCallback<string>`                  | no       | —                                      |
| `CssClass`            | `string`                                 | no       | `""`                                   |
| `AdditionalAttributes`| `Dictionary<string,object>?`             | no       | —                                      |

## Custom option rendering

```razor
<TextSizeSelect Label="Text size" Sizes="sizes">
    <ChildContent Context="ctx">
        @foreach (var s in ctx.Sizes)
        {
            <option value="@s">@ctx.LabelFor(s)</option>
        }
    </ChildContent>
</TextSizeSelect>
```

## Accessibility

- WCAG 2.2 AAA target; directly supports SC 1.4.4 (Resize Text).
- Native `<select>` keyboard semantics (Arrow / Home / End /
  typeahead).
- `aria-label` carries the consumer-supplied accessible name.

## License

Dual-licensed under MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or
BSD-3-Clause. Contact joel@joelparkerhenderson.com for other terms.
