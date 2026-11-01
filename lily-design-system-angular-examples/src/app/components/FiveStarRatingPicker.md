# FiveStarRatingPicker

a picker for selecting a 1-5 star rating using radio buttons

This is the Angular headless implementation. See `components/five-star-rating-picker/index.md`
in the canonical repo root for the cross-framework documentation.

## Selector

```html
<lily-five-star-rating-picker
  label="Rating"
  name="rating"
  [(value)]="rating"
></lily-five-star-rating-picker>
```

A `<fieldset role="radiogroup">` of five native radios (values 1 to 5) sharing `name`; the browser gives the keys (Tab to
the checked radio, the arrows move and check, Space checks).

## Inputs

- `label` (string) — accessible name, `aria-label`
- `value` (number, two-way `model`, 0 = none) — the checked radio; a form reset restores it
- `name` (string) — the radios' shared name
- `starLabel` (`(n: number) => string`) — each option's text; the number alone by default (no English)
- `disabled` (boolean) — disables the whole group
- `className` (string) — appended to the root's class list

## Files

- `FiveStarRatingPicker.ts` — standalone Angular 20 component (signal inputs, OnPush)
- `FiveStarRatingPicker.spec.ts` — vitest + TestBed render test
