<svelte:head>
  <title>Cookie policy — Lily Design System</title>
  <meta
    name="description"
    content="This site sets one preference cookie, only after you choose a theme, and keeps a few choices in browser storage. Here is each one, what it is for and how to clear it."
  />
</svelte:head>

<section class="page-intro">
  <h1>Cookie policy</h1>
  <p class="page-intro-tagline">
    The Lily website sets one cookie, and only if you choose a theme. It also keeps a few choices in your browser’s storage so
    they last. This page lists all of it.
  </p>
</section>

<section class="prose">
  <h2>What cookies and browser storage are</h2>
  <p>
    A cookie is a small file a website asks your browser to keep, which is sent back on every later request. Browsers
    also offer storage that stays on your device and is never sent to a server: <em>local storage</em> (kept until you
    clear it) and <em>session storage</em> (cleared when you close the tab). This policy covers all three.
  </p>

  <h2>Cookies</h2>
  <p>
    <strong>The only cookies we use are for your own user preferences.</strong> Today that is one cookie, set when you choose a
    colour theme. Your text size and your language are also preferences, but they are kept in browser storage, not in
    cookies; see below. Nothing is set when you first arrive.
  </p>
  <div class="scroll" role="region" aria-label="Cookie table" tabindex="0">
    <table>
      <caption>Cookies set by this site</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Kind</th>
          <th scope="col">What it holds and why</th>
          <th scope="col">How long</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row"><code>lily-theme</code></th>
          <td>First-party preference cookie, <code>SameSite=Lax</code>, for the whole site</td>
          <td>The name of the theme you chose, so the page can use it again on your next visit.</td>
          <td>400 days, or until you clear it</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p>
    It holds only the name of a theme; it does not identify you. It is set because you asked for a theme, so we do not show a
    consent banner for it. There are no analytics, advertising or tracking cookies, and no third-party scripts, fonts or
    embedded media. If you would rather not have it, do not choose a theme, or block cookies for this site: the site works the
    same, with the default theme.
  </p>

  <h2>Browser storage we use</h2>
  <p>
    These values stay in your browser and are never sent to us. They hold your own choices and nothing that identifies you.
  </p>
  <div class="scroll" role="region" aria-label="Browser storage table" tabindex="0">
    <table>
      <caption>Browser storage used by this site</caption>
      <thead>
        <tr>
          <th scope="col">Key</th>
          <th scope="col">Kind</th>
          <th scope="col">What it remembers</th>
          <th scope="col">How long</th>
        </tr>
      </thead>
      <tbody>
        <tr><th scope="row"><code>lily-site-theme</code></th><td>Local storage</td><td>The theme you picked in the header.</td><td>Until you clear it</td></tr>
        <tr><th scope="row"><code>lily-site-text-size</code></th><td>Local storage</td><td>The text size you picked.</td><td>Until you clear it</td></tr>
        <tr><th scope="row"><code>lily-locale</code></th><td>Local storage</td><td>The language you picked.</td><td>Until you clear it</td></tr>
        <tr><th scope="row"><code>lily-site-time-zone</code></th><td>Local storage</td><td>The time zone you picked, if you used the time zone control.</td><td>Until you clear it</td></tr>
        <tr><th scope="row"><code>lily-locale-redirect-done</code></th><td>Session storage</td><td>That your browser’s language has already been used once to choose a language for this visit, so you are not redirected again.</td><td>Until you close the tab</td></tr>
        <tr><th scope="row"><code>lily-demo-…</code>, <code>lily-emr-…</code>, <code>lily-health-…</code> and similar</th><td>Local storage</td><td>The same three choices (theme, text size, language) kept separately for each example application, so one example does not change another.</td><td>Until you clear it</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    The site works without any of these. If storage is blocked, you simply get the default theme, text size and language
    each time.
  </p>

  <h2>Your choices</h2>
  <ul>
    <li>Use the theme, language and text-size controls in the header at any time; each new choice replaces the old one.</li>
    <li>Clear the cookie and the stored values in your browser’s settings under site data, or by using private browsing, which discards them when you close the window.</li>
    <li>Turn off storage for this site in your browser’s settings. Nothing will break.</li>
  </ul>

  <h2>Other sites</h2>
  <p>
    This site links to other websites, such as the code repository and social networks. They may set their own cookies. We do
    not control them; read their policies before you use them.
  </p>

  <h2>Changes</h2>
  <p>
    If we ever add another cookie, or a script that sets one, we will list it here before it goes live, and ask for your
    permission first if it is not a preference you chose. This policy was last reviewed on 21 November 2026. See also the <a href="/en-001/privacy-policy/">privacy policy</a>.
  </p>
</section>

<style>
  .scroll {
    overflow-x: auto;
  }
</style>
