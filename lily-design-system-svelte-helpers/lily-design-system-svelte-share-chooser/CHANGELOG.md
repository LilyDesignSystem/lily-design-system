# Changelog — ShareChooser (Svelte)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

### Changed (BREAKING)

- Renamed from `lily-design-system-svelte-share-button`. Directory,
  component (`ShareChooser.svelte`), exported symbols (`ShareChooser`,
  `nextShareChooserId`) and class hooks (`share-chooser`,
  `share-chooser-button`, `share-chooser-icon`, `share-chooser-list`,
  `share-chooser-list-item`, `share-chooser-target`,
  `share-chooser-copy`, `share-chooser-status`) all carry the new name.
- **The trigger's class hook is now `share-chooser-button`**, replacing
  `share-chooser-trigger`. That exception existed only because
  `.share-button-button` read badly; under the new name the problem
  disappears, so this helper follows the same `{helper}-button`
  convention as its siblings. The documented exception is removed.
- A headless Svelte 5 share control: a single-glyph button (➤) that
  opens the native share sheet via `navigator.share` where the browser
  has one, and otherwise a disclosure list of consumer-supplied
  destinations plus a copy-the-page-URL action. No social-network
  endpoints and no CSS ship with the package.

### Versioning

- Version reset to `0.1.0`. Nothing has been published under the name
  `lily-design-system-svelte-share-chooser`, so continuing the old
  number line would imply releases that never existed under this name.

---

## Prior history — released in-tree as `lily-design-system-svelte-share-button`

Previously released in-tree as `lily-design-system-svelte-share-button`. Everything below happened
under that name. Identifiers in these entries (class hooks, symbols, data
attributes) have been updated to their current spellings so the document
reads coherently; the events they describe are unchanged.

### 0.1.0 — 2026-07-20

#### Added

- Initial release. A headless share control: a single-glyph button
  (➤, U+27A4) that opens the **native share sheet** via `navigator.share`
  where the browser provides one, and otherwise a disclosure list of
  consumer-supplied destinations plus a built-in copy-the-URL action.
- `targets` are supplied by the consumer, each with its own `href(url,
  title, text)` function. **No social-network endpoints ship with this
  package** — which networks belong in a product is an editorial and
  privacy decision, the URLs change, and networks die.
- Destinations render as real `<a>` elements rather than
  `role="menuitem"`, preserving middle-click, open-in-new-tab and
  copy-link-address. Copy is a real `<button>`.
- Copy outcome is announced in an `aria-live="polite"` region.
  `copyLabel`, `copiedLabel` and `copyFailedLabel` are all props — the
  copy item renders only when named, since a default label would be a
  hardcoded English string.
- Keyboard: arrows move between items and clamp, Home/End jump, Escape
  closes and returns focus to the trigger, Tab closes and moves on.
- Exports `canShareNatively`, `canCopy`, `nextShareChooserId`,
  `BLACK_RIGHTWARDS_ARROWHEAD`.

#### Notes

- Unlike the `*-select` helpers, this owns an *action*, not a preference:
  it applies nothing to the document and persists nothing.
- The trigger's class hook is `share-chooser-button`, not
  `share-chooser-button` — the one deliberate bend in the
  `{helper}-button` convention, since `.share-chooser-button` reads badly.
- Behaviour differs by platform when `strategy="auto"`: a phone gets the
  OS sheet, a desktop gets the list. Documented in
  `docs/accessibility.md` rather than glossed.
