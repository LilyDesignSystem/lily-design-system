<svelte:head>
  <title>React tutorial — Lily Design System</title>
  <meta name="description" content="Build an accessible, styled form with Lily's React headless components: typed function components with value + onChange." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>React tutorial</h1>
  <p class="hero-tagline">
    Typed function components, one file each, controlled with the standard
    <code>value</code> + <code>onChange</code> pattern — nothing to learn
    beyond React itself.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A small contact form — labelled input, submit button, controlled state,
    real keyboard and screen-reader behaviour — first bare, then styled, in
    about 10 minutes.
  </p>

  <h2>Before you start</h2>
  <p>
    You need git, Node 22 or later, and pnpm 10 or later. Any React 18+
    project works — Next.js, Vite, or plain React.
  </p>

  <h2>Step 1 — Get the code</h2>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-react-headless
cd lily-design-system-react-headless
pnpm install
pnpm test        # vitest + @testing-library/react
pnpm run storybook   # browse all 490 components`}</code></pre>
  <p>
    Components are flat files in <code>components/</code> —
    <code>Button.tsx</code>, <code>TextInput.tsx</code> — each with its test,
    story, and docs alongside. Copy the files you need into your app, or
    vendor the repo and import from it.
  </p>

  <h2>Step 2 — Your first component</h2>
  <pre><code>{`import Button from "lily-design-system-react-headless/components/Button";

export function SaveBar() {
  return <Button onClick={save}>Save</Button>;
}`}</code></pre>
  <p>
    Renders <code>&lt;button class="button" type="button"&gt;</code>. Props:
    <code>type</code>, <code>disabled</code>, <code>pressed</code> (renders
    <code>aria-pressed</code>), <code>label</code> (an
    <code>aria-label</code> override), <code>className</code>, and any extra
    attribute spreads onto the root element.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <pre><code>{`import { useState } from "react";
import Form from ".../components/Form";
import Field from ".../components/Field";
import Label from ".../components/Label";
import TextInput from ".../components/TextInput";
import Button from ".../components/Button";

export function ContactForm() {
  const [name, setName] = useState("");
  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label htmlFor="name">Full name</Label>
        <TextInput id="name" label="Full name" value={name} onChange={setName} required />
      </Field>
      <Button type="submit">Save</Button>
    </Form>
  );
}`}</code></pre>
  <div class="callout">
    <p style="margin: 0;">
      <strong>Check your work:</strong> run the app and the form looks
      plain — that's correct! No CSS has shipped yet. But press
      <kbd>Tab</kbd>: focus moves through every control, the label is
      announced, and submit works. The behaviour is done; the look is yours,
      and it's next.
    </p>
  </div>

  <h2>Step 4 — Style it</h2>
  <p>
    Nothing above ships CSS. Style the hooks — <code>.button</code>,
    <code>.text-input</code>, <code>.label</code>, <code>.field</code> — in
    your stylesheet, layer Tailwind utilities via <code>className</code>, or
    link a ready-made theme:
  </p>
  <pre><code>{`<link rel="stylesheet" href="/themes/united-states-web-design-system.css" />`}</code></pre>

  <h2>Step 5 — See it all working</h2>
  <p>
    The <a href="/examples/">Next.js example app</a> is the full catalog
    styled and demoed, with Playwright e2e and an axe-core baseline:
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-react-next-examples
cd lily-design-system-react-next-examples
pnpm install && pnpm run dev`}</code></pre>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/tutorials/theming/">Theming</a> — runtime switching with the React theme-select helper.</li>
    <li><a href="/tutorials/helpers/">Preference helpers</a> — language and text size.</li>
    <li><a href="/components/">Component catalog</a> — props, ARIA, and keyboard per component.</li>
  </ul>
  <p>
    Stuck, or was a step confusing? That's a bug in the tutorial — check the
    <a href="/help/#troubleshooting">troubleshooting guide</a> or
    <a href="https://github.com/LilyDesignSystem">open an issue</a>.
  </p>
</section>
