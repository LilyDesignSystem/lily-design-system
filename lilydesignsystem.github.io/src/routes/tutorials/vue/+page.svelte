<svelte:head>
  <title>Vue tutorial — Lily Design System</title>
  <meta name="description" content="Build an accessible, styled form with Lily's Vue 3 headless components: single-file components with v-model." />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Tutorials</p>
  <h1>Vue tutorial</h1>
  <p class="hero-tagline">
    Vue 3 single-file components with typed props, <code>defineModel</code>
    two-way binding, and <code>v-bind="$attrs"</code> pass-through.
  </p>
</section>

<section class="section prose" style="margin: 0 auto;">
  <h2>What you'll build</h2>
  <p>
    A small contact form — labelled input, submit button, <code>v-model</code>
    binding, real keyboard and screen-reader behaviour — first bare, then
    styled, in about 10 minutes.
  </p>

  <h2>Before you start</h2>
  <p>
    You need git, Node 22 or later, and pnpm 10 or later. Any Vue 3 project
    works — Nuxt, Vite, or plain Vue.
  </p>

  <h2>Step 1 — Get the code</h2>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-vue-headless
cd lily-design-system-vue-headless
pnpm install
pnpm test        # vitest + @testing-library/vue
pnpm run storybook   # browse all 490 components`}</code></pre>
  <p>
    Components are flat files in <code>components/</code> —
    <code>Button.vue</code>, <code>TextInput.vue</code> — each with its test,
    story, and docs alongside. Copy the files you need, or vendor the repo.
  </p>

  <h2>Step 2 — Your first component</h2>
  <!-- `<` + `script setup>` keeps the literal tag out of the Svelte compiler's view. -->
  <pre><code>{`<` + `script setup>
import Button from "lily-design-system-vue-headless/components/Button.vue";
</` + `script>

<template>
  <Button @click="save">Save</Button>
</template>`}</code></pre>
  <p>
    Renders <code>&lt;button class="button" type="button"&gt;</code>. Props
    mirror the other frameworks: <code>type</code>, <code>disabled</code>,
    <code>pressed</code>, <code>label</code>, plus attribute fall-through for
    everything else.
  </p>

  <h2>Step 3 — Compose a small form</h2>
  <pre><code>{`<` + `script setup>
import { ref } from "vue";
import Form from ".../components/Form.vue";
import Field from ".../components/Field.vue";
import Label from ".../components/Label.vue";
import TextInput from ".../components/TextInput.vue";
import Button from ".../components/Button.vue";

const name = ref("");
</` + `script>

<template>
  <Form @submit="handleSubmit">
    <Field>
      <Label for="name">Full name</Label>
      <TextInput id="name" label="Full name" v-model="name" required />
    </Field>
    <Button type="submit">Save</Button>
  </Form>
</template>`}</code></pre>
  <p>
    <code>TextInput</code> uses <code>defineModel</code>, so plain
    <code>v-model</code> works out of the box.
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
    Style the class hooks — <code>.button</code>, <code>.text-input</code>,
    <code>.label</code>, <code>.field</code> — in your stylesheet, or link a
    ready-made theme in <code>index.html</code> / <code>nuxt.config</code>:
  </p>
  <pre><code>{`<link rel="stylesheet" href="/themes/nord.css" />`}</code></pre>

  <h2>Step 5 — See it all working</h2>
  <p>
    The <a href="/examples/">Nuxt example app</a> is the full catalog styled
    and demoed, with Playwright e2e and an axe-core baseline:
  </p>
  <pre><code>{`git clone https://github.com/LilyDesignSystem/lily-design-system-vue-nuxt-examples
cd lily-design-system-vue-nuxt-examples
pnpm install && pnpm run dev`}</code></pre>

  <h2>Next steps</h2>
  <ul>
    <li><a href="/tutorials/theming/">Theming</a> — runtime switching with the Vue theme-select helper.</li>
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
