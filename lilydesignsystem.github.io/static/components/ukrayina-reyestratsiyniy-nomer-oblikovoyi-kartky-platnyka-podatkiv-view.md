# Ukrayina Reyestratsiyniy Nomer Oblikovoyi Kartky Platnyka Podatkiv View

UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView is a headless read-only display of Ukraine's Реєстраційний номер облікової картки платника податків (РНОКПП), Ukraine's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Ten digits. The first five encode date of birth as the number of days elapsed since 1 January 1900; the next four are a registration sequence number, whose own last digit's parity encodes sex (odd male, even female); the tenth digit is a check digit computed with a weighted-sum algorithm over the first nine digits.
- Provides accessible name via the `label` prop
- Companion to UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="Реєстраційний номер облікової картки платника податків (РНОКПП)">
    <UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView label="Реєстраційний номер облікової картки платника податків (РНОКПП)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored Ukraine Реєстраційний номер облікової картки платника податків (РНОКПП) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Ten digits. The first five encode date of birth as the number of days elapsed since 1 January 1900; the next four are a registration sequence number, whose own last digit's parity encodes sex (odd male, even female); the tenth digit is a check digit computed with a weighted-sum algorithm over the first nine digits.

**Where to find it:** Printed on the Taxpayer Registration Card (Картка платника податків) and required for employment, banking, and Ukraine's mandatory state social (including health) insurance records.

## Related components

- `ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input` — an input for entering Ukraine's Реєстраційний номер облікової картки платника податків (РНОКПП)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Taxpayer Identification Number § Ukraine](https://en.wikipedia.org/wiki/Taxpayer_Identification_Number)

---

Lily™ and Lily Design System™ are trademarks.
