# Medication View

MedicationView is a headless read-only display of a medicine: its name, strength, form, route and frequency, each in its own part and none ever truncated. It renders as a `<span>`. Lily ships no drug data and no tall man list.

**Status:** experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.

## Implementation Notes

- Renders `<span class="medication-view">` with parts `-name`, `-strength`, `-form`, `-route` and `-frequency`
- Tall man letters come from the consumer as marked segments of the name (`nameSegments`), each marked part rendered as `.medication-view-tall-man`; nothing is marked automatically
- The strength arrives formatted by the consumer: `formatQuantity` writes `5 mg`, never `5.0 mg`, and `0.5 mg`, never `.5 mg`
- No part is ever truncated

## Props

- `name`: string (optional) — the name as plain text
- `nameSegments`: { text, tallMan? }[] (optional) — the name in parts, with tall man letters marked; used instead of `name`
- `strength`: string (optional) — the strength, formatted by the consumer
- `form`: string (optional) — the dose form
- `route`: string (optional) — the route
- `frequency`: string (optional) — how often
- `label`: string (optional) — hidden text naming the value
- `...restProps`: any — additional HTML attributes spread onto the root

## Usage

```html
<MedicationView
  nameSegments={[{ text: "hydr" }, { text: "ALAZINE", tallMan: true }]}
  strength="25 mg"
  form="tablet"
  route="oral"
  frequency="twice daily"
/>
```

## Keyboard Interactions

None. This is not an interactive component.

## ARIA

- No role and no `aria-label`; `label` renders as hidden text. Each part is text

## When to Use

- Use to show a prescribed or administered medicine.
- Use in a medication list, an administration chart or a decision-support card.
- Use wherever look-alike, sound-alike names need tall man letters.

## When Not to Use

- Do not use to prescribe — use a `form` with its own validated fields.
- Do not use for a non-medicine product — use plain text.

## Headless

This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the `.medication-view` class hook, and every word.

## Styles

`.medication-view` and its parts; make `.medication-view-tall-man` bold, never colour alone.

## Testing

- Each part renders
- Only the consumer's segments are marked tall man
- A name with capitals, such as `HCl`, is not marked

## Advice

- Generic names in lower case except tall man letters, from the FDA and ISMP lists or your country's (Australia and Canada publish their own).
- Write mL, never cc; avoid the abbreviations on ISMP's error-prone list.
- Never truncate a medicine name; let it wrap.

## Related components

- `observation-view` — a clinical observation or result
- `decision-support-card` — a clinical decision support card

## References

- ISMP guidelines for electronic communication of medication information: https://online.ecri.org/hubfs/ISMP/Resources/ISMP_Electronic_Guidelines.pdf
- ISMP Canada TALLman principles: https://www.ismp-canada.org/download/TALLman/Principles_for_the_Application_of_TALLman_Lettering_in_Canada.pdf
- Spec: spec/healthcare-ui/index.md

---

Lily™ and Lily Design System™ are trademarks.
