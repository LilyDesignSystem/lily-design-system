# BackLink

A back link is a navigational component that allows users to return to a previous page or step within an application. It renders as a semantic anchor (`<a>`) element with optional `aria-label` for enhanced screen reader context.

Back links are especially important in mobile and multi-step interfaces, helping users maintain their sense of orientation and providing a clear, intuitive way to reverse navigation without relying solely on the browser's back button. Consumers add visual indicators (left arrow, chevron) via CSS or children content.

## Implementation Notes

- Renders as a semantic `<a>` element for backward navigation
- Same HTML pattern as a standard link but semantically represents "going back"
- Supports an optional `aria-label` override for more descriptive screen reader text
- All link text is provided through the children snippet
- Spreads `...restProps` onto the `<a>` element

## Props

- `href`: string (required) -- the URL to navigate back to
- `label`: string (optional, default: undefined) -- accessible label override via `aria-label`
- `children`: Snippet (required) -- the link text/content
- `...restProps`: Any additional HTML attributes spread onto the `<a>`

## Usage

```svelte
<BackLink href="/previous-page">Back to previous page</BackLink>
<BackLink href="/dashboard" label="Return to dashboard">Back</BackLink>
```

## Keyboard Interactions

- Tab: Focus the link
- Enter: Activate the link (browser default)

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for descriptive screen reader text, set from the `label` prop
