# Form

## Metadata

- Component: form
- PascalCase: Form
- Description: a form element for collecting and submitting user data
- HTML tag: <form>
- CSS class: .form
- Interactive: no

## Key Behaviors

- Renders a native `<form>` element with `aria-label` for accessible naming
- Automatically calls `event.preventDefault()` on submit before invoking the `onsubmit` callback
- Passes the raw `onreset` callback directly to the form (no default prevention)
- Accepts a `children` slot for form content (inputs, buttons, etc.)
- Spreads `restProps` for consumer customization

## ARIA

- `aria-label="..."` -- provides an accessible name for the form, helping screen readers identify its purpose

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the form via `aria-label`
- `onsubmit`: function (default: `undefined`) -- callback receiving `SubmitEvent` (default already prevented)
- `onreset`: function (default: `undefined`) -- callback receiving `Event` on form reset
- `children`: slot (required) -- form content to render inside
- `...restProps`: unknown -- additional attributes spread onto the `<form>`

## Acceptance Criteria

- [ ] Renders <form> element with class="form"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .form in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/form.html
- MDN `<form>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
