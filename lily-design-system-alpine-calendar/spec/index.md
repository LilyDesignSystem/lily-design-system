# Lily Design System™ — Alpine.js CalendarView — Specification

Living specification. Project-wide rules: [root spec](../../spec/index.md). The contract is the Svelte reference
([spec](../../lily-design-system-svelte-calendar/spec/index.md)); where they differ, Svelte wins.

## 1. Scope

### Built (0.1.0)

- Month and week views of whole weeks; `weekStart`; weekday headers from `labels.weekdayAbbr` / `weekdayName`.
- Previous / next / today with `aria-disabled` at `minDate` / `maxDate`; the shown period announced (`periodAnnouncement`, polite) however it changes.
- A picked day (`aria-selected`), today (`aria-current="date"`), outside days (`data-outside`), disabled days (`aria-disabled`).
- Events as buttons inside their day, emitting `lily:event` without picking the day.
- APG date-grid keys with a roving tabindex and right-to-left (shared `direction`); UTC date maths on ISO strings.

### Not built yet

The four-week view, typed event fields and inline editing, search, `filter`, `eventCompare`, export, `onFieldEdit`, a year / month
picker, multi-day events, unavailable-day patterns (`unavailable`).

## 2. Rules

- No CSS, no text, no icons; every string is a `labels.*` value.
- No default locale: weekday and period text come from `labels` / `Intl` in the consumer.
- Shared pure modules are copies of `shared/`; edit `shared/`.

## 3. Acceptance criteria

- [x] `pnpm test` passes (date maths, month and week views, navigation and bounds, picking, keyboard, right-to-left).
- [x] `pnpm build` emits `dist/` with types.
- [x] Tests were checked by breaking the code (month clamping, bounds, keyboard carry, disabled picking).
- [ ] The not-built list above.

## Related topics

[helpers](../../spec/helpers/index.md), [Alpine headless](../../lily-design-system-alpine-headless/spec/index.md).

Lily™ and Lily Design System™ are trademarks.
