# Body Map

BodyMap is a headless picker for marking regions of the body, such as wound or pain sites: a `<fieldset>` named by its `<legend>`, holding the consumer's drawing and a list of real checkboxes, one per region. Lily ships no drawing.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<fieldset class="body-map">` with a `<legend>`, the drawing in `.body-map-figure` (`aria-hidden`), and `.body-map-regions`, a list of checkboxes
- The checkboxes are the control: they submit with the form under `name`, and a keyboard or screen-reader user chooses with them
- Where script runs, a click on a drawing shape marked `data-region` toggles its checkbox, and chosen shapes get `data-selected` for the theme (Svelte, React, Vue, Angular, Web Components)
- Blazor cannot read the click or mark shapes without JS interop: its `Drawing` fragment receives the chosen ids, so the consumer marks its own shapes; HTML, Nunjucks and Alpine leave the drawing to the consumer's script

## Props

- `label`: string (required) — the question, rendered as the `<legend>`
- `regions`: { id, label }[] (required) — the regions, in the order the list shows them
- `selected`: string[] (optional) — the chosen region ids (bindable or controlled)
- `name`: string (optional) — the checkboxes' form name
- `children`: slot (optional) — the drawing; mark each clickable shape with `data-region`
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<BodyMap label="Where is the pain?" name="sites" regions={[{ id: "head", label: "Head" }, { id: "chest", label: "Chest" }]}>
  <svg viewBox="0 0 40 80">
    <circle data-region="head" cx="20" cy="8" r="7" />
    <rect data-region="chest" x="10" y="17" width="20" height="22" />
  </svg>
</BodyMap>
```

## Keyboard Interactions

| Key   | Action                            |
| ----- | --------------------------------- |
| Tab   | Moves to the next region checkbox |
| Space | Toggles the focused region        |

## ARIA

- A native `<fieldset>` named by its `<legend>`; each checkbox is named by the region's words. The drawing is `aria-hidden`, since its shapes are not focusable; the list is the equivalent

## When to Use

- Use to record where a symptom, wound or injury is, on a drawing people recognise.
- Use where several regions may be chosen at once.

## When Not to Use

- Do not rely on the drawing alone; the region list is the accessible control and must stay visible.
- Do not use for a single choice of region — use `radio-group`.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.body-map` class hook, and every word.

## Styles

`.body-map` and its parts, and `[data-selected]` on the drawing's shapes.

## Testing

- The legend names the group; the drawing is hidden; each region is a checkbox
- Space toggles a region; a click on a shape toggles it where script runs
- Chosen regions submit with the form

## Advice

- Name each region in the words patients and clinicians both use; offer left and right from the patient's side, and say so.
- Draw front and back views as two body maps, or as two groups of shapes with distinct region ids.

## Related components

- `checkbox-group` — a group of checkbox inputs
- `figure` — a figure with a caption

## References

- Spec: spec/healthcare-ui/index.md

---

Lily™ and Lily Design System™ are trademarks.
