# Zhongguo Jumin Shenfenzheng Haoma View

ZhongguoJuminShenfenzhengHaomaView is a headless read-only display of China's 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ), China's government-issued personal identifier. It renders as a `<span>` with an accessible label. It is the read-only companion to ZhongguoJuminShenfenzhengHaomaInput.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<span>`
- Format: Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits — a value of 10 is written as the letter X.
- Provides accessible name via the `label` prop
- Companion to ZhongguoJuminShenfenzhengHaomaInput

## Props

- `value`: string (default: "") — the identifier to display
- `label`: string (required) — accessible label via `aria-label`
- `...restProps`: any — additional HTML attributes spread onto the `<span>`

## Usage

```html
<SummaryList>
  <SummaryListItem term="居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)">
    <ZhongguoJuminShenfenzhengHaomaView label="居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)" value={value} />
  </SummaryListItem>
</SummaryList>
```

## ARIA

- `aria-label={label}` — provides the accessible name

## When to Use

- Use to display a stored China 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ) read-only.
- Use in summary lists, patient records, audit logs, or detail views.
- Use when the identifier should not be editable in the current context.

## When Not to Use

- Do not use for editing identifiers — use `zhongguo-jumin-shenfenzheng-haoma-input` instead.
- Do not use for general text display — use a `<span>` directly.
- Do not use for other countries' identifiers — use the corresponding country-specific view.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.zhongguo-jumin-shenfenzheng-haoma-view` class hook.

## Testing

- Verify renders a `<span>` with the correct class
- Verify the `value` prop is rendered as text content
- Verify `aria-label` is set from the `label` prop

## Domain Knowledge

Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits — a value of 10 is written as the letter X.

**Where to find it:** Printed on the Resident Identity Card (居民身份证) and required for essentially all administrative services in China, including medical insurance enrolment.

## Related components

- `zhongguo-jumin-shenfenzheng-haoma-input` — an input for entering China's 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)
- `summary-list-item` — one key-value pair in a summary list

## References

- Wikipedia: [Resident Identity Card](https://en.wikipedia.org/wiki/Resident_Identity_Card)

---

Lily™ and Lily Design System™ are trademarks.
