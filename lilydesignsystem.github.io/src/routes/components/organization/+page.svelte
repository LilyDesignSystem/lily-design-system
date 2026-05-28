<script lang="ts">
  const html: string = "<h1>Organization</h1>\n\n<p>An organization component displays information about an organization, such as its name, logo, description, and contact details. It is used in directories, profiles, and listings.</p>\n\n<p>This headless component uses an <code>&lt;article&gt;</code> element for self-contained organization content semantics.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Uses <code>&lt;article&gt;</code> element for self-contained organization semantics</li>\n<li><code>aria-label</code> describes the organization for screen readers</li>\n<li>Contains slots for name, logo, description, and contact information</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the organization</li>\n<li><code>children</code>: slot (required) -- organization content</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Organization label=\"St James's Hospital, Cardiology Department\"&gt;\n  &lt;Image src=\"/logos/stjames.png\" label=\"St James's Hospital logo\" /&gt;\n  &lt;h3&gt;St James's Hospital&lt;/h3&gt;\n  &lt;p&gt;Cardiology Department&lt;/p&gt;\n  &lt;address&gt;Beckett Way, Leeds LS9 7TF&lt;/address&gt;\n  &lt;TelLink href=\"tel:+441234567890\"&gt;0123 456 7890&lt;/TelLink&gt;\n  &lt;EmailLink href=\"mailto:info@stjames.nhs.uk\"&gt;info@stjames.nhs.uk&lt;/EmailLink&gt;\n&lt;/Organization&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;Organization label=\"Acme Software Ltd\"&gt;\n  &lt;h3&gt;Acme Software Ltd&lt;/h3&gt;\n  &lt;p&gt;Enterprise solutions for healthcare integration and interoperability.&lt;/p&gt;\n  &lt;a href=\"https://acme.example.com\"&gt;acme.example.com&lt;/a&gt;\n&lt;/Organization&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None -- organizations are informational, not interactive</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Implicit <code>article</code> role from <code>&lt;article&gt;</code> element</li>\n<li><code>aria-label</code> -- describes the organization for screen readers</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display organisation information such as a hospital, clinic, department, or company.</li>\n<li>Use when structured organisation data (name, logo, contact details) needs semantic grouping.</li>\n<li>Use for provider directories, partner listings, or department profiles.</li>\n<li>Use in combination with Image, EmailLink, and TelLink for rich organisation displays.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for people -- use Person instead.</li>\n<li>Do not use for locations without organisation context -- use Place instead.</li>\n<li>Do not use for plain text mentions of an organisation name -- use a paragraph or inline text.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This component provides an <code>&lt;article&gt;</code> element with optional <code>aria-label</code>, with zero visual styling. The consumer is responsible for all CSS including layout, logo placement, and typography.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with an <code>.organization</code> class for targeting. No default styles are included -- this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders an <code>&lt;article&gt;</code> element with class <code>organization</code></li>\n<li>Verify <code>aria-label</code> is applied when provided</li>\n<li>Verify child content is rendered correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Use consistent layouts across organization entries. Include logo, name, and key details prominently.</li>\n<li><strong>Developers</strong>: Use the <code>label</code> prop to identify the organization for screen readers.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>person</code> — a person component that contains other person-related information</li>\n<li><code>place</code> — a place component that contains other place-related information</li>\n<li><code>government-identifier</code> — an identifier section with a parent agency logo, agency name, and required government links</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article\">MDN article element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<article class=\"organization\"><h3>Lily Foundation</h3><p>A non-profit design organization.</p></article>";
  const svelteSource: string = "// In your Svelte component:\nimport Organization from \"lily-design-system-svelte-headless/components/Organization/Organization.svelte\";\n\n<Organization>\n  <!-- content -->\n</Organization>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Organization — Lily Design System</title>
  <meta name="description" content="An organization component displays information about an organization, such as its name, logo, description, and contact details. It is used in directories, profiles, and listings." />
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

