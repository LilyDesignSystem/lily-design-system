<svelte:head>
    <title>Kotlin tutorial — Lily Design System</title>
    <meta
        name="description"
        content="Build an accessible contact form in Jetpack Compose with Lily's Kotlin libraries: your words in, Lily's semantics and accessibility out, and a theme that never changes what TalkBack reads."
    />
</svelte:head>

<section class="page-intro">
    <h1>Kotlin tutorial</h1>
    <p class="page-intro-tagline">
        Lily's semantics, accessibility contracts and worldwide rules for Jetpack Compose on
        Android: every word is yours, every native control stays Material's, and a theme changes how
        a component looks, never what TalkBack reads.
    </p>
</section>

<section
    class="section prose"
    style="margin: 0 auto;"
>
    <h2>What you'll build</h2>
    <p>
        A small contact form — a labelled field with a hint and an error, an error summary, a
        warning — first plain, then themed, in about 15 minutes.
    </p>
    <div class="callout">
        <p style="margin: 0;">
            <strong>Early and unreleased.</strong> The Kotlin libraries are not on Maven Central yet,
            so you build them from a copy of the monorepo. Their components are a first slice, not the
            whole catalog: see the list in step 2.
        </p>
    </div>

    <h2>Before you start</h2>
    <p>
        You need a JDK 17 or later, an Android SDK with platform 37.2 (Compose 1.13 requires it and
        <code>minSdk</code> 24), Kotlin 2.4 and an app built with Jetpack Compose. The components
        use <code>compose.foundation</code> and <code>compose.ui</code> only: Lily never depends on Material.
    </p>

    <h2>Step 1 — Add the libraries</h2>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`git clone https://github.com/LilyDesignSystem/lily-design-system`}</code
        ></pre>
    <p>
        Until there is a release, the supported way to use the libraries is as modules of the
        repository's own Gradle build, <code>lily-design-system-kotlin</code>. Open it in Android
        Studio, add your app as a module (<code>include(":my-app")</code> in its
        <code>settings.gradle.kts</code>) and depend on the Lily modules by project, as the example
        app does:
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`// my-app/build.gradle.kts
dependencies {
    implementation(project(":lily-compose"))
    implementation(project(":lily-compose-themes"))
    // …your Compose BOM, foundation and activity-compose, as in lily-compose-examples-app
}`}</code
        ></pre>
    <p>
        The modules are <code>lily-core</code> (Kotlin Multiplatform, no Android dependency: search
        folding, middle truncation, clinical formatting), <code>lily-compose</code> (the
        components), <code>lily-compose-themes</code> (generated tokens and
        <code>LilyTheme</code>) and <code>lily-compose-examples</code> (a worked example of every
        component). <code>lily-compose-examples-app</code> is a complete app to copy from.
    </p>

    <h2>Step 2 — Your first component</h2>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`import androidx.compose.runtime.Composable
import io.github.lilydesignsystem.compose.WarningText

@Composable
fun Notice() {
    WarningText(prefix = "Warning", text = "You can be fined up to £5,000 if you do not register.")
}`}</code
        ></pre>
    <p>
        <code>WarningText</code> keeps the prefix and the text together so TalkBack reads them as
        one sentence. The first slice has <code>Field</code>, <code>ErrorSummary</code>,
        <code>SummaryList</code>, <code>WarningText</code>, <code>LilyAlert</code>,
        <code>LilyBadge</code>, <code>Tag</code>, <code>LilyCard</code>, <code>InsetText</code>,
        <code>Disclosure</code>, the clinical views and the International Patient Summary. Lily
        ships no button, switch, checkbox, slider, date picker, sheet or navigation: on Compose
        those are Material 3's.
    </p>

    <h2>Step 3 — Compose a small form</h2>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.runtime.*
import io.github.lilydesignsystem.compose.*

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
}`}</code
        ></pre>
    <p>
        <code>Field</code> draws the visible label, the hint and the error, and hands its control a
        <code>Modifier</code> that carries the spoken name and the error: apply it to the control.
        <code>ErrorSummary</code> lists the problems and calls each one's lambda when it is activated,
        so you can move focus to the field.
    </p>
    <div class="callout">
        <p style="margin: 0;">
            <strong>Verified 2026-11-22:</strong> this form and the theme in step 5 were compiled
            against the modules with Gradle (<code>compileDebugKotlin</code>). The accessibility
            checks of the example app run on an emulator (see step 6).
        </p>
    </div>

    <h2>Step 4 — The Compose idioms</h2>
    <ul>
        <li>
            <strong>Every word is yours.</strong> Lily has no default text and no string resources: labels,
            hints and errors are parameters, so the form speaks your app's language.
        </li>
        <li>
            <strong>Pass the modifier to the control.</strong> <code>Field</code> gives its content
            a <code>Modifier</code>; a control that ignores it loses its spoken name.
        </li>
        <li>
            <strong>Text follows the user.</strong> Text styles come from
            <code>LocalLilyTextStyles</code>, which defaults to the platform's text, so the user's
            font scale applies unchanged.
        </li>
        <li>
            <strong>Spoken joins are line breaks</strong>, never words or punctuation of Lily's own,
            and tappable parts are at least 48 by 48 dp.
        </li>
    </ul>

    <h2>Step 5 — Theme it</h2>
    <p>
        Add <code>lily-compose-themes</code> and wrap the content once:
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`import androidx.compose.foundation.isSystemInDarkTheme
import io.github.lilydesignsystem.compose.themes.LilyTheme
import io.github.lilydesignsystem.compose.themes.LilyTokens

@Composable
fun Root() {
    LilyTheme(if (isSystemInDarkTheme()) LilyTokens.dark else LilyTokens.govUk) { ContactForm() }
}`}</code
        ></pre>
    <p>
        The tokens are <code>LilyTokens.light</code>, <code>dark</code>,
        <code>nhsEnglandPatients</code>, <code>govUk</code>, <code>uswds</code> and
        <code>japanDigitalAgency</code>, generated from the same token files as the web themes. A
        theme decorates through <code>LocalLilyDecoration</code>, applied after each component's
        semantics, so it can change how a component looks but never what TalkBack reads. Text uses
        only the colour pairs the web themes gate at 4.5:1. Using a public-sector theme does not
        make your app that body's service: supply your own name and marks.
    </p>

    <h2>Step 6 — See it all working</h2>
    <p>
        <code>lily-compose-examples</code> has a worked example of every component and a searchable catalog
        you can host in your own activity; navigation stays yours:
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`setContent {
    var selected by rememberSaveable { mutableStateOf<String?>(null) }
    BackHandler(enabled = selected != null) { selected = null }
    ExampleCatalog(title = "Components", searchLabel = "Search components", selected = selected, onSelect = { selected = it })
}`}</code
        ></pre>
    <p>
        Or install the ready-made example app on a device or emulator; its accessibility test runs
        Google's Accessibility Test Framework over the catalog and every detail view at font scale
        1.0 and 2.0:
    </p>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0"><code
            >{`cd lily-design-system/lily-design-system-kotlin
./gradlew :lily-compose-examples-app:installDebug`}</code
        ></pre>

    <h2>Next steps</h2>
    <ul>
        <li>
            <a href="/tutorials/swift/">Swift tutorial</a> — the same components for SwiftUI on iPhone
            and iPad.
        </li>
        <li>
            <a href="/components/">Component catalog</a> — the web contract each Compose component follows,
            with ARIA and keyboard per component.
        </li>
        <li>
            <a href="/tutorials/worldwide/">Worldwide</a> — why Lily ships no default text and no single-region
            default.
        </li>
        <li>
            <a href="/getting-started/">Getting started in five minutes</a> — the same start on the web.
        </li>
    </ul>
    <p>
        Questions along the way? The <a href="/help/#troubleshooting">help page</a> is full of
        answers — and if a step could be clearer,
        <a href="https://github.com/LilyDesignSystem">tell us</a> and we'll gladly improve the tutorial.
    </p>
</section>
