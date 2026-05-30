<script lang="ts">
  const html: string = "<h1>Answer</h1>\n\n<p>An answer is anything that responds to a question, request, action, etc. Examples include FAQ replies, quiz answers, survey responses, and forum replies.</p>\n\n<p>This headless component renders a <code>&lt;div&gt;</code> with class <code>answer</code>. The consumer supplies the answer content as children.</p>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the answer</li>\n<li><code>children</code>: slot (required) -- answer content (body, citations, related links, action buttons)</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label</code> -- describes the answer for screen readers when no visible heading is present</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to pair with a <code>question</code> for FAQ and Q&amp;A patterns.</li>\n<li>Use for quiz answer reveals or feedback panels.</li>\n<li>Use for forum replies displayed beneath the original question.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>question</code> — a question is anything that asks for information, invites a response, tests knowledge, etc.</li>\n<li><code>comment</code> — a comment is anything that expresses an opinion, observation, explanation, etc.</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"answer\" aria-label=\"Answer\"><p>The clinic opens at 8:00 a.m. on weekdays.</p></div>";
  const svelteSource: string = "// In your Svelte component:\nimport Answer from \"lily-design-system-svelte-headless/components/Answer/Answer.svelte\";\n\n<Answer>\n  <!-- content -->\n</Answer>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Answer — Lily Design System</title>
  <meta name="description" content="An answer is anything that responds to a question, request, action, etc." />
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
