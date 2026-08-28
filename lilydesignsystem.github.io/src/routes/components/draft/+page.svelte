<script lang="ts">
  const html: string = "<h1>Draft</h1>\n\n<p>A draft is an early preliminary version of content such as an article, email, report, blog post, or document. The component wraps in-progress content so that authoring tools, reviewers, and downstream renderers can recognise it as not-yet-final and treat it accordingly (e.g., hide from public listings, render with a \"Draft\" badge, exclude from search, allow inline editing).</p>\n\n<p>This headless component renders a <code>&lt;div&gt;</code> with class <code>draft</code>. The consumer supplies the draft content as children. The component does not own save state, autosave, or revision history.</p>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the draft</li>\n<li><code>status</code>: string (optional) -- editorial state, exposed as <code>data-status</code> for consumer CSS/JS</li>\n<li><code>children</code>: slot (required) -- draft content</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label</code> -- describes the draft for screen readers when no visible heading is present</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to wrap in-progress content in an authoring or CMS context so downstream code can detect and treat draft state distinctly.</li>\n<li>Use to flag a section as preliminary so reviewers know it is open for comment or revision.</li>\n<li>Use to gate rendering of unfinished material in public listings, RSS feeds, or search indexes.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>question</code> — a question is anything that asks for information, invites a response, tests knowledge, etc.</li>\n<li><code>answer</code> — an answer is anything that responds to a question, request, action, etc.</li>\n<li><code>comment</code> — a comment is anything that expresses an opinion, observation, explanation, etc.</li>\n<li><code>editable</code> — an inline-editable text element that toggles between view and edit modes</li>\n<li><code>editable-form</code> — a form wrapper for inline editing of content</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"draft\" aria-label=\"Draft article\" data-status=\"in-progress\"><h3>Working title</h3><p>Opening paragraph still needs a hook.</p></div>";
  const svelteSource: string = "// In your Svelte component:\nimport Draft from \"lily-design-system-svelte-headless/components/Draft/Draft.svelte\";\n\n<Draft label=\"Draft article\" status=\"in-progress\">\n  <h1>Working title</h1>\n</Draft>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Draft — Lily Design System</title>
  <meta name="description" content="An early preliminary version of content such as an article, email, report, etc." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/draft/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: draft</li>
      <li>PascalCase: Draft</li>
      <li>Description: an early preliminary version of content such as an article, email, report, etc.</li>
      <li>Status: experimental — recent catalog addition with the least accumulated depth; contract may still move</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .draft</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-label</code> -- describes the draft for screen readers when no visible heading is present</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None -- drafts are content wrappers, not interactive</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (optional) -- accessible label for the draft</li>
      <li><code>status</code>: string (optional) -- editorial state, exposed as <code>data-status</code></li>
      <li><code>children</code>: slot (required) -- draft content</li>
      <li><code>...restProps</code>: Any additional HTML attributes</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
