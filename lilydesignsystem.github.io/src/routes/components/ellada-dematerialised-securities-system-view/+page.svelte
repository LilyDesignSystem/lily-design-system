<script lang="ts">
  const html: string = "<h1>Ellada Dematerialised Securities System View</h1>\n\n<p>a read-only display of Greece's Dematerialised Securities System (DSS)</p>\n\n<p>This is a new component. See <a href=\"https://github.com/joelparkerhenderson/lily-design-system/tree/main/components/ellada-dematerialised-securities-system-view\">the canonical documentation</a> for full details.</p>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"ellada-dematerialised-securities-system-view\" aria-label=\"a read-only display of Greece's Dematerialised Securities System (DSS)\">ElladaDematerialisedSecuritiesSystemView</div>";
  const svelteSource: string = "// In your Svelte component:\nimport ElladaDematerialisedSecuritiesSystemView from \"lily-design-system-svelte-headless/components/ElladaDematerialisedSecuritiesSystemView/ElladaDematerialisedSecuritiesSystemView.svelte\";\n\n<ElladaDematerialisedSecuritiesSystemView label=\"Label\" value=\"Sample value\" />\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Ellada Dematerialised Securities System View — Lily Design System</title>
  <meta name="description" content="a read-only display of Greece's Dematerialised Securities System (DSS)" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/ellada-dematerialised-securities-system-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: ellada-dematerialised-securities-system-view</li>
      <li>PascalCase: ElladaDematerialisedSecuritiesSystemView</li>
      <li>Description: a read-only display of Greece's Dematerialised Securities System (DSS)</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .ellada-dematerialised-securities-system-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label</code> provides accessible name from label prop</li>
      <li><code>role="text"</code> so the identifier announces as a single unit</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>value</code>: string (required) — the identifier to display</li>
      <li><code>label</code>: string (optional) — accessible name override via <code>aria-label</code></li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
