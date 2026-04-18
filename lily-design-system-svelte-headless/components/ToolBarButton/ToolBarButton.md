# ToolBarButton

A tool bar button is a single button within a toolbar, rendered as a native `<button>` element for proper keyboard and screen reader support. It is designed to be placed inside a ToolBar container that manages roving focus keyboard navigation.

The component uses `<button type="button">` to avoid unintended form submissions and supports the `disabled` attribute for disabling interaction. Content is provided through the children snippet, allowing full flexibility in button content.

## Implementation Notes

- Renders as a `<button type="button">` element for native button semantics
- Supports a `disabled` prop to disable the button
- Content is provided through the Svelte 5 `children` Snippet
- Passes through all additional HTML attributes via `...restProps`
- Compound component: must be used inside a ToolBar container that manages keyboard navigation

## Props

- `disabled`: boolean (default: false) -- whether the button is disabled
- `children`: Snippet (required) -- button content
- `...restProps`: Any additional HTML attributes passed to the `<button>` element

## Usage

```svelte
<ToolBar label="Editor tools">
  <ToolBarButton>Bold</ToolBarButton>
  <ToolBarButton>Italic</ToolBarButton>
  <ToolBarButton disabled>Redo</ToolBarButton>
</ToolBar>
```

## Keyboard Interactions

- Tab: Focus the button (when not inside a ToolBar managing roving focus)
- Enter / Space: Activate the button (browser default)
- Arrow keys: Handled by parent ToolBar for roving focus navigation
- Button is skipped in tab order when `disabled` is true

## ARIA

- Implicit `button` role from the `<button>` element
- `disabled` attribute communicates disabled state to assistive technology

## References

- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/toolbar/
