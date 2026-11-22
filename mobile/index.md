# Lily on mobile: decisions and semantics

Two tables decide what Lily is on iOS, iPadOS and Android, before any Swift or Kotlin is written. Research and reasons:
[spec/apple-swift](../spec/apple-swift/index.md) and [spec/android-kotlin](../spec/android-kotlin/index.md). Both are
checked by `bin/check-mobile-catalog` in `bin/test`.

## `components-mobile.tsv`

One row per slug in [`components.tsv`](../components.tsv), in the same order.

| Column         | Meaning                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `slug`         | The catalog slug.                                                                                            |
| `apple`        | `native`, `lily`, `pattern` or `none` (below).                                                               |
| `apple_type`   | For `native` and `pattern`: the SwiftUI type or modifier to use. For `lily`: the Swift name when it differs. |
| `android`      | As `apple`, for Jetpack Compose.                                                                             |
| `android_type` | As `apple_type`, for Compose (Material 3 where the native control lives there).                              |
| `reason`       | Why. Required.                                                                                               |

- **`native`**: use the platform's control. Lily ships no type, documents the control and may give it a style or tokens.
- **`lily`**: Lily ships a component with the catalog's PascalCase name, unless the type column gives another one.
- **`pattern`**: a documented composition of native parts; no type.
- **`none`**: a web-only concern (landmarks, page layout, skip links, editorial media, tables on phones).

A Lily type is renamed only when its catalog name would clash with a platform type an app commonly imports: the name gets
a `Lily` prefix (`LilyAlert` and `LilyTimer` in Swift, `LilyCard` and `LilyBadge` on Android, `LilyNotification` on both).

Counts on 2026-11-22 (`bin/check-mobile-catalog --counts`), of 661 components:

| Platform | lily | native | pattern | none |
| -------- | ---- | ------ | ------- | ---- |
| Apple    | 343  | 146    | 34      | 138  |
| Android  | 355  | 100    | 53      | 153  |

The `lily` counts include the 188 national identifier components; without them, 155 on Apple and 167 on Android. Android
has more because Compose's unstyled layer lacks some controls Apple ships (a disclosure, an outline tree, a wheel, a gauge,
an empty state, a colour picker).

## `semantics.tsv`

One row per ARIA attribute, ARIA role and HTML element used in `components/*/AGENTS.md`, with the SwiftUI, UIKit and
Compose equivalent. Columns: `kind` (`attribute`, `role` or `element`), `name`, `swiftui`, `uikit`, `compose`, `notes`.
Where there is no equivalent the column says `none` and the note says what to do instead; mobile has no landmarks and no
id references, so several rows are `none`.

---

Lily™ and Lily Design System™ are trademarks.
