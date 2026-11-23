# InsetText

## Metadata

- Component: inset-text
- PascalCase: InsetText
- Description: indented text to distinguish it from surrounding content
- Purpose: Sets supplementary text apart from the body, such as a quotation or an aside, so the reader can tell it from the main flow. It never holds the only statement of a requirement.
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .inset-text
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="note"` to semantically indicate supplementary content.
- Content is passed via the `children` slot, allowing any markup structure inside the inset.
- Spreads `restProps` onto the container for consumer customization.
- No internal state management; this is a purely presentational container.
- Inspired by the GOV.UK and NHS England design system "inset text" pattern.

## ARIA

- `role="note"` -- identifies the content as a note or supplementary information, so screen readers announce it with appropriate context.

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `children`: slot (required) -- content to display inside the inset text block.
- `...restProps`: unknown -- additional attributes spread onto the container `<div>`.

## Mobile

Decisions: [mobile/components-mobile.tsv](../../mobile/components-mobile.tsv) (`lily` on both). Tests: `lily-design-system-swift/Tests/LilyUITests`, `lily-design-system-kotlin/lily-compose/src/test`.

- Apple: `InsetText { … }` in `LilyUI`: one combined element (the web's role="note"). Style: `InsetTextStyle`.
- Android: `InsetText { … }` in `lily-compose`: one merged TalkBack stop.

## Acceptance Criteria

- [ ] Renders <div> element with class="inset-text"
- [ ] Has role="note"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .inset-text in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/inset-text.html
- WAI-ARIA Note Role: https://www.w3.org/TR/wai-aria-1.2/#note
- GOV.UK Inset Text: https://design-system.service.gov.uk/components/inset-text/
- NHS England Inset Text: https://service-manual.nhs.uk/design-system/components/inset-text
