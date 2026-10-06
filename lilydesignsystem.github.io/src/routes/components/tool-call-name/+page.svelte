<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>ToolCallName</h1>\n<p>A headless wrapper for the name of the tool in a tool call, shown in the summary.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The tool&#39;s name inside the summary, for example <code>search_web</code>. A plain <code>&lt;span&gt;</code>; the consumer supplies the text. The component draws, times and animates nothing and carries no strings of its own.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root element: <code>&lt;span&gt;</code> with the base class <code>tool-call-name</code> first, then the consumer class</li>\n<li><code>restProps</code> spread onto the root; no internal state beyond <code>open</code> on the root</li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The tool name</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;span&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;ToolCallName&gt;…&lt;/ToolCallName&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA attributes; the text is the name</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>The first item in a <code>ToolCall</code> summary</li>\n<li>Showing a machine name in a monospace style via consumer CSS</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>ToolCallStatus</code> — for the state word</li>\n<li>Use <code>Kbd</code> — for keyboard keys rather than tool names</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.</p>\n<h2>Styles</h2>\n<p>Target <code>.tool-call-name</code> (and <code>[data-status]</code> where it applies). No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders <code>&lt;span&gt;</code> with the base class <code>tool-call-name</code> and appends the consumer class</li>\n<li>Attribute behaviour as listed under Props and ARIA, each asserted with a test</li>\n<li>Children render; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Do not translate or alter the tool name: show what the system calls it.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>tool-call</code></li>\n<li><code>tool-call-status</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details\">MDN details element</a></li>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#alert\">WAI-ARIA alert role</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"tool-call-name\">search_web</span>";
  const svelteSource: string = "// In your Svelte component:\nimport ToolCallName from \"lily-design-system-svelte-headless/components/ToolCallName/ToolCallName.svelte\";\n\n<ToolCallName>\n  <!-- content -->\n</ToolCallName>\n";
  const usageCode: string = "<span class=\"tool-call-name\">search_web</span>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ToolCallName — Lily Design System</title>
  <meta name="description" content="A headless wrapper for the name of the tool in a tool call, shown in the summary." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/tool-call-name/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: tool-call-name</li>
      <li>PascalCase: ToolCallName</li>
      <li>Description: the name of the tool in a tool call, shown in the summary</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .tool-call-name</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No ARIA attributes; the text is the name</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string -- Appended to the base class</li>
      <li><code>children</code>: slot -- The tool name</li>
      <li><code>...restProps</code>: HTML attributes -- Spread onto the root <code>&lt;span&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
