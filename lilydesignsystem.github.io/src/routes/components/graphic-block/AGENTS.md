# Graphic Block

## Metadata

- Component: graphic-block
- PascalCase: GraphicBlock
- Description: a wrapper for charts and graphics with title, description, notes, and ARIA description
- HTML tag: <figure>
- CSS class: .graphic-block
- Interactive: no

## Key Behaviors

- Uses `<figure>` element for semantic graphic wrapper
- Title and description appear above the graphic content inside `<figcaption>`
- Notes/source text appears below the graphic content inside `<figcaption>`
- `aria-label` provides a full text alternative describing the graphic for screen readers

## ARIA

- Implicit `figure` role from `<figure>` element
- `aria-label` -- provides a full text alternative describing the graphic for screen readers
- `<figcaption>` -- provides visible caption text

## Keyboard

- None at the figure level -- interactive children handle their own keyboard interactions

## Props

- `title`: string (optional) -- title displayed above the graphic
- `description`: string (optional) -- description text below the title
- `notes`: string (optional) -- notes/source text below the graphic
- `label`: string (required) -- accessible label describing the graphic for screen readers
- `children`: slot (required) -- the graphic/chart content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <figure> element with class="graphic-block"
- [ ] Has aria-label attribute
- [ ] Title, description, and notes render inside <figcaption> when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .graphic-block in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/graphic-block.html
