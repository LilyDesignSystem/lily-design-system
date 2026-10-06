<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>ToolCallStatus</h1>\n<p>A headless wrapper for the status of a tool call as a word, such as pending, running, done or error.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The status of a tool call as a visible word (pending, running, done, error), in the consumer&#39;s language. <code>status</code> only sets <code>data-status</code> for styling. The component draws, times and animates nothing and carries no strings of its own.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root element: <code>&lt;span&gt;</code> with the base class <code>tool-call-status</code> first, then the consumer class</li>\n<li><code>restProps</code> spread onto the root; no internal state beyond <code>open</code> on the root</li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>status</code></td>\n<td>string (optional)</td>\n<td>—</td>\n<td><code>pending</code>, <code>running</code>, <code>done</code> or <code>error</code>; sets <code>data-status</code></td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The visible status word</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;span&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;ToolCallStatus&gt;…&lt;/ToolCallStatus&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>No role: the status is plain text so it is read in order</li>\n<li><code>data-status</code> is for consumer CSS only</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Showing state as a word next to the tool name, so it never relies on colour alone</li>\n<li>Driving a consumer spinner or icon via <code>[data-status]</code></li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>StatusTag</code> — a general status label outside a tool call</li>\n<li>Use <code>Loading</code> or <code>ProgressSpinner</code> — indeterminate activity on its own</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.</p>\n<h2>Styles</h2>\n<p>Target <code>.tool-call-status</code> (and <code>[data-status]</code> where it applies). No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders <code>&lt;span&gt;</code> with the base class <code>tool-call-status</code> and appends the consumer class</li>\n<li>Attribute behaviour as listed under Props and ARIA, each asserted with a test</li>\n<li>Children render; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Keep the word and <code>status</code> in step. The component supplies no strings, so the word is always localised by the consumer.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>tool-call</code></li>\n<li><code>tool-call-name</code></li>\n<li><code>status-tag</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details\">MDN details element</a></li>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#alert\">WAI-ARIA alert role</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"tool-call-status\" data-status=\"running\">Running</span>";
  const svelteSource: string = "// In your Svelte component:\nimport ToolCallStatus from \"lily-design-system-svelte-headless/components/ToolCallStatus/ToolCallStatus.svelte\";\n\n<ToolCallStatus>\n  <!-- content -->\n</ToolCallStatus>\n";
  const usageCode: string = "<span class=\"tool-call-status\" data-status=\"running\">Running</span>\n";
  const variants: { title: string; html: string }[] = [{"title":"All four states, each as a word","html":"<span class=\"tool-call-status\" data-status=\"pending\">Pending</span> · <span class=\"tool-call-status\" data-status=\"running\">Running</span> · <span class=\"tool-call-status\" data-status=\"done\">Done</span> · <span class=\"tool-call-status\" data-status=\"error\">Failed</span>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ToolCallStatus — Lily Design System</title>
  <meta name="description" content="A headless wrapper for the status of a tool call as a word, such as pending, running, done or error." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/tool-call-status/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: tool-call-status</li>
      <li>PascalCase: ToolCallStatus</li>
      <li>Description: the status of a tool call as a word, such as pending, running, done or error</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .tool-call-status</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No role: the status is plain text so it is read in order</li>
      <li><code>data-status</code> is for consumer CSS only</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string -- Appended to the base class</li>
      <li><code>status</code>: string (optional) -- <code>pending</code>, <code>running</code>, <code>done</code> or <code>error</code>; sets <code>data-status</code></li>
      <li><code>children</code>: slot -- The visible status word</li>
      <li><code>...restProps</code>: HTML attributes -- Spread onto the root <code>&lt;span&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
