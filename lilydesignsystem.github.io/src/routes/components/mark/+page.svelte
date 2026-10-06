<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>Mark</h1>\n<p>A headless wrapper for an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The component renders the native <code>&lt;mark&gt;</code> element, which means &quot;highlighted for reference or relevance&quot; — a search match, a term the surrounding text refers to, or text flagged in a document. It adds no ARIA, draws nothing and carries no strings.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;mark class=&quot;mark {class}&quot;&gt;</code> containing the children</li>\n<li><code>restProps</code> spread onto the <code>&lt;mark&gt;</code>; no state, no behaviour</li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The highlighted text</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;mark&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;p&gt;Found 3 results for &lt;Mark&gt;accessible&lt;/Mark&gt; components.&lt;/p&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None. The element is not focusable.</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA is added; the native <code>&lt;mark&gt;</code> carries its own semantics</li>\n<li>Screen-reader support for <code>&lt;mark&gt;</code> varies, and many do not announce it; pass <code>aria-label</code> or <code>aria-roledescription</code> through the rest props if you want a spoken cue (the string is yours, so it stays localisable)</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Highlighting the term a user searched for inside a result</li>\n<li>Marking text a sentence refers to, so readers can find it again</li>\n<li>Flagging a passage in a document for reference or review</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>Code</code> — inline code rather than highlighted prose</li>\n<li>Use <code>Kbd</code> — keyboard keys</li>\n<li>Use <code>Badge</code> or <code>StatusTag</code> — a standalone label rather than text inside a sentence</li>\n<li>Use <code>InsetText</code> — a block-level callout rather than an inline highlight</li>\n<li>Use <code>Diff</code> — showing what changed between two texts</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only: the element and the class hook. It decides no colour, background, contrast or animation.</p>\n<h2>Styles</h2>\n<p>Target <code>.mark</code>. The browser default is a yellow background with black text; the 45 reference themes restyle it from tokens. No default styles are included in the component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders a <code>&lt;mark&gt;</code> with class <code>mark</code> and appends the consumer class</li>\n<li>Children render; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Do not rely on the highlight alone to convey meaning (WCAG 1.4.1): the highlighted words should make sense to someone who cannot see the colour, and keep the text-to-background contrast at or above the target level. Highlight the matched term, not the whole result.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>code</code></li>\n<li><code>kbd</code></li>\n<li><code>badge</code></li>\n<li><code>inset-text</code></li>\n<li><code>diff</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark\">MDN mark element</a></li>\n<li><a href=\"https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html\">WCAG 1.4.1 Use of Color</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<p>Found 3 results for <mark class=\"mark\">accessible</mark> components.</p>";
  const svelteSource: string = "// In your Svelte component:\nimport Mark from \"lily-design-system-svelte-headless/components/Mark/Mark.svelte\";\n\n<Mark>\n  <!-- content -->\n</Mark>\n";
  const usageCode: string = "<p>Found 3 results for <Mark>accessible</Mark> components.</p>\n";
  const variants: { title: string; html: string }[] = [{"title":"Several matches in one result","html":"<p>An <mark class=\"mark\">accessible</mark> design system makes <mark class=\"mark\">accessible</mark> components the default.</p>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Mark — Lily Design System</title>
  <meta name="description" content="A headless wrapper for an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element." />
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
    <summary style="cursor: pointer; font-weight: 600;">Show demo markup</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{demoHtml}</code></pre>
  </details>
  {#each variants as variant (variant.title)}
    <h3 style="margin-top: 1.5rem;">{variant.title}</h3>
    <div class="component-example-rendered" style="padding: 1rem; border: 1px solid #d8dde0; border-radius: 0.5rem; background: #ffffff;">{@html variant.html}</div>
    <details style="margin-top: 0.5rem;">
      <summary style="cursor: pointer; font-weight: 600;">Show markup</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{variant.html}</code></pre>
    </details>
  {/each}
  {#if usageCode}
    <details style="margin-top: 1.5rem;" open>
      <summary style="cursor: pointer; font-weight: 600;">Usage example</summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{usageCode}</code></pre>
    </details>
  {/if}
  <details style="margin-top: 1rem;">
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <pre tabindex="0" style="overflow-x: auto; padding: 1rem; color: #212b32; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/mark/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: mark</li>
      <li>PascalCase: Mark</li>
      <li>Description: an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;mark&gt;</li>
      <li>CSS class: .mark</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>None added; native <code>&lt;mark&gt;</code> semantics</li>
      <li>Consumers may pass <code>aria-label</code> / <code>aria-roledescription</code> through rest props for a spoken cue</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>children</code>: slot -- the highlighted text</li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;mark&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
