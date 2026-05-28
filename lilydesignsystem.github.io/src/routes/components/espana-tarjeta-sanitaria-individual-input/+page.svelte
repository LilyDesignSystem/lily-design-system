<script lang="ts">
  const html: string = "<h1>Espana Tarjeta Sanitaria Individual Input</h1>\n\n<p>EspanaTarjetaSanitariaIndividualInput is a headless input for entering a España Tarjeta Sanitaria Individual (TSI), the unique national healthcare identifier also known as CIP-SNS. It renders as <code>&lt;input type=\"text\"&gt;</code> with autocomplete disabled to protect sensitive health data. It is the editable companion to EspanaTarjetaSanitariaIndividualView.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders as <code>&lt;input type=\"text\"&gt;</code> with <code>autocomplete=\"off\"</code></li>\n<li>Supports two-way binding on the <code>value</code> prop</li>\n<li>Companion to EspanaTarjetaSanitariaIndividualView</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (required) -- accessible label via <code>aria-label</code></li>\n<li><code>value</code>: string (default: \"\") -- bindable input value</li>\n<li><code>required</code>: boolean (default: false) -- form validation</li>\n<li><code>disabled</code>: boolean (default: false) -- disabled state</li>\n<li><code>...restProps</code>: any -- additional HTML attributes spread onto the <code>&lt;input&gt;</code></li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Field label=\"Tarjeta Sanitaria Individual\" required&gt;\n  &lt;EspanaTarjetaSanitariaIndividualInput label=\"TSI\" value={tsi} required /&gt;\n  &lt;Hint&gt;Enter your CIP-SNS code from your health card&lt;/Hint&gt;\n  &lt;ErrorMessage&gt;Please enter a valid TSI number&lt;/ErrorMessage&gt;\n&lt;/Field&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Standard text input keyboard behavior</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label={label}</code> -- provides accessible name</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use in clinical or administrative forms to collect a Spanish TSI / CIP-SNS healthcare identifier.</li>\n<li>Use with validation for the TSI identifier format.</li>\n<li>Use in patient registration workflows where the TSI is required for healthcare access in Spain.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for displaying read-only identifiers -- use EspanaTarjetaSanitariaIndividualView instead.</li>\n<li>Do not use for general text input -- use TextInput instead.</li>\n<li>Do not use for other national identifiers -- use the corresponding country-specific input component.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides a bare <code>&lt;input type=\"text\"&gt;</code> with <code>aria-label</code> and <code>autocomplete=\"off\"</code>. The consumer provides all styling.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.espana-tarjeta-sanitaria-individual-input</code> class for targeting.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify renders an <code>&lt;input&gt;</code> with the correct class and type=\"text\"</li>\n<li>Verify <code>aria-label</code> is set from the label prop</li>\n<li>Verify <code>autocomplete=\"off\"</code></li>\n<li>Verify value binding works</li>\n</ul>\n\n<h2>Domain Knowledge</h2>\n\n<p>The España Tarjeta Sanitaria Individual (TSI) uses a CIP-SNS code that typically begins with 4 digits indicating the Autonomous Community region, followed by a variable mix of alphanumeric characters. The code is printed on the front of the health card, often below the barcode. To obtain the card, España citizens use their DNI (National Identity Document) and non-España citizens use their NIE (Foreigner Identification Number). A 12-digit España Social Security Number (NUSS/NAF) is also required for registration.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>espana-tarjeta-sanitaria-individual-view</code> — a read-only display of an España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier</li>\n<li><code>text-input</code> — a single-line text input field &lt;input type=\"text\"&gt;</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>Ministerio de Sanidad: https://www.sanidad.gob.es/</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<label class=\"label\" for=\"demo-input\">Label</label><input class=\"espana-tarjeta-sanitaria-individual-input\" id=\"demo-input\" aria-label=\"an input for entering an Espa\u00f1a Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier\" />";
  const svelteSource: string = "// In your Svelte component:\nimport EspanaTarjetaSanitariaIndividualInput from \"lily-design-system-svelte-headless/components/EspanaTarjetaSanitariaIndividualInput/EspanaTarjetaSanitariaIndividualInput.svelte\";\n\n<EspanaTarjetaSanitariaIndividualInput label=\"Label\" />\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Espana Tarjeta Sanitaria Individual Input — Lily Design System</title>
  <meta name="description" content="EspanaTarjetaSanitariaIndividualInput is a headless input for entering a España Tarjeta Sanitaria Individual (TSI), the unique national healthcare identifier also known as CIP-SNS. It renders as &lt;i..." />
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

