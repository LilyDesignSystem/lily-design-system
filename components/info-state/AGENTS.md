# InfoState

## Metadata

- Component: info-state
- PascalCase: InfoState
- Description: a composition of illustration, title, description, and action for empty, error, or info states
- HTML tag: <section>
- CSS class: .info-state
- Interactive: no (focusable controls inside action slot manage their own behavior)

## Key Behaviors

- Renders `<section role="status" aria-label={label || title} data-level={level}>`
- Title renders inside `<h2>`; description renders inside `<p>` when provided
- Optional illustration slot above title
- Optional action slot below description
- Children slot replaces structured layout when provided
- Variant levels: info, empty, error, success

## ARIA

- `role="status"` on section
- `aria-label` defaults to title; overridable via label prop
- `data-level` attribute exposes variant for CSS

## Keyboard

- None on container
- Focusable children inside the action slot follow their own keyboard behavior

## Props

- `level`: "info" | "empty" | "error" | "success" (default: "info")
- `title`: string (required)
- `description`: string (optional)
- `label`: string (optional)
- `illustration`: slot (optional)
- `action`: slot (optional)
- `children`: slot (optional) -- replaces structured layout
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <section> element with class="info-state"
- [ ] role="status" applied
- [ ] data-level attribute matches level prop
- [ ] Title renders inside <h2>
- [ ] Description renders inside <p> when provided
- [ ] illustration and action slots render when provided
- [ ] aria-label defaults to title; overridable by label prop
- [ ] children replaces structured layout when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .info-state in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/info-state.html
- WAI-ARIA status role: https://www.w3.org/TR/wai-aria-1.2/#status
