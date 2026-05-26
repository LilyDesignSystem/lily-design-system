# End Notes

## Metadata

- Component: end-notes
- PascalCase: EndNotes
- Description: a section of titled endnote items at the end of an article
- HTML tag: <section>
- CSS class: .end-notes
- Interactive: no

## Key Behaviors

- Wraps endnote content in a semantic section
- Each endnote item can have a title and body
- Used for methodology, sources, credits, corrections
- Inspired by Reuters Graphics EndNotes component

## ARIA

- Implicit `region` role from `<section>` with `aria-label`

## Keyboard

- None

## Props

- `label`: string (default: "End notes") -- accessible label for the section
- `children`: slot (required) -- endnote content items
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <section> element with class="end-notes"
- [ ] Has aria-label attribute (default: "End notes")
- [ ] Renders children slot for endnote content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .end-notes in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/end-notes.html
