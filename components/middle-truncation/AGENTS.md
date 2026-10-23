# MiddleTruncation

## Metadata

- Component: middle-truncation
- PascalCase: MiddleTruncation
- Description: a string shortened in the middle to fit its width, keeping the start and the end
- Status: experimental — implemented and tested in all nine headless catalogs (2026-10-23); Blazor (`MaxCharacters`), Nunjucks and HTML measure differently, see index.md
- HTML tag: <span>
- CSS class: .middle-truncation
- Interactive: no

## Key Behaviors

- Renders a `<span class="middle-truncation">` holding two child spans: `.middle-truncation-visual` (`aria-hidden="true"`, the shortened string) and `.middle-truncation-full` (the whole text)
- Measures the visual text in the root's own font (canvas text metrics) against the root's width, and re-measures when the root resizes; before that, on the server and with no layout width, the full text is shown
- Strategies: `even` (start and end share the room), `fixed-end` (exactly `end` characters at the end), `min-end` (even, but at least `end` at the end)
- Cuts on grapheme clusters, never inside a surrogate pair, a combining sequence or an emoji
- Sets `data-strategy`, and `data-truncated` while the text is shortened
- Spreads `restProps` onto the root `<span>`
- The pure algorithm is `shared/middle-truncation.ts` (`truncateMiddle`, `splitGraphemes`)

## ARIA

- The shortened string is `aria-hidden="true"`; the full text in `.middle-truncation-full` is what assistive technology, find-in-page and copy receive
- No role and no `aria-label`: the text content is the accessible content (a `title` attribute would reach hovering pointers only)

## Keyboard

- None

## Props

- `class`: string (default: `""`) -- appended to the base class
- `text`: string (required) -- the full text
- `ellipsis`: string (required) -- the cut marker; no default, the headless layer ships no text
- `strategy`: `"even" | "fixed-end" | "min-end"` (default: `"even"`)
- `end`: number (optional) -- characters kept at the end for `fixed-end` and `min-end`; ignored by `even`
- `...restProps`: HTML attributes -- spread onto the root `<span>`

## Consumer CSS (the component ships none)

- Root: `display: block; overflow: hidden; white-space: nowrap` and a bounded width, so there is a width to measure
- `.middle-truncation-full`: visually hidden (clipped to a 1px box, `position: absolute`), never `display: none` or `hidden`, which would remove it from the accessibility tree

## Acceptance Criteria

- [ ] Renders a <span> with class="middle-truncation" first in its class list
- [ ] The shortened text is aria-hidden and the full text is not
- [ ] `ellipsis` has no default
- [ ] `fixed-end` keeps exactly `end` characters; `end` of 0 keeps none
- [ ] Never splits a grapheme cluster
- [ ] Re-measures on resize and changes only the visual string
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.middle-truncation` in css-style-sheet-template.css
- Algorithm: shared/middle-truncation.ts
- Origin: the chanhdai.com / sv-chanhdai `middle-truncation`, which renders only the shortened string ([chanhdai-lessons](../../spec/chanhdai-lessons/index.md) item 12)
