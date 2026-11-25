# Lily Design System™: Kotlin

Kotlin libraries that bring Lily's semantics, accessibility contracts and worldwide rules to Jetpack Compose apps on Android.
Research, decisions and plan: [spec/android-kotlin](../spec/android-kotlin/index.md). Status: **early, unreleased** (tasks.md
Phase 45).

## Modules

| Module         | What it is                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | State                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `lily-core`    | Kotlin Multiplatform, no Android dependency: search folding and highlighting, middle truncation, clinical formatting.                                                                                                                                                                                                                                                                                                                                                                                                                                          | JVM target; ported from `shared/` and proved equal by `shared/vectors/`. |
| `lily-compose` | Compose components on `compose.foundation` and `compose.ui` only: `Field`, `ErrorSummary`, `SummaryList` / `SummaryListItem`, `WarningText`, `LilyAlert`, `LilyBadge`, `Tag`, `LilyCard`, `InsetText`, `ObservationView`, `AgeView`, `DurationView`, `AllergyRecordList`, `AllergyRecordListItem`, `MedicationView`, `EarlyWarningScoreView`, `DecisionSupportCard`, `RecordList`, `RecordListItem`, `InternationalPatientSummary`, `InternationalPatientSummaryLazy` (a `LazyColumn` for long summaries), `InternationalPatientSummarySection`, `Disclosure`. | First slice (P45-T3).                                                    |

| `lily-compose-themes` | Generated tokens (`bin/generate-mobile-tokens`): `LilyTokens.light`, `dark`, `nhsEnglandPatients`, `govUk`, `uswds`, `japanDigitalAgency`, with the 20 colour roles and the radii and border in dp; and `LilyTheme(tokens) { … }`, which draws the components through `LocalLilyDecoration`. | Light and dark pairs tested at 4.5:1; semantics unchanged in every theme; 100% of lines. |
| `lily-compose-examples` | A worked example of every `lily-compose` component (real words, its code beside it) and `ExampleCatalog`, a searchable list with a detail view: the mobile form of the web apps' `/components` routes. | Six Robolectric tests; every example composes. |

Planned: `lily-compose-identifiers` (P43-T4, P45-T4), `lily-compose-themes` (P43-T5) and the optional `lily-compose-material3`
adapter. Requirements: Kotlin 2.4, `minSdk` 24 and compileSdk 37.2 (Compose 1.13 requires both), JVM bytecode 17.

## Use

```kotlin
@Composable
fun ContactForm() {
    var name by remember { mutableStateOf("") }
    var nameError by remember { mutableStateOf<String?>(null) }
    Column {
        nameError?.let { ErrorSummary(title = "There is a problem", problems = listOf(Problem(it) { /* focus the field */ })) }
        Field(label = "Full name", description = "As it appears on your passport", error = nameError,
              required = true, requiredLabel = "required") { fieldModifier ->
            BasicTextField(value = name, onValueChange = { name = it }, modifier = fieldModifier)
        }
        WarningText(prefix = "Warning", text = "You can be fined up to £5,000 if you do not register.")
    }
}
```

Every word is the app's: Lily has no default text and no string resources. `Field` passes its control a `Modifier` carrying
the spoken name and the error; apply it to the control. Text styles come from `LocalLilyTextStyles`, which defaults to the
platform's text, so the user's font scale applies unchanged.

`lily-compose-examples-app` is a ready app that does this (and its `AccessibilityChecksTest` runs Google's Accessibility Test
Framework over the catalog and every detail view: `./gradlew :lily-compose-examples-app:connectedDebugAndroidTest` on an API 34+
emulator, at font scale 1.0 and 2.0) (`./gradlew :lily-compose-examples-app:installDebug` on a device or
emulator): the catalog in `LilyTheme`, light or dark with the system, edge to edge, system back to leave a detail, every word
in its `strings.xml`. To host the catalog in your own activity, navigation stays the app's:

```kotlin
setContent {
    var selected by rememberSaveable { mutableStateOf<String?>(null) }
    BackHandler(enabled = selected != null) { selected = null }
    ExampleCatalog(title = "Components", searchLabel = "Search components", selected = selected, onSelect = { selected = it })
}
```

To draw the components with a theme, add `lily-compose-themes` and wrap the content once:

```kotlin
LilyTheme(if (isSystemInDarkTheme()) LilyTokens.dark else LilyTokens.govUk) { App() }
```

A theme decorates through `LocalLilyDecoration`, applied after each component's semantics, so it can change how a component
looks but never what TalkBack reads. Text uses only the gated colour pairs; a severity colour is a rail or a border.

## Rules

- Native controls first: Lily ships no button, switch, checkbox, slider, date picker, sheet or navigation; on Compose those are
  Material 3's. See [mobile/components-mobile.tsv](../mobile/components-mobile.tsv) for each component's Android decision.
- `lily-compose` never depends on Material; `./gradlew checkNoMaterial` fails if it does.
- Spoken joins are line breaks, never words or punctuation of Lily's own. Tappable parts are at least 48 by 48 dp.

## Develop

```sh
./gradlew build checkNoMaterial       # lily-core vectors, lily-compose Robolectric semantics tests, lint
./gradlew koverLog koverVerify        # test coverage of both modules; fails below 100% of lines
bin/sync-shared-modules               # from the monorepo root: refresh lily-core/src/jvmTest/resources/vectors
```

Needs a JDK (17 or later) and an Android SDK with platform 37.2 (`sdkmanager "platforms;android-37.2"`); set `sdk.dir` in
`local.properties`. After changing a source file, rerun tests with `--rerun-tasks` when checking that a test fails: an
incremental build can reuse stale outputs.

---

Lily™ and Lily Design System™ are trademarks.
