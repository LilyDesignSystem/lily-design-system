# France Numero D Identification Au Repertoire View

FranceNumeroDIdentificationAuRepertoireView is a read-only display of a France numéro d'identification au répertoire (NIR), the unique national healthcare identifier. It renders the value as inline text inside a `<span>` with `aria-label` for accessibility. It is the display-only companion to FranceNumeroDIdentificationAuRepertoireInput.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

The NIR (also known as the Social Security number) is a 15-digit number printed on the Carte Vitale. It consists of a 13-digit base (sex, birth year, birth month, department, commune, order number) and a 2-digit control key.

## Implementation Notes

- No ARIA on the root: a plain `<span>` cannot be named. A visible caption names the value, or `label` renders as hidden text in a `.screen-reader-span`
- Displays the value as text content
- No formatting or validation; consumer provides the value pre-formatted
- Companion to FranceNumeroDIdentificationAuRepertoireInput for the Input/View pattern

## Props

- `label`: string (optional) — hidden text naming the value, in a `.screen-reader-span`. Leave it out when a visible caption names the value
- `value`: string (default: "") -- the NIR string to display
- `...restProps`: any -- additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem>
    <dt>Numéro de Sécurité Sociale</dt>
    <dd>
      <FranceNumeroDIdentificationAuRepertoireView
        label="NIR"
        value="1 85 05 75 012 345 67"
      />
    </dd>
  </SummaryListItem>
</SummaryList>
```

## Keyboard Interactions

- None (passive display-only component)

## ARIA

## When to Use

- Use to display a French NIR / Social Security number in a formatted, read-only view.
- Use in patient banners, summary lists, or medical records to show the NIR.
- Use in confirmation screens after identifier entry.

## When Not to Use

- Do not use for entering identifiers -- use FranceNumeroDIdentificationAuRepertoireInput instead.
- Do not use for editable display -- combine with Editable.
- Do not use for other national identifiers -- use the corresponding country-specific view component.

## Headless

This headless component provides a `<span>` with `aria-label`. The consumer provides all styling.

## Styles

The consumer provides all CSS styling. The component renders with a `.france-numero-d-identification-au-repertoire-view` class for targeting.

## Testing

- Verify renders a `<span>` with the correct class
- Verify `label` renders as hidden text, and that the root has no `aria-label`
- Verify value is displayed as text content
- Verify pass-through attributes are applied

## Domain Knowledge

Thirteen-digit "meaningful" code plus a two-digit check key, managed by INSEE in the Répertoire National d'Identification des Personnes Physiques (RNIPP). It encodes sex (1 male, 2 female), year and month of birth, INSEE département and commune of birth, and a serial number; commonly called the French social security number. The two-digit check key is computed as 97 minus the 13-digit number modulo 97 (Corsican département codes 2A/2B are substituted with 19/18 first) — a Modulo-97 scheme chosen because 97 is the largest prime below 100, which most reliably catches single-digit and transposition errors.

**Where to find it:** Carte Vitale health insurance card, payslips, tax forms, the Ameli health portal, France Connect, and pension correspondence.

## Security and privacy

A national identifier is personal data, and often a key to other records.

- The view shows exactly the text it is given; it does not mask. Pass the masked form (for example the last four characters) wherever the full number is not needed, and render the full number only to someone entitled to it.
- Do not log the value, put it in a URL or query string, or send it to analytics or an error tracker.
- Text on screen can be read over a shoulder and is kept by screenshots and screen recordings; treat a page that shows it as sensitive.

## Related components

- `france-numero-d-identification-au-repertoire-input` — an input for entering a France numéro d'identification au répertoire (NIR) unique national healthcare identifier
- `espana-tarjeta-sanitaria-individual-input` — an input for entering an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- `espana-tarjeta-sanitaria-individual-view` — a read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier
- `eire-individual-health-identifier-input` — an input for entering Eire Individual Health Identifier (IHI) unique national healthcare identifier
- `eire-individual-health-identifier-view` — a read-only display of Eire Individual Health Identifier (IHI) unique national healthcare identifier
- `tuaisceart-eireann-health-and-care-number-input` — an input for entering aTuaisceart Eireann Health and Care (H&C) Number unique national healthcare identifier

## References

- Ameli.fr: https://www.ameli.fr/assure/droits-demarches/principes/numero-securite-sociale

---

Lily™ and Lily Design System™ are trademarks.
