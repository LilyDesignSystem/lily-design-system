# Lily Design System™: Swift

A Swift package that brings Lily's semantics, accessibility contracts and worldwide rules to SwiftUI apps on iPhone and iPad.
Research, decisions and plan: [spec/apple-swift](../spec/apple-swift/index.md). Status: **early, unreleased** (tasks.md Phase 44).

## Products

| Product    | What it is                                                                                                                                 | State                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `LilyCore` | Pure Swift, no UI: search folding and highlighting, middle truncation, clinical formatting (ages, durations, partial dates, meter scales). | Ported from `shared/` and proved equal to the TypeScript by `shared/vectors/`. |
| `LilyUI`   | SwiftUI components with style protocols: `Field`, `ErrorSummary`, `SummaryList` / `SummaryListItem`, `WarningText`, `LilyAlert`.           | First slice (P44-T3).                                                          |

Planned: `LilyIdentifiers` (the national identifier inputs and views, after their validators move to `shared/`, P43-T4) and
`LilyThemes` (generated tokens, P43-T5). Requirements: Swift 6 language mode, iOS 18 / iPadOS 18 or later (macOS 15 for
tests), no third-party runtime dependency.

## Use

```swift
import LilyUI

struct ContactForm: View {
    @State private var name = ""
    @State private var nameError: String?

    var body: some View {
        Form {
            if let nameError {
                ErrorSummary(title: "There is a problem", problems: [.init(nameError) { /* focus the name field */ }])
            }
            Field(label: "Full name", description: "As it appears on your passport", error: nameError,
                  required: true, requiredLabel: "required") {
                TextField("", text: $name).textContentType(.name)
            }
            WarningText(prefix: "Warning", text: "You can be fined up to £5,000 if you do not register.")
        }
    }
}
```

Every word is the app's, in the app's language: Lily has no default text. Change the look with a style, never by wrapping:
`.fieldStyle(MyFieldStyle())`. A style receives a configuration and draws it; the component keeps the accessibility label,
hint, traits and announcements outside the style, so no style can change what VoiceOver says.

## Rules

- Native controls first: Lily ships no button, toggle, picker, date picker, sheet, alert or navigation. See
  [mobile/components-mobile.tsv](../mobile/components-mobile.tsv) for each component's Apple decision.
- Text comes from parameters of type `String`, shown with `Text(verbatim:)`, so Lily never looks a string up in its own bundle.
- Dynamic Type, Reduce Motion, contrast and language are the system's; no component reads or overrides them except to adapt.
- Spoken joins are line breaks, never words or punctuation of Lily's own.

## Develop

```sh
swift build && swift test                       # macOS: LilyCore vectors and LilyUI semantics
./coverage.sh                                   # coverage; fails if LilyCore is below 100%
xcodebuild -scheme LilyDesignSystem-Package -destination 'generic/platform=iOS Simulator' build
bin/sync-shared-modules                          # from the monorepo root: refresh Tests/LilyCoreTests/vectors
```

Edit `shared/vectors/` in the monorepo, never the copy here.

---

Lily™ and Lily Design System™ are trademarks.
