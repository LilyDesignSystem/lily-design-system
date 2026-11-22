# Lily Design System: Swift examples — specification

Topic: [spec/apple-swift](../../spec/apple-swift/index.md). Tasks: [tasks.md P44-T5](../../tasks.md#phase-44--apple-swift-2026-11-22).

## Acceptance criteria

- [x] An Xcode project with an app target and a UI-test target, depending on `../lily-design-system-swift` as a local
      package; builds for the iOS Simulator (2026-11-22).
- [x] The accessibility audit passes on the catalog and every detail screen at the default and largest text sizes
      (2026-11-22, iPhone 17 Pro simulator, iOS 26.1). Excluded, each with its reason in `isIgnored`: the search field's
      placeholder, text under the floating search bar, the home indicator band, and contrast issues the audit reports with no
      element, which in every run were rows under the system bars' scroll-edge effect; Lily's own colour pairs are checked by
      the token tests.
- [ ] UI tests of each component's rendered accessibility tree, one per contract clause.
- [ ] The Dynamic Type sweep at `accessibility3` and `accessibility5` finds no clipped text.
- [ ] Composed screens: patient banner, vaccination record, contact form with an error summary.

---

Lily™ and Lily Design System™ are trademarks.
