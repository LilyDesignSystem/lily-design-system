# DataFilterForm

## Metadata

- Component: data-filter-form
- PascalCase: DataFilterForm
- Description: a form for filtering data by criteria
- HTML tag: <form>
- CSS class: .data-filter-form
- Interactive: no

## Key Behaviors

- Renders a `<form>` element with `role="search"` for assistive technology
- Calls `event.preventDefault()` on submit to allow consumer-controlled filter logic
- Passes `onreset` directly to the form for native reset behavior
- Spreads `restProps` onto the `<form>` for consumer customization

## ARIA

- `role="search"` -- identifies the form as a search landmark for assistive technology
- `aria-label={label}` -- provides an accessible name for the search region

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the filter region, applied as `aria-label`
- `onsubmit`: (event: SubmitEvent) => void (default: undefined) -- callback when the filter form is submitted
- `onreset`: (event: Event) => void (default: undefined) -- callback when the filter form is reset
- `children`: slot (required) -- filter controls rendered inside the form

## Acceptance Criteria

- [ ] Renders <form> element with class="data-filter-form"
- [ ] Has aria-label attribute
- [ ] Has role="search"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .data-filter-form in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/data-filter-form.html
- WAI-ARIA Landmark Roles: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
- ARIA search role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role
