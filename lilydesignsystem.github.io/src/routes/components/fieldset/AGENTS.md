# Fieldset

## Metadata

- Component: fieldset
- PascalCase: Fieldset
- Description: a group of related form fields with a legend
- HTML tag: <fieldset>
- CSS class: .fieldset
- Interactive: no

## Key Behaviors

- Uses native `<fieldset>` element with a `<legend>` child for semantic form grouping
- The `disabled` attribute on `<fieldset>` natively disables all descendant form controls
- Spreads `restProps` onto the `<fieldset>` element for consumer customization
- No custom ARIA needed because native elements handle group semantics

## ARIA

- No custom ARIA attributes required -- native `<fieldset>` and `<legend>` elements provide built-in group semantics and labeling for screen readers

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `legend`: string (required) -- text for the `<legend>` element describing the group
- `disabled`: boolean (default: false) -- whether all controls in the fieldset are disabled
- `children`: slot (required) -- grouped form controls

## Acceptance Criteria

- [ ] Renders <fieldset> element with class="fieldset"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .fieldset in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/fieldset.html
- HTML Specification fieldset: https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element
