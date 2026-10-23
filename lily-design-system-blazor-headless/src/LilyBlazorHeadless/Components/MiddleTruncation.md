# MiddleTruncation

A string shortened in the middle, keeping the start and the end; the full text stays in the accessibility tree.

Full documentation: [components/middle-truncation/index.md](../../../../components/middle-truncation/index.md).

## Parameters

- `Text` (required), `Ellipsis` (required, no default), `Strategy` (`"even"` | `"fixed-end"` | `"min-end"`, default `"even"`), `End`, `MaxCharacters`, `CssClass`
- Unmatched attributes spread onto the root `<span>`

## Deviation from the Svelte canonical

Blazor here uses no JS interop, so the component cannot measure a pixel width. `MaxCharacters` is a budget of user-perceived characters (ellipsis included) instead; without it the full text is shown. For pixel-accurate fitting in a browser, use the Web Components element.

## Usage

```razor
<MiddleTruncation Text="quarterly-report-final-version-3.pdf" Ellipsis="…" Strategy="min-end" End="6" MaxCharacters="24" />
```
