<svelte:head>
  <title>Preference helpers tutorial — Lily Design System</title>
  <meta name="description" content="Add user language and text-size preferences with Lily's locale-picker and text-size-picker helpers: headless icon-button + listbox controls with persistence and SSR safety." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Preference helpers</h1>
  <p class="hero-tagline">
    Five small packages per framework, each owning one user job end to end.
    You've met <a href="/tutorials/theming/">theme-picker</a>; here are
    locale-picker and text-size-picker (preferences), plus share-picker and
    date-time-picker (actions and form values).
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A settings panel where users pick their language and text size — choices
    that apply to the whole document, persist across visits, and cost you
    two components and a few lines of CSS. About 15 minutes.
  </p>

  <h2>Before you start</h2>
  <p>
    Finish the <a href="/tutorials/">framework tutorial</a> for your stack.
    The samples below are Svelte; the React, Vue, Angular, HTML, Nunjucks,
    and Blazor helpers match contract-for-contract.
  </p>

  <h2>The shape they share</h2>
  <ul>
    <li>A headless icon button that opens a WAI-ARIA APG listbox (or, for date-time-picker, a date-picker dialog) — no native <code>&lt;select&gt;</code>, so every framework gets identical keyboard behaviour and styling hooks.</li>
    <li>One class hook per package (<code>.locale-picker</code>, <code>.text-size-picker</code>, <code>.share-picker</code>, <code>.date-time-picker</code>), zero CSS shipped.</li>
    <li>SSR-safe: DOM writes happen only in the mount/effect lifecycle.</li>
    <li>i18n-clean: every user-facing string is a prop.</li>
    <li>
      Available for Svelte (canonical), React, Vue, Angular, HTML custom
      element, Nunjucks, and Blazor — same contract in each.
    </li>
  </ul>
  <p>
    theme-picker, locale-picker, and text-size-picker each own one user
    <em>preference</em> end to end (selection, DOM application, optional
    <code>localStorage</code> persistence via a <code>storageKey</code>
    prop). share-picker and date-time-picker are different in kind:
    share-picker owns an <em>action</em> — it applies nothing to the
    document and persists nothing — and date-time-picker owns a
    <em>form value</em>, since a date in a form is data rather than a
    preference.
  </p>

  <h2>locale-picker — language and direction</h2>
  <p>
    Lets the user pick a locale, then writes <code>lang</code> and
    <code>dir</code> to the document root so your i18n library, your CSS,
    and assistive technology all follow. RTL is detected automatically for
    Arabic, Hebrew, and other right-to-left scripts. It focuses purely on
    signalling — your i18n library handles the translation.
  </p>
  <!-- `<` + `script>` keeps the literal tag out of the Svelte compiler's view. -->
  <pre><code>{`<` + `script>
  import LocalePicker from "lily-design-system-svelte-locale-picker";

  let locale = $state("en-US");
</` + `script>

<LocalePicker
  label="Language"
  locales={["en-US", "fr", "ar", "he", "ja"]}
  bind:value={locale}
  storageKey="my-app-locale"
/>`}</code></pre>
  <p>
    Options are labelled from a built-in table of locale names (overridable
    via <code>localeLabels</code>), each option carries its own
    <code>lang</code> attribute so screen readers pronounce
    "Français" in French, and underscore codes like <code>en_US</code>
    round-trip losslessly to BCP 47 <code>en-US</code>. Wire
    <code>onChange</code> (or the bound value) into i18next, Paraglide,
    vue-i18n, or whatever you use.
  </p>

  <h2>text-size-picker — reader-controlled sizing</h2>
  <p>
    An accessibility win that takes minutes: the helper sets
    <code>data-text-size="&#123;slug&#125;"</code> on the document root and your
    CSS maps each value to sizing.
  </p>
  <pre><code>{`<` + `script>
  import TextSizePicker from "lily-design-system-svelte-text-size-picker";
</` + `script>

<TextSizePicker
  label="Text size"
  sizes={["small", "medium", "large", "x-large"]}
  storageKey="my-app-text-size"
/>`}</code></pre>
  <pre><code>{`:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 112.5%; }
:root[data-text-size="x-large"] { font-size: 125%; }`}</code></pre>
  <p>
    Size your layout in <code>rem</code> and the whole app scales with the
    user's choice. Labels are title-cased from the slugs
    ("X Large") or overridden with <code>sizeLabels</code>.
  </p>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Check your work:</strong> pick "Large" from the picker, and the
      page text grows. Reload — it's still large: the choice persisted to
      <code>localStorage</code>. Switch your language picker to Arabic and
      <code>dir="rtl"</code> lands on the document automatically.
    </p>
  </div>

  <h2>share-picker — send this page</h2>
  <p>
    A single-glyph button that opens the device's native share sheet where
    one exists, and otherwise falls back to a list of destinations you
    supply, plus a copy-the-URL action. It ships no social-network URLs —
    which networks belong in your product is your call, not the design
    system's.
  </p>
  <pre><code>{`<` + `script>
  import SharePicker from "lily-design-system-svelte-share-picker";

  const targets = [
    { id: "mastodon", label: "Mastodon",
      href: (url, title) => \`https://mastodon.social/share?text=\${encodeURIComponent(title)}%20\${encodeURIComponent(url)}\` },
    { id: "email", label: "Email",
      href: (url, title) => \`mailto:?subject=\${encodeURIComponent(title)}&body=\${encodeURIComponent(url)}\`, newTab: false },
  ];
</` + `script>

<SharePicker
  label="Share this page"
  title="An article worth reading"
  {targets}
  copyLabel="Copy link"
  copiedLabel="Link copied"
/>`}</code></pre>
  <p>
    <code>url</code> defaults to <code>location.href</code>, so the common
    case needs no wiring. Force a path with <code>strategy="list"</code> or
    <code>strategy="native"</code> when you need consistent behaviour across
    platforms for testing or screenshots.
  </p>

  <h2>date-time-picker — a date, a time, or both</h2>
  <p>
    A text field you can type into, plus an icon button that opens a
    WAI-ARIA APG date-picker dialog. Locale-correct by construction — month
    names, weekday names, first day of week, and 12- vs 24-hour clock all
    come from <code>Intl</code> — and the value is always a sortable,
    timezone-free ISO string: <code>"2026-03-15"</code> for
    <code>mode="date"</code>, <code>"09:30"</code> for
    <code>mode="time"</code>, <code>"2026-03-15T09:30"</code> for
    <code>mode="datetime"</code>.
  </p>
  <pre><code>{`<` + `script>
  import DateTimePicker from "lily-design-system-svelte-date-time-picker";

  let appointment = $state("");
</` + `script>

<DateTimePicker
  inputId="appointment"
  name="appointment"
  label="Choose an appointment date"
  locale="en-GB"
  bind:value={appointment}
  labels={{
    previousYear: "Previous year",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    nextYear: "Next year",
    confirm: "OK",
    cancel: "Cancel",
  }}
/>`}</code></pre>
  <p>
    The ISO value is identical to what <code>&lt;input type="date"&gt;</code>
    posts, so you can swap the native control in or out without touching
    your backend.
  </p>

  <h2>A settings panel in one place</h2>
  <p>The three preference helpers compose naturally:</p>
  <pre><code>{`<fieldset class="fieldset">
  <legend>Preferences</legend>
  <ThemePicker    label="Theme"     themesUrl="/themes/" themes={themes} storageKey="pref-theme" />
  <LocalePicker   label="Language"  locales={locales}    storageKey="pref-locale" />
  <TextSizePicker label="Text size" sizes={sizes}        storageKey="pref-text-size" />
</fieldset>`}</code></pre>

  <h2>Where to get them</h2>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-helpers
# or -react- / -vue- / -angular- / -html- / -nunjucks- / -blazor-`}</code></pre>
  <p>
    Each catalog has per-package specs, tests mapped to the spec clauses,
    runnable examples (including SSR cookie patterns), and a build + publish
    pipeline. The Svelte catalog is canonical; when in doubt, its contracts
    win.
  </p>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/components/">Component catalog</a> — the full 491-component reference.</li>
    <li><a href="/help/">Help</a> — troubleshooting and FAQ.</li>
    <li><a href="/why/">Why Lily</a> — and how to support the project.</li>
  </ul>
  <p>
    Questions along the way? The
    <a href="/help/#troubleshooting">help page</a> is full of answers — and
    if a step could be clearer,
    <a href="https://github.com/LilyDesignSystem">tell us</a> and we'll
    gladly improve the tutorial.
  </p>
</section>
