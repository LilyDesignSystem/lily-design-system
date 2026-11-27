<svelte:head>
  <title>Tutorials — Lily Design System</title>
  <meta
    name="description"
    content="Step-by-step Lily tutorials: your first component, styling, ready-made themes, and preference helpers — for HTML, Svelte, React, Vue, Angular, Blazor, Nunjucks, Swift, and Kotlin."
  />
</svelte:head>

<section class="page-intro">
  <h1>Learn Lily, step by step</h1>
  <p class="page-intro-tagline">
    Welcome! Every tutorial starts from scratch and builds the same small
    thing — an accessible, styled form — in about 10 minutes, so you can
    compare frameworks apples-to-apples. Then go deeper with theming and
    user preferences.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>Before you start</h2>
  <p>You need surprisingly little:</p>
  <ul>
    <li>
      <strong>For the HTML tutorial</strong> — just a browser and a text
      editor. That's the entire toolkit.
    </li>
    <li>
      <strong>For Svelte, React, Vue, Angular, or Nunjucks</strong> —
      <a href="https://git-scm.com/">git</a>, Node 26, and pnpm 10
      or later.
    </li>
    <li>
      <strong>For Blazor</strong> — git and the
      <a href="https://dotnet.microsoft.com/">.NET SDK</a> 11 or later.
    </li>
  </ul>
  <p>
    New to headless components? You're in the right place — each tutorial
    explains what's happening as you go, and every step shows the exact code
    to copy.
  </p>
</section>

<section class="section">
  <header class="section-heading">
    <h2>Four steps from zero to shipped</h2>
  </header>
  <div class="prose" style="margin: 0 auto;">
    <ol>
      <li>
        <strong>Your first component</strong> (~5 minutes) — pick your
        framework below, get the code, and render a Button.
      </li>
      <li>
        <strong>Compose and style</strong> (~5 minutes) — build a labelled
        form and style it against the kebab-case class hooks (part of each
        framework tutorial).
      </li>
      <li>
        <strong>Theme it</strong> (~15 minutes) — swap your hand-written CSS
        for one of the 63 ready-made themes, then let users switch at
        runtime: <a href="/tutorials/theming/">theming tutorial</a>.
      </li>
      <li>
        <strong>Respect preferences</strong> (~15 minutes) — add language and
        text-size selection with the preference helpers:
        <a href="/tutorials/helpers/">helpers tutorial</a>.
      </li>
    </ol>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <h2>Pick your framework</h2>
  </header>
  <div class="card-grid">
    <a class="card" href="/tutorials/html/">
      <h3 class="card-heading">HTML</h3>
      <p class="card-description">Copy semantic HTML with the class hooks and go — a browser and an editor are all it takes.</p>
      <p class="card-meta">~10 minutes · easiest start</p>
    </a>
    <a class="card" href="/tutorials/svelte/">
      <h3 class="card-heading">Svelte</h3>
      <p class="card-description">Svelte 5 runes, snippets, and <code>bind:value</code> two-way binding.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/react/">
      <h3 class="card-heading">React</h3>
      <p class="card-description">Function components with <code>value</code> + <code>onChange</code> and rest-prop spread.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/vue/">
      <h3 class="card-heading">Vue</h3>
      <p class="card-description">Vue 3 single-file components with <code>v-model</code> support.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/angular/">
      <h3 class="card-heading">Angular</h3>
      <p class="card-description">Angular standalone components with signal inputs and <code>[(value)]</code>.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/blazor/">
      <h3 class="card-heading">Blazor</h3>
      <p class="card-description">Razor components with parameters, <code>ChildContent</code>, and bUnit tests.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/nunjucks/">
      <h3 class="card-heading">Nunjucks</h3>
      <p class="card-description">Server-rendered macros for Eleventy and any Node templating pipeline.</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/swift/">
      <h3 class="card-heading">Swift</h3>
      <p class="card-description"><code>SwiftUI</code> · iOS · iPadOS</p>
      <p class="card-meta">~10 minutes</p>
    </a>
    <a class="card" href="/tutorials/kotlin/">
      <h3 class="card-heading">Kotlin</h3>
      <p class="card-description"><code>Jetpack Compose</code> · Android</p>
      <p class="card-meta">~10 minutes</p>
    </a>
  </div>
  <p class="prose" style="margin: 0 auto;">
    Torn between them? Start with <a href="/tutorials/html/">HTML</a> — it
    teaches the class-hook contract every other framework shares, and it
    runs straight from a file.
  </p>
</section>

<section class="section">
  <header class="section-heading">
    <h2>Go deeper</h2>
  </header>
  <div class="card-grid">
    <a class="card" href="/tutorials/theming/">
      <h3 class="card-heading">Theming</h3>
      <p class="card-description">
        Link one of 63 ready-made themes — NHS, GOV.UK, USWDS, light, dark,
        and more — override it with your own CSS, and add runtime theme
        switching with the theme-picker helper.
      </p>
      <p class="card-meta">~15 minutes</p>
    </a>
    <a class="card" href="/tutorials/helpers/">
      <h3 class="card-heading">Preference helpers</h3>
      <p class="card-description">
        Give users control of theme, language, text size, motion, search,
        page links, sharing, and date/time entry with theme-picker,
        locale-picker, text-size-picker, motion-picker, search-picker,
        link-picker, share-picker, and date-time-picker: headless controls
        with persistence, SSR safety, and automatic RTL detection.
      </p>
      <p class="card-meta">~15 minutes</p>
    </a>
    <a class="card" href="/tutorials/international-patient-summary/">
      <h3 class="card-heading">International Patient Summary</h3>
      <p class="card-description"><code>SvelteKit</code> · <code>HL7 FHIR</code> · <code>IPS</code></p>
    </a>
    <a class="card" href="/tutorials/electronic-patient-record/">
      <h3 class="card-heading">Electronic Patient Record</h3>
      <p class="card-description"><code>SvelteKit</code> · <code>EPR</code></p>
    </a>
    <a class="card" href="/tutorials/patient-administration-system/">
      <h3 class="card-heading">Patient Administration System</h3>
      <p class="card-description"><code>SvelteKit</code> · <code>PAS</code></p>
    </a>
    <a class="card" href="/tutorials/pre-operative-assessment-by-patient/">
      <h3 class="card-heading">Pre-operative Assessment by Patient</h3>
      <p class="card-description"><code>SvelteKit</code> · <code>Form Examples</code></p>
    </a>
    <a class="card" href="/tutorials/book-appointment/">
      <h3 class="card-heading">Book an Appointment</h3>
      <p class="card-description"><code>Swift</code> · <code>Kotlin</code> · <code>.NET MAUI</code></p>
    </a>
    <a class="card" href="/tutorials/patient-app/">
      <h3 class="card-heading">Patient App</h3>
      <p class="card-description"><code>Swift</code> · <code>Kotlin</code></p>
    </a>
    <a class="card" href="/tutorials/public-health-information-page/">
      <h3 class="card-heading">Public Health Information Page</h3>
      <p class="card-description"><code>SvelteKit</code></p>
    </a>
  </div>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>After the tutorials</h2>
  <ul>
    <li>
      Browse the <a href="/components/">component catalog</a> — every
      component documents its props, ARIA contract, and keyboard behaviour.
    </li>
    <li>
      Clone an <a href="/examples/">example app</a> to see all 608
      components styled and working together — the CSS targets the same
      class hooks you just used, so copy any of it into your project and
      adjust it as you wish.
    </li>
    <li>
      Questions? The <a href="/help/">help page</a> has answers, an FAQ, and
      ways to reach a friendly human. And if a tutorial could be clearer,
      <a href="https://github.com/LilyDesignSystem">tell us</a> — we'll
      gladly improve it.
    </li>
  </ul>
</section>
