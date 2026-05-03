<script lang="ts">
  import { LILY_COMPONENTS } from '$lib/components';
</script>

<svelte:head>
  <title>Lily Design System</title>
  <meta
    name="description"
    content="Lily is a free, open-source, accessible, headless design system with components across HTML, Svelte, React, Vue, Blazor, and Nunjucks."
  />
</svelte:head>

<section class="hero">
  <img
    class="hero-logo"
    src="/assets/images/lily-design-system-icon/lily-design-system-icon.svg"
    alt=""
    aria-hidden="true"
  />
  <p class="hero-eyebrow">Free, open source, accessible</p>
  <h1>Build products faster.</h1>
  <p class="hero-tagline">
    Lily is a free design system with headless components for HTML, Svelte,
    React, Vue, Blazor, and Nunjucks. Bring your own styles — keep accessibility
    and i18n built in.
  </p>
  <div class="button-row">
    <a class="button button-primary" href="/components/">Browse components</a>
    <a class="button button-secondary" href="/help/">Get started</a>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Quick start</p>
    <h2>Try Lily in 30 seconds</h2>
  </header>

  <div class="prose" style="margin: 0 auto;">
    <p>Pick the framework you use. Browse the source. Copy a component. Style it.</p>
    <p>
      Each component is a single file — no runtime, no compiler magic, no design
      tokens you didn't ask for. Headless components export semantic HTML with the
      kebab-case class name; you write the CSS.
    </p>

    <pre><code>{`<!-- HTML headless: Button -->
<button class="button" type="button" aria-label="Save">
  Save
</button>`}</code></pre>

    <pre><code>{`// React headless: Button
import Button from "lily-design-system-react-headless/components/Button";

<Button onClick={save}>Save</Button>`}</code></pre>

    <p style="text-align: center; margin-top: 2rem;">
      <a class="button button-primary" href="/help/">Read the full setup guide →</a>
    </p>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <p class="section-heading-eyebrow">Catalog</p>
    <h2>All components, alphabetical</h2>
  </header>

  <ul class="component-list component-list-stacked" aria-label="All components">
    {#each LILY_COMPONENTS as component (component.name)}
      <li class="component-list-item">
        <span class="component-list-item-name">{component.name}</span>
        <span class="component-list-item-description">{component.description}</span>
      </li>
    {/each}
  </ul>
</section>
