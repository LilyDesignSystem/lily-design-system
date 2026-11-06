# UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView

## Metadata

- Component: ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view
- PascalCase: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView
- Description: a read-only display of Ukraine's Реєстраційний номер облікової картки платника податків (РНОКПП)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view
- Interactive: no

## Key Behaviors

- Renders as `<span>` with class `ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view`
- Format: Ten digits. The first five encode date of birth as the number of days elapsed since 1 January 1900; the next four are a registration sequence number, whose own last digit's parity encodes sex (odd male, even female); the tenth digit is a check digit computed with a weighted-sum algorithm over the first nine digits.
- Read-only; not editable

## ARIA

- No ARIA. A plain `<span>` cannot be named: `aria-label` is prohibited on it, and most screen readers drop it. A visible caption names the value, or the optional `label` renders as hidden text

## Keyboard

- Not interactive

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> element with class="ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view"
- [x] Renders `value` as text content
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view in css-style-sheet-template.css
- Companion: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput
- Wikipedia: [Taxpayer Identification Number § Ukraine](https://en.wikipedia.org/wiki/Taxpayer_Identification_Number)
