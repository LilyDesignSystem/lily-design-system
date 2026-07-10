# End Notes

An end notes section contains titled endnote items at the end of an article. It is used for methodology, sources, credits, corrections, and other supplementary information.

This headless component uses a `<section>` element with an `aria-label` to create a labeled landmark region for endnote content.

## Implementation Notes

- Uses `<section>` element for landmark semantics
- `aria-label` describes the endnotes section for screen readers (default: "End notes")
- Each endnote item can have a title and body
- Used for methodology, sources, credits, corrections
- Inspired by Reuters Graphics EndNotes component

## Props

- `label`: string (default: "End notes") -- accessible label for the section
- `children`: slot (required) -- endnote content items
- `...restProps`: Any additional HTML attributes

## Usage

```html
<EndNotes label="Notes and methodology">
  <div>
    <h3>Methodology</h3>
    <p>Data was collected from...</p>
  </div>
  <div>
    <h3>Sources</h3>
    <p>Reuters reporting, government data</p>
  </div>
</EndNotes>
```

```html
<EndNotes>
  <div>
    <h3>Credits</h3>
    <p>Photography by John Doe. Graphics by Jane Smith.</p>
  </div>
</EndNotes>
```

```html
<EndNotes label="Corrections and clarifications">
  <div>
    <h3>Correction</h3>
    <p>An earlier version of this article misstated the year. It has been corrected.</p>
  </div>
</EndNotes>
```

## Keyboard Interactions

- None

## ARIA

- Implicit `region` role from `<section>` element with `aria-label`
- `aria-label` -- describes the endnotes section for screen readers

## When to Use

- Use at the end of articles for methodology, sources, credits, corrections
- Use when supplementary information needs to be grouped in a labeled section
- Use for editorial transparency about data sources and methods

## When Not to Use

- Do not use for footnotes within body text -- use Footnote component
- Do not use for inline citations -- use Citation component
- Do not use for general page footers -- use Footer component

## Headless

This component provides a `<section>` element with `aria-label` for landmark navigation, with zero visual styling. The consumer is responsible for all CSS including spacing, typography, borders or dividers between endnote items, and responsive layout.

## Styles

The consumer provides all CSS styling. The component renders with a `.end-notes` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<section>` element with class `end-notes`
- Verify `aria-label` is applied (default: "End notes")
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Visually distinguish endnotes from body content with spacing or dividers. Use smaller text or muted colors to indicate supplementary status. Group related endnotes logically.
- **Developers**: Always provide a descriptive `label` prop for screen reader landmark navigation. Use appropriate heading levels within endnote items that follow the page heading hierarchy.

## Related components

- `footnote` — a footnote reference and content element
- `citation` — a citation acknowledges the relevance of a work of another to the topic of discussion

## References

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

---

Lily™ and Lily Design System™ are trademarks.
