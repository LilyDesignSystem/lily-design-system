<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>Osterreich Sozialversicherungsnummer Input</h1>\n<p>OsterreichSozialversicherungsnummerInput is a headless input for entering Austria&#39;s Sozialversicherungsnummer (SVNR), Austria&#39;s government-issued personal identifier. It renders as <code>&lt;input type=&quot;text&quot;&gt;</code> with <code>autocomplete=&quot;off&quot;</code> to protect sensitive identifiers. It is the editable companion to OsterreichSozialversicherungsnummerView.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders as <code>&lt;input type=&quot;text&quot;&gt;</code></li>\n<li>Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.</li>\n<li><code>autocomplete=&quot;off&quot;</code> to protect sensitive identifiers</li>\n<li>Supports two-way binding on the <code>value</code> prop</li>\n<li>Companion to OsterreichSozialversicherungsnummerView</li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) — accessible label via <code>aria-label</code></li>\n<li><code>value</code>: string (default: &quot;&quot;) — bindable input value</li>\n<li><code>required</code>: boolean (default: false) — form validation</li>\n<li><code>disabled</code>: boolean (default: false) — disabled state</li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the <code>&lt;input&gt;</code></li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Field label=&quot;Sozialversicherungsnummer (SVNR)&quot; required&gt;\n  &lt;OsterreichSozialversicherungsnummerInput label=&quot;Sozialversicherungsnummer (SVNR)&quot; value={value} required /&gt;\n  &lt;Hint&gt;Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.&lt;/Hint&gt;\n  &lt;ErrorMessage&gt;Please enter a valid Sozialversicherungsnummer&lt;/ErrorMessage&gt;\n&lt;/Field&gt;\n</code></pre>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-label={label}</code> — provides accessible name</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use in forms collecting Austria&#39;s Sozialversicherungsnummer (SVNR).</li>\n<li>Use in administrative or national-id workflows where the identifier is required.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for displaying read-only identifiers — use <code>osterreich-sozialversicherungsnummer-view</code> instead.</li>\n<li>Do not use for general text input — use <code>text-input</code> instead.</li>\n<li>Do not use for other countries&#39; identifiers — use the corresponding country-specific input.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS. The consumer provides all styling targeting the <code>.osterreich-sozialversicherungsnummer-input</code> class hook.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify renders an <code>&lt;input&gt;</code> with the correct class and <code>type=&quot;text&quot;</code></li>\n<li>Verify <code>aria-label</code> is set from the <code>label</code> prop</li>\n<li>Verify <code>autocomplete=&quot;off&quot;</code></li>\n<li>Verify value binding works</li>\n</ul>\n<h2>Domain Knowledge</h2>\n<p>Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.</p>\n<p><strong>Where to find it:</strong> Printed on the e-card (the Austrian health-insurance chip card) and required for every statutory health-insurance (Sozialversicherung), pension, and employment record.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>osterreich-sozialversicherungsnummer-view</code> — a read-only display of Austria&#39;s Sozialversicherungsnummer (SVNR)</li>\n<li><code>text-input</code> — a single-line text input field &lt;input type=\"text\"&gt;</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>Wikipedia: <a href=\"https://de.wikipedia.org/wiki/Sozialversicherungsnummer\">Sozialversicherungsnummer</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"osterreich-sozialversicherungsnummer-input\" aria-label=\"an input for entering Austria's Sozialversicherungsnummer (SVNR)\">OsterreichSozialversicherungsnummerInput</div>";
  const svelteSource: string = "// In your Svelte component:\nimport OsterreichSozialversicherungsnummerInput from \"lily-design-system-svelte-headless/components/OsterreichSozialversicherungsnummerInput/OsterreichSozialversicherungsnummerInput.svelte\";\n\n<OsterreichSozialversicherungsnummerInput>\n  <!-- content -->\n</OsterreichSozialversicherungsnummerInput>\n";
  const usageCode: string = "<OsterreichSozialversicherungsnummerInput label=\"OsterreichSozialversicherungsnummerInput example\">Content</OsterreichSozialversicherungsnummerInput>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>OsterreichSozialversicherungsnummerInput — Lily Design System</title>
  <meta name="description" content="OsterreichSozialversicherungsnummerInput is a headless input for entering Austria's Sozialversicherungsnummer (SVNR), Austria's government-issued personal identifier. It renders as &lt;input type=&quot;text&quot;&gt; with autocomplete=&quot;off&quot; to protect sensitive identifiers. It is the editable companion to Osterr…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/osterreich-sozialversicherungsnummer-input/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: osterreich-sozialversicherungsnummer-input</li>
      <li>PascalCase: OsterreichSozialversicherungsnummerInput</li>
      <li>Description: an input for entering Austria's Sozialversicherungsnummer (SVNR)</li>
      <li>Status: beta — implemented and unit-tested in all seven frameworks; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;input&gt;</li>
      <li>CSS class: .osterreich-sozialversicherungsnummer-input</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label</code> provides accessible name from label prop</li>
      <li><code>required</code> and <code>disabled</code> states conveyed to assistive technology</li>
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
