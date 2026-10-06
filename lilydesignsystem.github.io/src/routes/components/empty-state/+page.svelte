<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>EmptyState</h1>\n<p>EmptyState is a headless container for the state shown when a list, table, search or inbox has nothing to display. The consumer supplies the heading, explanation and call to action as children; the component adds only a labelled group when a <code>label</code> is given. It carries no icon and no default text.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> with the base class <code>empty-state</code></li>\n<li>When <code>label</code> is provided adds <code>role=&quot;group&quot;</code> and <code>aria-label={label}</code>; otherwise a plain <code>&lt;div&gt;</code></li>\n<li>Not a live region -- it does not announce itself</li>\n<li>Spreads <code>restProps</code> onto the root</li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>className</code>: string (default: <code>&quot;&quot;</code>) -- CSS class name appended to the base class</li>\n<li><code>label</code>: string (optional) -- accessible name; adds <code>role=&quot;group&quot;</code></li>\n<li><code>children</code>: slot -- heading, text and action supplied by the consumer</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the root</li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;EmptyState label=&quot;No messages&quot;&gt;\n  &lt;h2&gt;No messages yet&lt;/h2&gt;\n  &lt;p&gt;Messages you receive will appear here.&lt;/p&gt;\n  &lt;Button type=&quot;button&quot;&gt;Write a message&lt;/Button&gt;\n&lt;/EmptyState&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None. Any action inside is a native control with its own keyboard behaviour</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;group&quot;</code> and <code>aria-label={label}</code> -- only when <code>label</code> is provided</li>\n<li>No <code>aria-live</code>: use <code>info-state</code> (<code>role=&quot;status&quot;</code>) when the state must be announced</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use when a list, table, search or section has no content yet and the user needs to know why and what to do next.</li>\n<li>Use for first-run screens and cleared inboxes.</li>\n<li>Use when the message and action are composed from your own heading, text and button.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a result that must be announced after a user action -- use <code>info-state</code>.</li>\n<li>Do not use for loading -- use <code>loading</code> or <code>skeleton</code>.</li>\n<li>Do not use for errors -- use <code>error-summary</code> or <code>alert</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders a <code>&lt;div&gt;</code> and decides no visual treatment. There is no icon; the consumer supplies any illustration as children.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling via the <code>.empty-state</code> class.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the root is a <code>&lt;div&gt;</code> with class <code>empty-state</code></li>\n<li>Verify children render</li>\n<li>Verify no role or aria-label without <code>label</code></li>\n<li>Verify <code>label</code> yields a labelled group</li>\n<li>Verify it is not a live region</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Say what is missing, why, and the next step. Keep it calm; an empty state is not an error.</li>\n<li><strong>Developers</strong>: Choose a heading level that fits the page outline.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>info-state</code> — a status-announced info / empty / error / success panel</li>\n<li><code>loading</code> — an indeterminate busy indicator</li>\n<li><code>skeleton</code> — a placeholder for content in flight</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>NHS UK content style guide: <a href=\"https://service-manual.nhs.uk/content\">https://service-manual.nhs.uk/content</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"empty-state\" role=\"group\" aria-label=\"No results\"><h3>No results found</h3><p>Try a different search or clear your filters.</p><button type=\"button\">Clear filters</button></div>";
  const svelteSource: string = "// In your Svelte component:\nimport EmptyState from \"lily-design-system-svelte-headless/components/EmptyState/EmptyState.svelte\";\n\n<EmptyState>\n  <!-- content -->\n</EmptyState>\n";
  const usageCode: string = "<EmptyState label=\"No messages\">\n  <h2>No messages yet</h2>\n  <p>Messages you receive will appear here.</p>\n  <Button type=\"button\">Write a message</Button>\n</EmptyState>\n";
  const variants: { title: string; html: string }[] = [{"title":"Without an action","html":"<div class=\"empty-state\" role=\"group\" aria-label=\"No messages\"><h3>No messages yet</h3><p>New messages will appear here.</p></div>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>EmptyState — Lily Design System</title>
  <meta name="description" content="EmptyState is a headless container for the state shown when a list, table, search or inbox has nothing to display. The consumer supplies the heading, explanation and call to action as children; the component adds only a labelled group when a label is given. It carries no icon and no default text." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/empty-state/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: empty-state</li>
      <li>PascalCase: EmptyState</li>
      <li>Description: a container for the nothing-here-yet state of a list, table, search or inbox</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .empty-state</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="group"</code> and <code>aria-label=&#123;label&#125;</code> -- only when <code>label</code> is provided</li>
      <li>No <code>aria-live</code>: use <code>info-state</code> (<code>role="status"</code>) when the state must be announced</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None. Any action inside is a native control with its own keyboard behaviour</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>className</code>: string (default: <code>""</code>) -- CSS class name appended to the base class</li>
      <li><code>label</code>: string (optional) -- accessible name; adds <code>role="group"</code></li>
      <li><code>children</code>: slot -- heading, text and action supplied by the consumer</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
