# Changelog — ShareChooser (Angular)

All notable changes to this helper are documented in this file. The
format is loosely based on [Keep a Changelog](https://keepachangelog.com/)
and the project follows [Semantic Versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

### Renamed

- **Previously carried in-tree as
  `lily-design-system-angular-share-button`**, at 0.1.0 and never
  published. The package name, directory, component class, selector
  (`lily-share-chooser`), marker directive and class hooks all changed
  with it, bringing this helper in line with its three `*-chooser`
  siblings. The trigger hook `share-button-trigger` became plain
  `share-chooser-button` — see the note below.

### Added

- Initial release. An Angular 20 port of the canonical Svelte
  `share-chooser` helper: a headless share control whose single-glyph
  button (↪, U+21AA) opens the **native share sheet** via
  `navigator.share` where the browser provides one, and otherwise a
  disclosure list of consumer-supplied destinations plus a built-in
  copy-the-URL action.
- Standalone, signal-based, `OnPush`, `@for` control flow, zero CSS.
- `targets` are supplied by the consumer, each with its own
  `href(url, title, text)` function. **No social-network endpoints ship
  with this package** — which networks belong in a product is an
  editorial and privacy decision, the URLs change, and networks die.
- Destinations render as real `<a>` elements rather than
  `role="menuitem"`, preserving middle-click, open-in-new-tab and
  copy-link-address. Copy is a real `<button>`.
- Copy outcome is announced in an `aria-live="polite"` region.
  `copyLabel`, `copiedLabel` and `copyFailedLabel` are all inputs — the
  copy item renders only when named, since a default label would be a
  hardcoded English string.
- Keyboard: arrows open the list on the first / last item and then move
  between items, clamping rather than wrapping; `Home` / `End` jump;
  `Escape` closes and returns focus to the trigger; `Tab` closes and
  moves on. Items are real focusable elements, so focus moves for real.
- Clicking outside the root, or focus leaving it, closes the list
  without stealing focus back.
- A projected `<ng-template>` replaces the glyph and receives
  `ChildArgs` (`{ open, url }`); the optional `ShareChooserIcon` marker
  directive types the `let-` variables.
- Exports `canShareNatively`, `canCopy`, `nextShareChooserId`,
  `RIGHTWARDS_ARROW_WITH_HOOK`, and the types `ChildArgs`,
  `ShareTarget`, `ShareStrategy`, `ShareEvent`.
- 47 vitest cases mapped onto the `spec/index.md` §7 clauses.

### Notes

- Unlike the three preference helpers, this owns an *action*, not a
  preference: it applies nothing to the document and persists nothing.
  No `localStorage`, no `data-*` on the document root.
- The trigger's class hook is `share-chooser-button`, following the
  `{helper}-button` convention exactly. Under the package's former name
  it had to be `share-button-trigger`, because `.share-button-button`
  read badly; the rename removed the need for that exception.
- A dismissed native sheet **ends** the interaction. `navigator.share()`
  rejects when the user closes the sheet; falling through to the list
  would resurrect UI they just dismissed.
- Angular deviations from the canonical Svelte contract: callbacks are
  `output()`s (`(share)` emits one `ShareEvent` object rather than two
  positional arguments), and the consumer's class hook is `className`
  because `class` is not a legal Angular input name.
- Promise rejections attach their handler at the call site
  (`.then(ok, err)`) rather than relying on `try { await }` — under
  zone.js a rejection caught only by a native `await` is still reported
  as an unhandled error against the originating click task.

### Accessibility

- The tradeoffs are documented in `docs/accessibility.md` rather than
  glossed: the accessible name rests entirely on `aria-label` with no
  visible fallback; behaviour differs by platform under
  `strategy="auto"`; the glyph is font-dependent (though ↪ is in-font
  and materially safer than an emoji); and copy can fail for reasons
  invisible to the user, so `copyFailedLabel` should be actionable.

---

Lily™ and Lily Design System™ are trademarks.
