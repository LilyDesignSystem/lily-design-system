# MedicationView

## Metadata

- Component: medication-view
- PascalCase: MedicationView
- Description: a read-only display of a medicine, with its name, strength, form, route and frequency
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <span>
- CSS class: .medication-view
- Interactive: no

## Key Behaviors

- Renders `<span class="medication-view">` with parts `-name`, `-strength`, `-form`, `-route` and `-frequency`
- Tall man letters come from the consumer as marked segments of the name (`nameSegments`), each marked part rendered as `.medication-view-tall-man`; nothing is marked automatically
- The strength arrives formatted by the consumer: `formatQuantity` writes `5 mg`, never `5.0 mg`, and `0.5 mg`, never `.5 mg`
- No part is ever truncated

## ARIA

- No role and no `aria-label`; `label` renders as hidden text. Each part is text

## Keyboard

- Not interactive

## Props

- `name`: string (optional) — the name as plain text
- `nameSegments`: { text, tallMan? }[] (optional) — the name in parts, with tall man letters marked; used instead of `name`
- `strength`: string (optional) — the strength, formatted by the consumer
- `form`: string (optional) — the dose form
- `route`: string (optional) — the route
- `frequency`: string (optional) — how often
- `label`: string (optional) — hidden text naming the value
- `...restProps`: any — additional HTML attributes spread onto the root

## Acceptance Criteria

- [x] Renders <span> with class="medication-view"
- [x] Each part renders
- [x] Only the consumer's segments are marked tall man
- [x] A name with capitals, such as `HCl`, is not marked
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .medication-view in css-style-sheet-template.css
- ISMP guidelines for electronic communication of medication information: https://online.ecri.org/hubfs/ISMP/Resources/ISMP_Electronic_Guidelines.pdf
- ISMP Canada TALLman principles: https://www.ismp-canada.org/download/TALLman/Principles_for_the_Application_of_TALLman_Lettering_in_Canada.pdf
- Spec: spec/healthcare-ui/index.md
