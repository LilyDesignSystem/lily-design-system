# SplitView

A two-panel resizable layout container with a draggable divider between them.

## Implementation Notes

- Headless: no CSS
- Renders `<section class="split-view-primary">`, divider, and `<section class="split-view-secondary">`
- Default divider is a `<div role="separator">` with full ARIA wiring; consumers can override via the `divider` slot
- Orientation and split position exposed via `data-orientation` / `data-split-percent`

## Props

- `label`: string (**required**) — aria-label for the container
- `orientation`: `"horizontal" | "vertical"` (default `"horizontal"`)
- `splitPercent`: number 0–100 (default `50`)

## Slots

- `primary` (**required**) — first panel content
- `secondary` (**required**) — second panel content
- `divider` (optional) — custom divider content; replaces the default separator

## Usage

```vue
<SplitView label="Editor" orientation="horizontal" :split-percent="60">
    <template #primary>
        <FileTree />
    </template>
    <template #secondary>
        <Editor />
    </template>
</SplitView>
```

## ARIA

- Default divider: `role="separator"`, `aria-orientation`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `tabindex="0"`
- Container has `aria-label`

## When to Use

- For two side-by-side panels that the user may resize
- For an editor + preview, or list + detail layout

## When Not to Use

- For three or more panels — compose multiple `SplitView`s

## Headless

Renders semantic HTML and ARIA only. Consumers supply CSS to lay out the panels (e.g. flex / grid) and wire up resize handlers.

## Testing

- Verify root `split-view` class and `aria-label`
- Verify primary and secondary slots are rendered
- Verify default divider has `role="separator"` with correct ARIA values
- Verify the `divider` slot overrides the default

## References

- [Adobe Spectrum — Split View](https://spectrum.adobe.com/page/split-view/)
- [WAI-ARIA Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)
