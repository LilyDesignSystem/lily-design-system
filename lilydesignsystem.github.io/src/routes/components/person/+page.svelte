<script lang="ts">
  const html: string = "<h1>Person</h1>\n\n<p>A person component displays information about a person, such as their name, avatar, role, and contact details. It is used in team pages, directories, profiles, and user listings.</p>\n\n<p>This headless component uses an <code>&lt;article&gt;</code> element for self-contained person content semantics.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Uses <code>&lt;article&gt;</code> element for self-contained person semantics</li>\n<li><code>aria-label</code> describes the person for screen readers</li>\n<li>Contains slots for avatar, name, role, bio, and contact information</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the person</li>\n<li><code>children</code>: slot (required) -- person content</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Person label=\"Dr Sarah Chen, Consultant Cardiologist\"&gt;\n  &lt;AvatarImage src=\"/photos/sarah-chen.jpg\" label=\"Dr Sarah Chen\" /&gt;\n  &lt;h3&gt;Dr Sarah Chen&lt;/h3&gt;\n  &lt;p&gt;Consultant Cardiologist&lt;/p&gt;\n  &lt;p&gt;Cardiology Department, St James's Hospital&lt;/p&gt;\n  &lt;EmailLink href=\"mailto:s.chen@stjames.nhs.uk\"&gt;s.chen@stjames.nhs.uk&lt;/EmailLink&gt;\n  &lt;TelLink href=\"tel:+442071234567\"&gt;020 7123 4567&lt;/TelLink&gt;\n&lt;/Person&gt;</code></pre>\n\n<pre><code class=\"language-html\">&lt;Person label=\"Alex Morgan, Software Engineer\"&gt;\n  &lt;AvatarText&gt;AM&lt;/AvatarText&gt;\n  &lt;h3&gt;Alex Morgan&lt;/h3&gt;\n  &lt;p&gt;Software Engineer&lt;/p&gt;\n  &lt;p&gt;Building accessible design systems and component libraries.&lt;/p&gt;\n&lt;/Person&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None -- person components are informational, not interactive</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Implicit <code>article</code> role from <code>&lt;article&gt;</code> element</li>\n<li><code>aria-label</code> -- describes the person for screen readers</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display person-related information such as a patient, clinician, or contact.</li>\n<li>Use when structured person data (name, role, contact details) needs semantic grouping.</li>\n<li>Use for team member listings, staff directories, or user profile cards.</li>\n<li>Use when a person's information should be self-contained and reusable across contexts.</li>\n<li>Use in combination with Avatar, EmailLink, and TelLink for rich person displays.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for simple avatar display -- use Avatar instead.</li>\n<li>Do not use for organisations -- use Organization instead.</li>\n<li>Do not use for plain text mentions of a person's name -- use a paragraph or inline text.</li>\n<li>Do not use for user authentication status -- use a dedicated auth indicator.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This component provides an <code>&lt;article&gt;</code> element with optional <code>aria-label</code>, with zero visual styling. The consumer is responsible for all CSS including layout, avatar placement, and typography.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.person</code> class for targeting. No default styles are included -- this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders an <code>&lt;article&gt;</code> element with class <code>person</code></li>\n<li>Verify <code>aria-label</code> is applied when provided</li>\n<li>Verify child content is rendered correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Use consistent layouts across person entries. Include avatar, name, and role prominently.</li>\n<li><strong>Developers</strong>: Use the <code>label</code> prop to identify the person for screen readers.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>organization</code> — an organization component that contains other organization-related information</li>\n<li><code>place</code> — a place component that contains other place-related information</li>\n<li><code>avatar</code> — an avatar indicator that shows an avatar image or avatar text</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article\">MDN article element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<article class=\"person\"><h3>Jane Doe</h3><p>Lead Designer</p></article>";
  const svelteSource: string = "// In your Svelte component:\nimport Person from \"lily-design-system-svelte-headless/components/Person/Person.svelte\";\n\n<Person>\n  <!-- content -->\n</Person>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Person — Lily Design System</title>
  <meta name="description" content="A person component displays information about a person, such as their name, avatar, role, and contact details. It is used in team pages, directories, profiles, and user listings." />
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

