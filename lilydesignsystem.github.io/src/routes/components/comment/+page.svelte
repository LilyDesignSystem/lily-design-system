<script lang="ts">
  const html: string = "<h1>Comment</h1>\n\n<p>A comment displays user discussions and user feedback, typically including the author's name, avatar, timestamp, and the comment text. Comments are used in discussion threads, review sections, and feedback areas.</p>\n\n<p>This headless component uses an <code>&lt;article&gt;</code> element for self-contained content semantics, with appropriate ARIA attributes for author and timestamp metadata.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Uses <code>&lt;article&gt;</code> element for self-contained comment semantics</li>\n<li><code>aria-label</code> describes the comment (e.g., \"Comment by Jane Doe\")</li>\n<li>Contains slots for avatar, author name, timestamp, and body content</li>\n<li>Supports nested replies through recursive composition</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- accessible label for the comment</li>\n<li><code>children</code>: slot (required) -- comment content including avatar, author, time, and body</li>\n<li><code>...restProps</code>: Any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;Comment label=\"Comment by Jane Doe\"&gt;\n  &lt;Avatar&gt;JD&lt;/Avatar&gt;\n  &lt;span&gt;Jane Doe&lt;/span&gt;\n  &lt;time datetime=\"2025-01-15\"&gt;January 15, 2025&lt;/time&gt;\n  &lt;p&gt;This is a great article! Thanks for sharing.&lt;/p&gt;\n&lt;/Comment&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None -- comments are informational, not interactive</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Implicit <code>article</code> role from <code>&lt;article&gt;</code> element</li>\n<li><code>aria-label</code> -- describes the comment for screen readers</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display user discussions and feedback on content, such as clinical notes, patient feedback, or article comments.</li>\n<li>Use when each comment includes author, timestamp, and content.</li>\n<li>Use for threaded reply structures via recursive composition of nested Comment components.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for real-time chat messages -- use ChatMessage instead.</li>\n<li>Do not use for system log entries or event history -- use TimelineList.</li>\n<li>Do not use for system-generated messages or alerts -- use Notification or Alert.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This component provides an <code>&lt;article&gt;</code> element with optional <code>aria-label</code> for accessible comment identification, with zero visual styling. The consumer is responsible for all CSS including layout, avatar positioning, author name styling, timestamp formatting, and thread indentation for replies.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.comment</code> class for targeting. No default styles are included -- this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders an <code>&lt;article&gt;</code> element with class <code>comment</code></li>\n<li>Verify <code>aria-label</code> is applied when provided</li>\n<li>Verify child content slots are rendered correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Clearly distinguish comment author, timestamp, and body text. Use indentation or threading to show reply hierarchies. Provide visual separation between comments.</li>\n<li><strong>Developers</strong>: Use the <code>label</code> prop to identify the comment author for screen readers. Nest Comment components for threaded reply structures.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>chat-message</code> — a chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc.</li>\n<li><code>blockquote</code> — a block-level quotation with optional source citation</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article\">MDN article element</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<article class=\"comment\"><header>Jane Doe \u2014 <time>2 hours ago</time></header><p>Great work on this!</p></article>";
  const svelteSource: string = "// In your Svelte component:\nimport Comment from \"lily-design-system-svelte-headless/components/Comment/Comment.svelte\";\n\n<Comment>\n  <!-- content -->\n</Comment>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Comment — Lily Design System</title>
  <meta name="description" content="A comment displays user discussions and user feedback, typically including the author's name, avatar, timestamp, and the comment text. Comments are used in discussion threads, review sections, and ..." />
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

