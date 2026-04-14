# Loading

A loading indicator communicates that content or an action is being processed, using text, an image, or an animation. Loading indicators help users understand that the system is working and they should wait.

This headless component uses a `<div>` element with `role="status"` and `aria-live="polite"` to announce loading state changes to screen readers.

## Implementation Notes

- Uses `<div>` element with `role="status"` for screen reader announcements
- `aria-live="polite"` announces loading state changes without interrupting
- `aria-label` provides a text description of the loading state
- Content is provided through child elements (text, spinner, animation)

## Props

- `label`: string (default: "Loading") -- accessible label for the loading state
- `children`: slot (optional) -- loading indicator content (text, spinner, etc.)
- `...restProps`: Any additional HTML attributes

## Usage

Page-level loading overlay:

```html
<Loading label="Loading dashboard">
  <span>Loading dashboard...</span>
</Loading>
```

Section loading with a spinner and descriptive text:

```html
<Loading label="Uploading file">
  <ProgressSpinner label="Uploading" />
  <span>Uploading report.pdf...</span>
</Loading>
```

Simple text-only loading indicator:

```html
<Loading label="Fetching results">Fetching results...</Loading>
```

## Keyboard Interactions

- None -- loading indicators are informational, not interactive

## ARIA

- `role="status"` -- creates an ARIA live region for loading announcements
- `aria-live="polite"` -- announces changes without interrupting current speech
- `aria-label` -- describes the loading state

## When to Use

- Use Loading as a page-level or section-level indicator when content is being fetched, computed, or processed.
- Use Loading to provide feedback during asynchronous operations such as API calls or route transitions.
- Use Loading when the loading indicator needs to contain text, images, or animations as children.
- Use Loading to wrap a ProgressSpinner with additional context text for larger content areas.
- Use Loading for full-page overlays while initial data is being retrieved.

## When Not to Use

- Do not use Loading for inline spinners next to a button or field -- use ProgressSpinner instead.
- Do not use Loading for content placeholders that match the layout shape -- use Skeleton instead.
- Do not use Loading for instant operations that complete without noticeable delay.
- Do not use Loading when a progress percentage is available -- use Progress or ProgressCircle instead.

## Headless

This component provides `role="status"` with `aria-live="polite"` for accessible loading announcements, with zero visual styling. The consumer is responsible for all CSS including spinner animation, text styling, overlay, positioning, and size.

## Styles

The consumer provides all CSS styling. The component renders with a `.loading` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `loading`
- Verify `role="status"` is present
- Verify `aria-live="polite"` is present
- Verify `aria-label` is applied
- Verify pass-through attributes are applied

## Advice

- **Designers**: Provide clear visual feedback that something is happening. Use consistent loading indicators across the application. Consider skeleton screens for content-heavy pages.
- **Developers**: Use `aria-live="polite"` to avoid interrupting screen reader users. Update the `label` prop to reflect the current loading context.
