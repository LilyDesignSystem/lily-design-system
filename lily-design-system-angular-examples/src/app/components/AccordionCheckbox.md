# AccordionCheckbox

a checkbox option that reveals an accordion panel when checked

This is the Angular headless implementation. See `components/accordion-checkbox/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-accordion-checkbox
  label="Send me updates"
  [(checked)]="updates"
>
  <textarea aria-label="Topics"></textarea>
</lily-accordion-checkbox>
```

## Inputs

- `label`: string -- the checkbox label text; a missing name warns in development.
- `checked`: boolean, two-way -- whether the checkbox is checked and the panel shown. A form reset restores it.
- `id`: string -- base for the `{id}-checkbox` and `{id}-panel` ids; generated when not given.
- `className`: string -- appended to the root class list.

The root is a plain `<div>` with no `aria-label`: the checkbox's own label names it. Space toggles it, natively.

## Files

- `AccordionCheckbox.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `AccordionCheckbox.spec.ts` — vitest + TestBed render test
