# Card

## Metadata

- Component: card
- PascalCase: Card
- Description: a grouped content container with header, body, and footer areas
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .card
- Interactive: yes

## Key Behaviors

- Renders a `<div>`: a card is not always a stand-alone item, and an `<article>` on every card in a list is noise for screen-reader users. Pass `role="article"` for a card that is one
- Heading level is configurable (2-6) for proper document outline structure
- When `href` is provided, the heading text wraps in an `<a>` element for navigation
- Optional `label` names the card, which then has `role="group"`; with no label the `<div>` is generic and unnamed
- Content is provided through child elements
- Passes through all additional HTML attributes via `...restProps`

## ARIA

- No role when unlabelled: a `<div>`
- `role="group"` and `aria-label` when `label` is given -- names the card as a group, not a landmark

## Keyboard

- Tab: Focus the heading link when `href` is provided
- Enter: Activate the heading link (browser default)

## Props

- `heading`: string (optional) -- heading text for the card
- `headingLevel`: 2 | 3 | 4 | 5 | 6 (default: 3) -- HTML heading level
- `href`: string (optional) -- makes the heading a link
- `wholeCardLink`: boolean (default: false) -- with `href`, marks the heading link `data-lily-card-link`, so the themes' "Whole-card link" section makes the whole card its target and draws the focus ring round it (Svelte, React, Vue, Solid, Angular; `whole-card-link` in Web Components; in the other catalogs write the heading yourself)
- `label`: string (optional) -- names the card (`aria-label`, with `role="group"`)
- `children`: slot (required) -- card body content
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Styles

The headless component ships no CSS. A Lily reference theme exposes these variables on the base `.card`; specialised
card components keep their own theme rules.

| Variable                    | Default                 |
| --------------------------- | ----------------------- |
| `--lily-card-background`    | `var(--lily-surface)`   |
| `--lily-card-color`         | `var(--lily-text)`      |
| `--lily-card-border-color`  | `var(--lily-border)`    |
| `--lily-card-border-radius` | `var(--lily-radius-lg)` |

## Mobile

Decisions: [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) (`lily` on both). Tests: `lily-design-system-swift/Tests/LilyUITests`, `lily-design-system-kotlin/lily-compose/src/test`.

- Apple: `Card(heading:headingLevel:label:content:)` in `LilyUI`: the heading is a header at levels 2 to 6 (`accessibilityHeading`); a `label` makes a named group. A linked card is not yet ported. Style: `CardStyle`.
- Android: `LilyCard(heading, label) { … }` in `lily-compose` (named for Material 3's `Card`): the heading is a `heading()` (Compose has no levels); a `label` makes a named traversal group.

## Acceptance Criteria

- [ ] Renders <div> element with class="card"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .card in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/card.html
