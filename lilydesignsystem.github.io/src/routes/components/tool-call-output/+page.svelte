<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>ToolCallOutput</h1>\n<p>A headless wrapper for the output or result returned by a tool in a tool call.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The output or result returned by the tool. A <code>&lt;div&gt;</code> that becomes a named group when <code>label</code> is given. The component draws, times and animates nothing and carries no strings of its own.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root element: <code>&lt;div&gt;</code> with the base class <code>tool-call-output</code> first, then the consumer class</li>\n<li><code>restProps</code> spread onto the root; no internal state beyond <code>open</code> on the root</li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>label</code></td>\n<td>string (optional)</td>\n<td>—</td>\n<td>Adds <code>role=&quot;group&quot;</code> and <code>aria-label</code>; without it neither is rendered</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The result</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;div&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;ToolCallOutput&gt;…&lt;/ToolCallOutput&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None. If a long <code>&lt;pre&gt;</code> inside scrolls, give it <code>tabindex=&quot;0&quot;</code></li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;group&quot;</code> with <code>aria-label</code> only when <code>label</code> is given</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>The result a tool returned</li>\n<li>Labelled sections so input and output are distinguishable</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>ToolCallError</code> — when the tool failed</li>\n<li>Use <code>ToolCallInput</code> — for the arguments</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.</p>\n<h2>Styles</h2>\n<p>Target <code>.tool-call-output</code> (and <code>[data-status]</code> where it applies). No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders <code>&lt;div&gt;</code> with the base class <code>tool-call-output</code> and appends the consumer class</li>\n<li>Attribute behaviour as listed under Props and ARIA, each asserted with a test</li>\n<li>Children render; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Show the result as returned; summarise only if the full result is also available.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>tool-call</code></li>\n<li><code>tool-call-input</code></li>\n<li><code>tool-call-error</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details\">MDN details element</a></li>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#alert\">WAI-ARIA alert role</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"tool-call-output\" role=\"group\" aria-label=\"Output\"><pre tabindex=\"0\">12 degrees, light rain</pre></div>";
  const svelteSource: string = "// In your Svelte component:\nimport ToolCallOutput from \"lily-design-system-svelte-headless/components/ToolCallOutput/ToolCallOutput.svelte\";\n\n<ToolCallOutput>\n  <!-- content -->\n</ToolCallOutput>\n";
  const usageCode: string = "<div class=\"tool-call-output\" role=\"group\" aria-label=\"Output\"><pre tabindex=\"0\">12 degrees, light rain</pre></div>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ToolCallOutput — Lily Design System</title>
  <meta name="description" content="A headless wrapper for the output or result returned by a tool in a tool call." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/tool-call-output/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: tool-call-output</li>
      <li>PascalCase: ToolCallOutput</li>
      <li>Description: the output or result returned by a tool in a tool call</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .tool-call-output</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="group"</code> with <code>aria-label</code> only when <code>label</code> is given</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None. If a long <code>&lt;pre&gt;</code> inside scrolls, give it <code>tabindex="0"</code></li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string -- Appended to the base class</li>
      <li><code>label</code>: string (optional) -- Adds <code>role="group"</code> and <code>aria-label</code>; without it neither is rendered</li>
      <li><code>children</code>: slot -- The result</li>
      <li><code>...restProps</code>: HTML attributes -- Spread onto the root <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
