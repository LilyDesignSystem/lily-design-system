<script lang="ts">
  const html: string = "<h1>Comment</h1>\n\n<p>A comment is anything that expresses an opinion, observation, explanation, etc. Examples include user discussion replies, peer review remarks, marginalia, code review notes, and editor annotations.</p>\n\n<p>This headless component renders a <code>&lt;div&gt;</code> with class <code>comment</code>. The consumer supplies the comment body and any related metadata (author, timestamp, action buttons) as children.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Uses <code>&lt;div&gt;</code> element with class <code>comment</code></li>\n<li><code>aria-label</code> describes the comment for assistive technology (e.g., \"Comment by Jane Doe\")</li>\n<li>Contains slots for avatar, author name, timestamp, and body content</li>\n<li>Supports nested replies through recursive composition</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the comment</li>\n<li><code>children</code>: slot (required) -- comment content including avatar, author, time, and body</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Comment label=\"Comment by Jane Doe\"&gt;\n  &lt;Avatar&gt;JD&lt;/Avatar&gt;\n  &lt;span&gt;Jane Doe&lt;/span&gt;\n  &lt;time datetime=\"2025-01-15\"&gt;January 15, 2025&lt;/time&gt;\n  &lt;p&gt;Great work on this!&lt;/p&gt;\n&lt;/Comment&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None -- comments are informational, not interactive</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label</code> -- describes the comment for screen readers</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display opinions, observations, or explanations from a user or contributor.</li>\n<li>Use when each comment includes author, timestamp, and content.</li>\n<li>Use for threaded reply structures via recursive composition of nested Comment components.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for real-time chat messages -- use ChatMessage instead.</li>\n<li>Do not use for system log entries or event history -- use TimelineList.</li>\n<li>Do not use for system-generated messages or alerts -- use Notification or Alert.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>question</code> — a question is anything that asks for information, invites a response, tests knowledge, etc.</li>\n<li><code>answer</code> — an answer is anything that responds to a question, request, action, etc.</li>\n<li><code>chat-message</code> — a chat message shows one chat conversation message entry</li>\n<li><code>blockquote</code> — a block-level quotation with optional source citation</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"comment\" aria-label=\"Comment by Jane Doe\"><header>Jane Doe \u2014 <time>2 hours ago</time></header><p>Great work on this!</p></div>";
  const svelteSource: string = "// In your Svelte component:\nimport Comment from \"lily-design-system-svelte-headless/components/Comment/Comment.svelte\";\n\n<Comment>\n  <!-- content -->\n</Comment>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Comment — Lily Design System</title>
  <meta name="description" content="A comment is anything that expresses an opinion, observation, explanation, etc." />
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
