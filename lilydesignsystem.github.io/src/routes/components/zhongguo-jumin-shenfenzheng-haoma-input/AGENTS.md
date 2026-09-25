# ZhongguoJuminShenfenzhengHaomaInput

## Metadata

- Component: zhongguo-jumin-shenfenzheng-haoma-input
- PascalCase: ZhongguoJuminShenfenzhengHaomaInput
- Description: an input for entering China's 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)
- Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow
- HTML tag: <input>
- CSS class: .zhongguo-jumin-shenfenzheng-haoma-input
- Interactive: yes

## Key Behaviors

- Renders as `<input type="text">` with class `zhongguo-jumin-shenfenzheng-haoma-input`
- Format: Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits — a value of 10 is written as the letter X.
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

- [x] Renders <input> element with class="zhongguo-jumin-shenfenzheng-haoma-input"
- [x] Has aria-label attribute
- [x] autocomplete="off"
- [ ] WCAG 2.2 AAA compliant — Svelte only verified so far; other 6 catalogs pending
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .zhongguo-jumin-shenfenzheng-haoma-input in css-style-sheet-template.css
- Companion: ZhongguoJuminShenfenzhengHaomaView
- Wikipedia: [Resident Identity Card](https://en.wikipedia.org/wiki/Resident_Identity_Card)
