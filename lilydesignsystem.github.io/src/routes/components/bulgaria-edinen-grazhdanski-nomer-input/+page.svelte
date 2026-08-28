<script lang="ts">
  const html: string = "<h1>Bulgaria Edinen Grazhdanski Nomer Input</h1>\n\n<p>an input for entering Bulgaria's \u0415\u0434\u0438\u043d\u0435\u043d \u0433\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u043a\u0438 \u043d\u043e\u043c\u0435\u0440 / Edinen grazhdanski nomer (EGN)</p>\n\n<p>This is a new component. See <a href=\"https://github.com/joelparkerhenderson/lily-design-system/tree/main/components/bulgaria-edinen-grazhdanski-nomer-input\">the canonical documentation</a> for full details.</p>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<label class=\"label\" for=\"demo-input\">Label</label><input class=\"bulgaria-edinen-grazhdanski-nomer-input\" id=\"demo-input\" aria-label=\"an input for entering Bulgaria's \u0415\u0434\u0438\u043d\u0435\u043d \u0433\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u043a\u0438 \u043d\u043e\u043c\u0435\u0440 / Edinen grazhdanski nomer (EGN)\" />";
  const svelteSource: string = "// In your Svelte component:\nimport BulgariaEdinenGrazhdanskiNomerInput from \"lily-design-system-svelte-headless/components/BulgariaEdinenGrazhdanskiNomerInput/BulgariaEdinenGrazhdanskiNomerInput.svelte\";\n\n<BulgariaEdinenGrazhdanskiNomerInput label=\"Label\" />\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Bulgaria Edinen Grazhdanski Nomer Input — Lily Design System</title>
  <meta name="description" content="an input for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)" />
</svelte:head>

<nav class="component-page-back" aria-label="Breadcrumb" style="max-width: 64rem; margin: 0 auto; padding: 1.5rem 1rem 0;">
  <a href="/components/">← All components</a>
</nav>

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 1rem 1rem 2rem;">
  {@html html}
</article>

<!-- BEGIN auto-generated component example -->
<section class="component-example" aria-labelledby="example-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="example-heading">Example</h2>
  <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html demoHtml}</div>
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <pre style="overflow-x: auto; padding: 1rem; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/bulgaria-edinen-grazhdanski-nomer-input/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: bulgaria-edinen-grazhdanski-nomer-input</li>
      <li>PascalCase: BulgariaEdinenGrazhdanskiNomerInput</li>
      <li>Description: an input for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN)</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;input&gt;</li>
      <li>CSS class: .bulgaria-edinen-grazhdanski-nomer-input</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label</code> provides accessible name from label prop</li>
      <li><code>required</code> and <code>disabled</code> states conveyed to assistive technology</li>
      <li><code>aria-label</code> provided from the <code>label</code> prop</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Standard text input keyboard behavior</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) — accessible label via aria-label</li>
      <li><code>value</code>: string (default: "") — bindable input value</li>
      <li><code>required</code>: boolean (default: false) — form validation</li>
      <li><code>disabled</code>: boolean (default: false) — disabled state</li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
