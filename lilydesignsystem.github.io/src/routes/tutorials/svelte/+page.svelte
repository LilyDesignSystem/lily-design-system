<svelte:head>
  <title>Svelte tutorial — Lily Design System</title>
  <meta name="description" content="Build an accessible, styled form with Lily's Svelte 5 headless components: runes, snippets, and bind:value." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Svelte tutorial</h1>
  <p class="hero-tagline">
    Lily's Svelte library is the canonical implementation: Svelte 5 runes,
    typed props, rest-prop spread, and two-way binding with
    <code>bind:value</code>.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A small contact form — labelled input, submit button, two-way binding,
    real keyboard and screen-reader behaviour — first bare, then styled, in
    about 10 minutes.
  </p>

  <h2>Before you start</h2>
  <p>
    You need git, Node 22 or later, and pnpm 10 or later. Any Svelte 5
    project works — a fresh <code>npx sv create</code> app is fine.
  </p>

  <h2>Step 1 — Get the code</h2>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-headless
cd lily-design-system-svelte-headless
pnpm install
pnpm test        # vitest — thousands of component cases
pnpm run storybook   # browse all 490 components`}</code></pre>
  <p>
    Components live in <code>src/lib/components/&#123;Name&#125;/</code>, one
    directory per component with the <code>.svelte</code> file, its tests,
    its stories, and its docs side by side. Copy the directories you need
    into your app, or depend on the repo and import directly.
  </p>

  <h2>Step 2 — Your first component</h2>
  <!-- `<` + `script>` keeps the literal tag out of the Svelte compiler's view. -->
  <pre><code>{`<` + `script>
  import Button from "$lib/components/Button/Button.svelte";

  function save() { console.log("saved"); }
</` + `script>

<Button onclick={save}>Save</Button>`}</code></pre>
  <p>
    Renders <code>&lt;button class="button" type="button"&gt;</code>. The
    props are typed: <code>type</code>, <code>disabled</code>,
    <code>pressed</code> (renders <code>aria-pressed</code> for toggle
    buttons), <code>label</code> (an <code>aria-label</code> override), and
    any extra attribute spreads onto the root.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <pre><code>{`<` + `script>
  import Form from "$lib/components/Form/Form.svelte";
  import Field from "$lib/components/Field/Field.svelte";
  import Label from "$lib/components/Label/Label.svelte";
  import TextInput from "$lib/components/TextInput/TextInput.svelte";
  import Button from "$lib/components/Button/Button.svelte";

  let name = $state("");
</` + `script>

<Form onsubmit={handleSubmit}>
  <Field>
    <Label for="name">Full name</Label>
    <TextInput id="name" label="Full name" bind:value={name} required />
  </Field>
  <Button type="submit">Save</Button>
</Form>`}</code></pre>
  <p>
    <code>TextInput</code>'s <code>value</code> is a <code>$bindable</code>
    rune prop, so <code>bind:value</code> gives you two-way binding straight
    away.
  </p>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Check your work:</strong> run the app and the form looks
      plain — exactly as intended: styling is still ahead. Press
      <kbd>Tab</kbd>: focus moves through every control, the label is
      announced, and submit works. The behaviour is done; the look is yours,
      and it's next.
    </p>
  </div>

  <h2>Step 4 — Style it</h2>
  <p>
    Everything above renders as pure structure, ready for your styles.
    Style the class hooks —
    <code>.button</code>, <code>.text-input</code>, <code>.label</code>,
    <code>.field</code> — in your global stylesheet, or link a ready-made
    theme in <code>app.html</code>:
  </p>
  <pre><code>{`<link rel="stylesheet" href="/themes/dark.css" />`}</code></pre>
  <p>
    Per-instance tweaks go through the <code>class</code> prop, which appends
    to the base hook: <code>&lt;Button class="wide"&gt;</code> renders
    <code>class="button wide"</code>.
  </p>

  <h2>Step 5 — See it all working</h2>
  <p>
    The <a href="/examples/">SvelteKit example app</a> is the same catalog
    fully styled, with live demos, Playwright e2e tests, and an axe-core
    accessibility baseline:
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-svelte-sveltekit-examples
cd lily-design-system-svelte-sveltekit-examples
pnpm install && pnpm run dev`}</code></pre>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/tutorials/theming/">Theming</a> — runtime switching with the Svelte theme-select helper.</li>
    <li><a href="/tutorials/helpers/">Preference helpers</a> — language and text size.</li>
    <li><a href="/components/">Component catalog</a> — props, ARIA, and keyboard per component.</li>
  </ul>
  <p>
    Questions along the way? The
    <a href="/help/#troubleshooting">help page</a> is full of answers — and
    if a step could be clearer,
    <a href="https://github.com/LilyDesignSystem">tell us</a> and we'll
    gladly improve the tutorial.
  </p>
</section>
