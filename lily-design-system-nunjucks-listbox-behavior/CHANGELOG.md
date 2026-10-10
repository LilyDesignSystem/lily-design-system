# Changelog — ListboxBehavior (Nunjucks)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-09-21

Initial release. `@lilydesignsystem/nunjucks-listbox-behavior` ships
`createListboxKeyboard(list, { clamp, typeahead, pageSize, onActivate,
onEscape, onTabOut })`, the WAI-ARIA APG listbox keyboard contract
(clamp/wrap, Home/End, typeahead, PageUp/PageDown, `aria-activedescendant`
mirroring) as a shared, framework-free client-side module. Lives here
rather than in `nunjucks-headless` because that catalog's macros are
markup-only by design (its own `package.json` states "Zero CSS, zero
dependencies") — the real duplication this module fixes was six
separate `*.client.js` files each hand-rolling the same ~150-line
implementation, not anything in the headless layer. Consumed by
`theme-picker`, `locale-picker`, `text-size-picker`, and
`motion-picker`; `share-picker` and `date-time-picker` have no
listbox to compose it into.

---

Lily™ and Lily Design System™ are trademarks.
