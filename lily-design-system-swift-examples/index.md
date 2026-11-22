# Lily Design System™: Swift examples

The iOS and iPadOS example app: the searchable catalog of every `LilyUI` component (from `LilyUIExamples`), themed with
`LilyThemes` and light or dark with the system. The mobile form of the web example apps. Status: **early** (tasks.md P44-T5).

## Run

Open `LilyExamples.xcodeproj` in Xcode 27 or later and run the `LilyExamples` scheme, or from the command line:

```sh
xcodebuild -project LilyExamples.xcodeproj -scheme LilyExamples -destination 'generic/platform=iOS Simulator' build
xcodebuild -project LilyExamples.xcodeproj -scheme LilyExamples \
    -destination 'platform=iOS Simulator,name=iPhone 17 Pro' test
```

The project depends on the package beside it, `../lily-design-system-swift`, as a local package, so it always runs the
code in this monorepo.

## Tests

`LilyExamplesUITests` runs `performAccessibilityAudit` on the catalog, and on every component's detail screen at the default
text size and at the largest accessibility size. It passes. An issue the audit reports that is not Lily's (the system search field and bars, the scroll-edge
effect) is excluded in `AccessibilityAuditTests.isIgnored` with its reason; the list may only shrink.

## Project file

`LilyExamples.xcodeproj/project.pbxproj` uses Xcode 16's synchronized folders, so adding a Swift file to `LilyExamples/` or
`LilyExamplesUITests/` needs no project change. It was written by hand, not by a generator; keep it small.

---

Lily™ and Lily Design System™ are trademarks.
