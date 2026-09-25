# UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput

## Metadata

- Component: ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input
- PascalCase: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput
- Description: an input for entering Ukraine's Реєстраційний номер облікової картки платника податків (РНОКПП)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input`
- Format: Ten digits. The first five encode date of birth as the number of days elapsed since 1 January 1900; the next four are a registration sequence number, whose own last digit's parity encodes sex (odd male, even female); the tenth digit is a check digit computed with a weighted-sum algorithm over the first nine digits.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding

## ARIA

- `aria-label` provides accessible name from label prop
- `required` and `disabled` states conveyed to assistive technology

## Keyboard

- Standard text input keyboard behavior

## Props

- `label`: string (required) — accessible label via aria-label
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <input> element with class="ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input in css-style-sheet-template.css
- Companion: UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView
- Wikipedia: [Taxpayer Identification Number § Ukraine](https://en.wikipedia.org/wiki/Taxpayer_Identification_Number)
