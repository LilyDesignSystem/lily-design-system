<script lang="ts">
  const html: string = "<h1>AddressographBox</h1>\n\n<p>An addressograph-box is a box that shows a person's identification details, such as name, date of birth, tracking information (e.g., medical record number, patient number), and salient notations (e.g., allergy alerts, fall risk).</p>\n\n<p>This headless component renders a <code>&lt;div&gt;</code> with class <code>addressograph-box</code>. The consumer supplies the identifying fields, layout, and any salient warning iconography as children.</p>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the addressograph-box box</li>\n<li><code>children</code>: slot (required) -- identifying content (name, DOB, identifier, notations)</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label</code> -- describes the box for screen readers (e.g., \"Patient identification\")</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display a single subject's identifying details together in a compact, scannable block.</li>\n<li>Use in clinical contexts to show patient identification alongside admission, ward, and salient alert information.</li>\n<li>Use in logistics or mail-handling contexts to show recipient details and tracking information together.</li>\n<li>Use when staff need to verify identity at a glance before performing an action.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>person</code> — a person component that contains other person-related information</li>\n<li><code>government-identifier</code> — an identifier section with a parent agency logo, agency name, and required government links</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"addressograph-box\" aria-label=\"Patient identification\"><p>Jane Doe</p><p>DOB: 1980-05-12</p><p>NHS: 943 476 5919</p></div>";
  const svelteSource: string = "// In your Svelte component:\nimport AddressographBox from \"lily-design-system-svelte-headless/components/AddressographBox/AddressographBox.svelte\";\n\n<AddressographBox label=\"Patient identification\">\n  <p>Jane Doe</p>\n</AddressographBox>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>AddressographBox — Lily Design System</title>
  <meta name="description" content="A box that shows a person's identification details, such as name, tracking information, and salient notations." />
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
