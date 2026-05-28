<script lang="ts">
  const html: string = "<h1>StatusTag</h1>\n\n<p>A small inline label that names the current state of an item — \"Completed\", \"In review\", \"Cannot start yet\" — typically rendered next to a row in a list, a step in a workflow, or a heading on a detail page.</p>\n\n<p>The component is intentionally a static label, not a live region: it renders a <code>&lt;span&gt;</code> with the status text inside and a <code>tone</code> prop that the consumer maps to colour. Crucially, the meaning is always carried by the visible text — colour is reinforcement, never the only indicator. WCAG 1.4.1 (Use of Colour) requires this for users who can't perceive colour.</p>\n\n<p><code>StatusTag</code> does not announce changes. If the status updating during the user's session is meaningful (e.g. \"Awaiting review\" → \"Approved\"), wrap the tag in a <code>Notification</code> or <code>Alert</code> with <code>aria-live=\"polite\"</code>, or use <code>Toast</code> for a transient announcement. Use <code>Badge</code> for counts, <code>Tag</code> for non-status keyword labels.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;span&gt;</code> with the status text inside</li>\n<li>The semantics are conveyed by the visible text and (optionally) <code>aria-label</code> — colour alone is never the indicator</li>\n<li>Accepts a <code>tone</code> prop (e.g. <code>\"success\"</code>, <code>\"warning\"</code>, <code>\"danger\"</code>, <code>\"info\"</code>) which the consumer can use to drive class-based styling</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;span&gt;</code></li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>label</code></td><td>string (required)</td><td>—</td><td>Status text shown to users</td></tr>\n<tr><td><code>tone</code></td><td>\"neutral\"</td><td>\"success\"</td><td>\"warning\"</td><td>\"danger\"</td><td>\"info\"</td><td>\"neutral\"</td><td>Tone hint used by consumers to drive styling</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;span&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;StatusTag label=\"Completed\" tone=\"success\" /&gt;\n&lt;StatusTag label=\"Awaiting review\" tone=\"warning\" /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>No keyboard interactions — this is a passive label</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>role=\"status\"</code> is NOT applied by default — this component is a static label, not a live region</li>\n<li>Consumers wanting screen reader announcements when status changes should wrap the tag in a <code>Notification</code> or apply <code>aria-live=\"polite\"</code> themselves</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Showing the current state of a task, application, or item in a list or table</li>\n<li>Annotating rows in a data table or list with their workflow status</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>Badge</code> for counts (number of items, notifications)</li>\n<li>Use <code>Tag</code> for category labels that aren't specifically about status</li>\n<li>Use <code>Alert</code> or <code>Notification</code> when status changes need to be announced</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.status-tag</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>badge</code> — count or category label</li>\n<li><code>tag</code> — generic keyword tag</li>\n<li><code>flair</code> — decorative emphasis</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://design-system.service.gov.uk/components/tag/\">GOV.UK Tag pattern</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"status-tag\" aria-label=\"a tag showing the current status of a task\">StatusTag</div>";
  const svelteSource: string = "// In your Svelte component:\nimport StatusTag from \"lily-design-system-svelte-headless/components/StatusTag/StatusTag.svelte\";\n\n<StatusTag>\n  <!-- content -->\n</StatusTag>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>StatusTag — Lily Design System</title>
  <meta name="description" content="A small inline label that names the current state of an item — &quot;Completed&quot;, &quot;In review&quot;, &quot;Cannot start yet&quot; — typically rendered next to a row in a list, a step in a workflow, or a heading on a det..." />
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

