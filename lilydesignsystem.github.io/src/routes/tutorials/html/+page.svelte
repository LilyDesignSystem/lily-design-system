<svelte:head>
  <title>HTML tutorial — Lily Design System</title>
  <meta name="description" content="Build an accessible, styled form with Lily's HTML headless components — no build step required." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>HTML tutorial</h1>
  <p class="hero-tagline">
    The simplest possible start: copy semantic HTML with Lily's class hooks,
    add one stylesheet, ship. No build step, no framework, no install.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A small contact form — labelled inputs, a submit button, real keyboard
    and screen-reader behaviour — first bare, then styled, in about
    10 minutes.
  </p>

  <h2>Before you start</h2>
  <p>
    You need a browser and a text editor. That's all. (git helps for
    grabbing the component files, but you can copy them from GitHub in the
    browser too.)
  </p>

  <h2>Step 1 — Get the code</h2>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-html-headless
cd lily-design-system-html-headless`}</code></pre>
  <p>
    Every component is a standalone file in <code>components/</code> —
    <code>button.html</code>, <code>text-input.html</code>, and so on — with a
    header comment documenting its HTML tag, class hook, keyboard behaviour,
    and accessibility contract. There is nothing to install: the files
    <em>are</em> the library.
  </p>

  <h2>Step 2 — Your first component</h2>
  <p>Open <code>components/button.html</code>, or just write the markup — the class hook is the contract:</p>
  <pre><code>{`<button class="button" type="button">
  Save
</button>`}</code></pre>
  <p>
    Because it's a real <code>&lt;button&gt;</code>, keyboard focus, Enter and
    Space activation, and the implicit button role are already correct.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <pre><code>{`<form class="form">
  <div class="field">
    <label class="label" for="name">Full name</label>
    <input class="text-input" type="text" id="name" name="name" required />
  </div>
  <div class="field">
    <label class="label" for="email">Email</label>
    <input class="email-input" type="email" id="email" name="email" required />
  </div>
  <button class="button" type="submit">Save</button>
</form>`}</code></pre>
  <p>
    Note the pattern: every control links its <code>&lt;label for&gt;</code>,
    uses the most specific input type, and carries exactly one kebab-case
    class hook.
  </p>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Check your work:</strong> open the page in a browser. It looks
      plain — that's correct! No CSS has shipped yet. But press
      <kbd>Tab</kbd>: focus moves through every control, the labels are
      announced, and submit works. The behaviour is done; the look is yours,
      and it's next.
    </p>
  </div>

  <h2>Step 4 — Style it</h2>
  <p>Write CSS against the hooks:</p>
  <pre><code>{`.button {
  background: #2563eb;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: 0;
  border-radius: 0.5rem;
}
.text-input,
.email-input {
  padding: 0.5rem 0.75rem;
  border: 2px solid #6b7280;
  border-radius: 0.25rem;
}
.label { display: block; font-weight: 600; margin-bottom: 0.25rem; }`}</code></pre>
  <p>
    Or skip hand-writing CSS entirely — link one of the 45 ready-made themes
    and the same markup lights up:
  </p>
  <pre><code>{`<link rel="stylesheet" href="/themes/united-kingdom-national-health-service-england-for-patients.css" />`}</code></pre>

  <h2>Step 5 — Explore further</h2>
  <ul>
    <li>The repo's tests run real browsers: <code>pnpm install &amp;&amp; pnpm test</code> (WebDriverIO).</li>
    <li>Storybook for every component: <code>pnpm run storybook</code>.</li>
    <li>
      The <a href="/examples/">HTML+CSS+JS example app</a> shows all 490
      components styled, searchable, and demoed.
    </li>
  </ul>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/tutorials/theming/">Theming</a> — runtime theme switching with theme-select.</li>
    <li><a href="/tutorials/helpers/">Preference helpers</a> — language and text size.</li>
    <li><a href="/components/">Component catalog</a> — the full reference.</li>
  </ul>
  <p>
    Stuck, or was a step confusing? That's a bug in the tutorial — check the
    <a href="/help/#troubleshooting">troubleshooting guide</a> or
    <a href="https://github.com/LilyDesignSystem">open an issue</a>.
  </p>
</section>
