<svelte:head>
  <title>Preference helpers tutorial — Lily Design System</title>
  <meta name="description" content="Add user language and text-size preferences with Lily's locale-select and text-size-select helpers: native selects with persistence and SSR safety." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Preference helpers</h1>
  <p class="hero-tagline">
    Three small packages per framework, each owning one user preference end
    to end — selection, DOM application, persistence. You've met
    <a href="/tutorials/theming/">theme-select</a>; here are the other two.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>The shape they share</h2>
  <ul>
    <li>A native <code>&lt;select&gt;</code> with one <code>&lt;option&gt;</code> per choice — native keyboard, mobile OS picker for free.</li>
    <li>Headless: one class hook (<code>.locale-select</code>, <code>.text-size-select</code>), zero CSS shipped.</li>
    <li>Optional <code>localStorage</code> persistence via a <code>storageKey</code> prop.</li>
    <li>SSR-safe: DOM writes happen only in the mount/effect lifecycle.</li>
    <li>i18n-clean: every user-facing string is a prop.</li>
    <li>
      Available for Svelte (canonical), React, Vue, Angular, HTML custom
      element, Nunjucks, and Blazor — same contract in each.
    </li>
  </ul>

  <h2>locale-select — language and direction</h2>
  <p>
    Lets the user pick a locale, then writes <code>lang</code> and
    <code>dir</code> to the document root so your i18n library, your CSS,
    and assistive technology all follow. RTL is detected automatically for
    Arabic, Hebrew, and other right-to-left scripts. It performs
    <em>no translation</em> — it signals; your i18n library reacts.
  </p>
  <!-- `<` + `script>` keeps the literal tag out of the Svelte compiler's view. -->
  <pre><code>{`<` + `script>
  import LocaleSelect from "lily-design-system-svelte-locale-select";

  let locale = $state("en-US");
</` + `script>

<LocaleSelect
  label="Language"
  locales={["en-US", "fr", "ar", "he", "ja"]}
  bind:value={locale}
  storageKey="my-app-locale"
/>`}</code></pre>
  <p>
    Options are labelled from a built-in table of locale names (overridable
    via <code>localeLabels</code>), each <code>&lt;option&gt;</code> carries
    its own <code>lang</code> attribute so screen readers pronounce
    "Français" in French, and underscore codes like <code>en_US</code>
    round-trip losslessly to BCP 47 <code>en-US</code>. Wire
    <code>onChange</code> (or the bound value) into i18next, Paraglide,
    vue-i18n, or whatever you use.
  </p>

  <h2>text-size-select — reader-controlled sizing</h2>
  <p>
    An accessibility win that takes minutes: the helper sets
    <code>data-text-size="&#123;slug&#125;"</code> on the document root and your
    CSS maps each value to sizing.
  </p>
  <pre><code>{`<` + `script>
  import TextSizeSelect from "lily-design-system-svelte-text-size-select";
</` + `script>

<TextSizeSelect
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

  <h2>A settings panel in one place</h2>
  <p>The three helpers compose naturally:</p>
  <pre><code>{`<fieldset class="fieldset">
  <legend>Preferences</legend>
  <ThemeSelect    label="Theme"     themesUrl="/themes/" themes={themes} storageKey="pref-theme" />
  <LocaleSelect   label="Language"  locales={locales}    storageKey="pref-locale" />
  <TextSizeSelect label="Text size" sizes={sizes}        storageKey="pref-text-size" />
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
    <li><a href="/components/">Component catalog</a> — the full 490-component reference.</li>
    <li><a href="/help/">Help</a> — troubleshooting and FAQ.</li>
    <li><a href="/why/">Why Lily</a> — and how to support the project.</li>
  </ul>
</section>
