# Zhongguo Jumin Shenfenzheng Haoma Input

ZhongguoJuminShenfenzhengHaomaInput is a headless input for entering China's 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ), China's government-issued personal identifier. It renders as `<input type="text">` with `autocomplete="off"` to protect sensitive identifiers. It is the editable companion to ZhongguoJuminShenfenzhengHaomaView.

**Status:** beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.

## Implementation Notes

- Renders as `<input type="text">`
- Format: Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits — a value of 10 is written as the letter X.
- `autocomplete="off"` to protect sensitive identifiers
- Supports two-way binding on the `value` prop
- Companion to ZhongguoJuminShenfenzhengHaomaView

## Props

- `label`: string (required) — accessible label via `aria-label`
- `value`: string (default: "") — bindable input value
- `required`: boolean (default: false) — form validation
- `disabled`: boolean (default: false) — disabled state
- `...restProps`: any — additional HTML attributes spread onto the `<input>`

## Usage

```html
<Field label="居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)" required>
  <ZhongguoJuminShenfenzhengHaomaInput label="居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)" value={value} required />
  <Hint>Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits — a value of 10 is written as the letter X.</Hint>
  <ErrorMessage>Please enter a valid 居民身份证号码</ErrorMessage>
</Field>
```

## ARIA

- `aria-label={label}` — provides accessible name

## When to Use

- Use in forms collecting China's 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ).
- Use in administrative or national-id workflows where the identifier is required.

## When Not to Use

- Do not use for displaying read-only identifiers — use `zhongguo-jumin-shenfenzheng-haoma-view` instead.
- Do not use for general text input — use `text-input` instead.
- Do not use for other countries' identifiers — use the corresponding country-specific input.

## Headless

This headless component ships zero CSS. The consumer provides all styling targeting the `.zhongguo-jumin-shenfenzheng-haoma-input` class hook.

## Testing

- Verify renders an `<input>` with the correct class and `type="text"`
- Verify `aria-label` is set from the `label` prop
- Verify `autocomplete="off"`
- Verify value binding works

## Domain Knowledge

Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits — a value of 10 is written as the letter X.

**Where to find it:** Printed on the Resident Identity Card (居民身份证) and required for essentially all administrative services in China, including medical insurance enrolment.

## Related components

- `zhongguo-jumin-shenfenzheng-haoma-view` — a read-only display of China's 居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ)
- `text-input` — a single-line text input field <input type="text">

## References

- Wikipedia: [Resident Identity Card](https://en.wikipedia.org/wiki/Resident_Identity_Card)

---

Lily™ and Lily Design System™ are trademarks.
