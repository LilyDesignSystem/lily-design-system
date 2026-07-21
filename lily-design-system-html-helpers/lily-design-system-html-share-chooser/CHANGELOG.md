# Changelog

All notable changes to `lily-design-system-html-share-chooser` are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/),
and this package uses [semantic versioning](https://semver.org/).

## 0.1.0 — 2026-07-21

First release under the name `lily-design-system-html-share-chooser`.
The version resets to 0.1.0 because this package name has never been
published; a renamed package carries no release history. Port of the
canonical Svelte helper `lily-design-system-svelte-share-chooser` to a
vanilla custom element.

### Added

- `<share-chooser>` custom element: a single-glyph trigger (↪, U+21AA)
  that opens the native share sheet where the browser provides one, and
  otherwise a disclosure list of consumer-supplied destinations plus an
  optional copy-the-URL action.
- Observed attributes `label`, `url`, `share-title`, `text`,
  `copy-label`, `copied-label`, `copy-failed-label`, `strategy`,
  `class`, each with a mirrored camelCase property.
- Property-only `targets`, `onShare`, `onCopy`, `onNativeShare`, each
  callback paired with a bubbling, composed `CustomEvent` (`share`,
  `copy`, `nativeshare`).
- Public methods `openList`, `closeList`, `items`, `currentUrl`, and the
  overridable `renderButtonContent()` hook standing in for the slot the
  other frameworks expose.
- Pure helpers `canShareNatively()`, `canCopy()`, `nextShareChooserId()`,
  and the `RIGHTWARDS_ARROW_WITH_HOOK` glyph constant, exported from
  both the module and the barrel.
- 52 vitest + jsdom cases mapped onto the §7 acceptance clauses, plus
  coverage of the catalog idiom (attribute/property mirroring, the
  `#render` / `#syncState` split holding focus, listener cleanup, SSR
  import safety).

### Changed

- Renamed from `lily-design-system-html-share-button`. The custom
  element is `<share-chooser>` (was `<share-chooser>`), the class is
  `ShareChooser` (was `ShareChooser`), and the class hooks are
  `share-chooser*` (were `share-chooser*`).
- **The trigger's class is now `share-chooser-button`**, matching the
  `{helper}-button` convention the sibling helpers use. Under the old
  name it was `share-chooser-trigger`, a documented exception made
  because `.share-button-button` read badly; the rename removes the
  reason for the exception, and the exception is removed with it.
- The `share-title` attribute keeps its name. `title` is a global HTML
  attribute and an `HTMLElement` property, so observing it would paint
  a tooltip over the control and shadow a platform member — the reason
  is unchanged by the rename.
- Event names are unchanged: `share`, `copy`, `nativeshare`.

Previously released in-tree as `lily-design-system-html-share-button`
at 0.1.0; nothing shipped under the current package name.

### Notes

- No social-network endpoints ship with this package, and there is no
  default copy label — both are deliberate. See `spec/index.md` §2.
- Nothing is persisted and nothing is applied to the document root: this
  helper owns an action, not a user preference.
- Two forced deviations from the cross-framework API: the share title is
  `share-title` / `shareTitle` because `title` is a global HTML
  attribute, and `targets` is property-only because `ShareTarget.href`
  is a function. Both are documented in `spec/index.md` §4.1 and §4.3.

---

Lily™ and Lily Design System™ are trademarks.
