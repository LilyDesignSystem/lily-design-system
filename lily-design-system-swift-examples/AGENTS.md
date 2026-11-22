# Lily Design System: Swift examples — AI coding help

The iOS example app for [lily-design-system-swift](../lily-design-system-swift/index.md); research in
[spec/apple-swift](../spec/apple-swift/index.md).

- One app target, `LilyExamples`, hosting `ExampleCatalog` from `LilyUIExamples`, themed with `.lilyTheme(_:)`.
- Add a component's example to `LilyUIExamples` in the package, not here: the app shows whatever the catalog holds.
- `LilyExamplesUITests` audits every screen with `performAccessibilityAudit`, at two text sizes. Keep it passing; add an
  ignore only for a proven false positive, with the reason.
- The project uses synchronized folders: never add file references to `project.pbxproj`.

Verify: `xcodebuild … test` on an iOS simulator, as in `index.md`.
