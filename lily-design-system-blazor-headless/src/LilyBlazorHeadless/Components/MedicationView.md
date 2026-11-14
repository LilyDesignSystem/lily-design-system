# MedicationView

A read-only display of a medicine, with its name, strength, form, route and frequency.

A Blazor component that renders `<span>`.

See `components/medication-view/index.md` for the canonical documentation, and [spec/healthcare-ui](https://github.com/LilyDesignSystem/lily-design-system/blob/main/spec/healthcare-ui/index.md) for the rules.

## Props

- `Name`: string (optional) — the name as plain text
- `NameSegments`: { text, tallMan? }[] (optional) — the name in parts, with tall man letters marked; used instead of `name`
- `Strength`: string (optional) — the strength, formatted by the consumer
- `Form`: string (optional) — the dose form
- `Route`: string (optional) — the route
- `Frequency`: string (optional) — how often
- `Label`: string (optional) — hidden text naming the value

---

Lily™ and Lily Design System™ are trademarks.
