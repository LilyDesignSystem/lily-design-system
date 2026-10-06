<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>Osterreich Sozialversicherungsnummer View</h1>\n<p>OsterreichSozialversicherungsnummerView is a headless read-only display of Austria&#39;s Sozialversicherungsnummer (SVNR), Austria&#39;s government-issued personal identifier. It renders as a <code>&lt;span&gt;</code> with an accessible label. It is the read-only companion to OsterreichSozialversicherungsnummerInput.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders as <code>&lt;span&gt;</code></li>\n<li>Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.</li>\n<li>Provides accessible name via the <code>label</code> prop</li>\n<li>Companion to OsterreichSozialversicherungsnummerInput</li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>value</code>: string (default: &quot;&quot;) — the identifier to display</li>\n<li><code>label</code>: string (required) — accessible label via <code>aria-label</code></li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the <code>&lt;span&gt;</code></li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;SummaryList&gt;\n  &lt;SummaryListItem term=&quot;Sozialversicherungsnummer (SVNR)&quot;&gt;\n    &lt;OsterreichSozialversicherungsnummerView label=&quot;Sozialversicherungsnummer (SVNR)&quot; value={value} /&gt;\n  &lt;/SummaryListItem&gt;\n&lt;/SummaryList&gt;\n</code></pre>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-label={label}</code> — provides the accessible name</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to display a stored Austria Sozialversicherungsnummer (SVNR) read-only.</li>\n<li>Use in summary lists, patient records, audit logs, or detail views.</li>\n<li>Use when the identifier should not be editable in the current context.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for editing identifiers — use <code>osterreich-sozialversicherungsnummer-input</code> instead.</li>\n<li>Do not use for general text display — use a <code>&lt;span&gt;</code> directly.</li>\n<li>Do not use for other countries&#39; identifiers — use the corresponding country-specific view.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS. The consumer provides all styling targeting the <code>.osterreich-sozialversicherungsnummer-view</code> class hook.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify renders a <code>&lt;span&gt;</code> with the correct class</li>\n<li>Verify the <code>value</code> prop is rendered as text content</li>\n<li>Verify <code>aria-label</code> is set from the <code>label</code> prop</li>\n</ul>\n<h2>Domain Knowledge</h2>\n<p>Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.</p>\n<p><strong>Where to find it:</strong> Printed on the e-card (the Austrian health-insurance chip card) and required for every statutory health-insurance (Sozialversicherung), pension, and employment record.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>osterreich-sozialversicherungsnummer-input</code> — an input for entering Austria&#39;s Sozialversicherungsnummer (SVNR)</li>\n<li><code>summary-list-item</code> — one key-value pair in a summary list</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>Wikipedia: <a href=\"https://de.wikipedia.org/wiki/Sozialversicherungsnummer\">Sozialversicherungsnummer</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"osterreich-sozialversicherungsnummer-view\" aria-label=\"a read-only display of Austria's Sozialversicherungsnummer (SVNR)\">OsterreichSozialversicherungsnummerView</div>";
  const svelteSource: string = "// In your Svelte component:\nimport OsterreichSozialversicherungsnummerView from \"lily-design-system-svelte-headless/components/OsterreichSozialversicherungsnummerView/OsterreichSozialversicherungsnummerView.svelte\";\n\n<OsterreichSozialversicherungsnummerView>\n  <!-- content -->\n</OsterreichSozialversicherungsnummerView>\n";
  const usageCode: string = "<OsterreichSozialversicherungsnummerView label=\"OsterreichSozialversicherungsnummerView example\">Content</OsterreichSozialversicherungsnummerView>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>OsterreichSozialversicherungsnummerView — Lily Design System</title>
  <meta name="description" content="OsterreichSozialversicherungsnummerView is a headless read-only display of Austria's Sozialversicherungsnummer (SVNR), Austria's government-issued personal identifier. It renders as a &lt;span&gt; with an accessible label. It is the read-only companion to OsterreichSozialversicherungsnummerInput." />
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
    <summary style="cursor: pointer; font-weight: 600;">Show demo markup</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{demoHtml}</code></pre>
  </details>
  {#each variants as variant (variant.title)}
    <h3 style="margin-top: 1.5rem;">{variant.title}</h3>
    <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html variant.html}</div>
    <details style="margin-top: 0.5rem;">
      <summary style="cursor: pointer; font-weight: 600;">Show markup</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{variant.html}</code></pre>
    </details>
  {/each}
  {#if usageCode}
    <details style="margin-top: 1.5rem;" open>
      <summary style="cursor: pointer; font-weight: 600;">Usage example</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{usageCode}</code></pre>
    </details>
  {/if}
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/osterreich-sozialversicherungsnummer-view/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: osterreich-sozialversicherungsnummer-view</li>
      <li>PascalCase: OsterreichSozialversicherungsnummerView</li>
      <li>Description: a read-only display of Austria's Sozialversicherungsnummer (SVNR)</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .osterreich-sozialversicherungsnummer-view</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label</code> provides accessible name from label prop</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>value</code>: string (default: "") — the identifier to display</li>
      <li><code>label</code>: string (required) — accessible name via <code>aria-label</code></li>
      <li><code>...restProps</code>: any additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
