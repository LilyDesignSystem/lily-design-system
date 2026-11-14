# BodyMap

## Metadata

- Component: body-map
- PascalCase: BodyMap
- Description: a picker for marking regions of the body on a consumer-supplied drawing, with a checkbox for each region
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <fieldset>
- CSS class: .body-map
- Interactive: yes

## Key Behaviors

- Renders `<fieldset class="body-map">` with a `<legend>`, the drawing in `.body-map-figure` (`aria-hidden`), and `.body-map-regions`, a list of checkboxes
- The checkboxes are the control: they submit with the form under `name`, and a keyboard or screen-reader user chooses with them
- Where script runs, a click on a drawing shape marked `data-region` toggles its checkbox, and chosen shapes get `data-selected` for the theme (Svelte, React, Vue, Angular, Web Components)
- Blazor cannot read the click or mark shapes without JS interop: its `Drawing` fragment receives the chosen ids, so the consumer marks its own shapes; HTML, Nunjucks and Alpine leave the drawing to the consumer's script

## ARIA

- A native `<fieldset>` named by its `<legend>`; each checkbox is named by the region's words. The drawing is `aria-hidden`, since its shapes are not focusable; the list is the equivalent

## Keyboard

- Tab moves through the checkboxes; Space toggles one

## Props

- `label`: string (required) — the question, rendered as the `<legend>`
- `regions`: { id, label }[] (required) — the regions, in the order the list shows them
- `selected`: string[] (optional) — the chosen region ids (bindable or controlled)
- `name`: string (optional) — the checkboxes' form name
- `children`: slot (optional) — the drawing; mark each clickable shape with `data-region`
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <fieldset> with class="body-map"
- [x] The legend names the group; the drawing is hidden; each region is a checkbox
- [x] Space toggles a region; a click on a shape toggles it where script runs
- [x] Chosen regions submit with the form
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .body-map in css-style-sheet-template.css
- Spec: spec/healthcare-ui/index.md
