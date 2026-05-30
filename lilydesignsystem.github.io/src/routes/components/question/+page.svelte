<script lang="ts">
  const html: string = "<h1>Question</h1>\n\n<p>A question is anything that asks for information, invites a response, tests knowledge, etc. Examples include FAQ entries, quiz prompts, survey questions, forum questions, and interview questions.</p>\n\n<p>This headless component renders a <code>&lt;div&gt;</code> with class <code>question</code>. The consumer supplies the question text and any related content (answer slot, metadata, action buttons) as children.</p>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the question</li>\n<li><code>children</code>: slot (required) -- question content (heading, body, related answers, metadata)</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label</code> -- describes the question for screen readers when no visible heading is present</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use for FAQ entries that pair a question with one or more answers.</li>\n<li>Use for quiz, survey, or knowledge-check prompts.</li>\n<li>Use for forum-style threads where each thread starts with a question.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>answer</code> — an answer is anything that responds to a question, request, action, etc.</li>\n<li><code>comment</code> — a comment is anything that expresses an opinion, observation, explanation, etc.</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"question\" aria-label=\"Question\"><h3>What time does the clinic open?</h3></div>";
  const svelteSource: string = "// In your Svelte component:\nimport Question from \"lily-design-system-svelte-headless/components/Question/Question.svelte\";\n\n<Question>\n  <!-- content -->\n</Question>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Question — Lily Design System</title>
  <meta name="description" content="A question is anything that asks for information, invites a response, tests knowledge, etc." />
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
