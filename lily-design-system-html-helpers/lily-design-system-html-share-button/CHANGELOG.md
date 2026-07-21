# Changelog

All notable changes to `lily-design-system-html-share-button` are
documented here. The format follows [Keep a Changelog](https://keepachangelog.com/),
and this package uses [semantic versioning](https://semver.org/).

## 0.1.0

Initial release. Port of the canonical Svelte helper
`lily-design-system-svelte-share-button` to a vanilla custom element.

### Added

- `<share-button>` custom element: a single-glyph trigger (↪, U+21AA)
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
- Pure helpers `canShareNatively()`, `canCopy()`, `nextShareButtonId()`,
  and the `RIGHTWARDS_ARROW_WITH_HOOK` glyph constant, exported from
  both the module and the barrel.
- 52 vitest + jsdom cases mapped onto the §7 acceptance clauses, plus
  coverage of the catalog idiom (attribute/property mirroring, the
  `#render` / `#syncState` split holding focus, listener cleanup, SSR
  import safety).

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
