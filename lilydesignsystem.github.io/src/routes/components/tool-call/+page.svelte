<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>ToolCall</h1>\n<p>A headless wrapper for a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The root of a tool-call record: a native <code>&lt;details&gt;</code> closed by default. Put <code>ToolCallName</code> and <code>ToolCallStatus</code> in the summary and <code>ToolCallInput</code>, <code>ToolCallOutput</code> or <code>ToolCallError</code> in the body. The component draws, times and animates nothing and carries no strings of its own.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root element: <code>&lt;details&gt;</code> with the base class <code>tool-call</code> first, then the consumer class</li>\n<li><code>restProps</code> spread onto the root; no internal state beyond <code>open</code> on the root</li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>status</code></td>\n<td>string (optional)</td>\n<td>—</td>\n<td><code>pending</code>, <code>running</code>, <code>done</code> or <code>error</code>; sets <code>data-status</code>, and <code>aria-busy=&quot;true&quot;</code> only while running</td>\n</tr>\n<tr>\n<td><code>open</code></td>\n<td>boolean</td>\n<td><code>false</code></td>\n<td>Whether expanded (bindable / <code>v-model</code> / <code>@bind-Open</code> / <code>open</code> attribute)</td>\n</tr>\n<tr>\n<td><code>summary</code></td>\n<td>slot</td>\n<td>—</td>\n<td>Summary content: name and status words</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The body</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;details&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;ToolCall status=&quot;running&quot; bind:open&gt;\n  {#snippet summary()}\n    &lt;ToolCallName&gt;search_web&lt;/ToolCallName&gt;\n    &lt;ToolCallStatus status=&quot;running&quot;&gt;Running&lt;/ToolCallStatus&gt;\n  {/snippet}\n  &lt;ToolCallInput label=&quot;Input&quot;&gt;&lt;pre&gt;{&quot;query&quot;: &quot;weather&quot;}&lt;/pre&gt;&lt;/ToolCallInput&gt;\n&lt;/ToolCall&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Enter / Space on the native <code>&lt;summary&gt;</code> toggles</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>Native <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code> semantics; no ARIA role is added</li>\n<li><code>aria-busy=&quot;true&quot;</code> only while <code>status=&quot;running&quot;</code></li>\n<li><code>data-status</code> is for consumer CSS; the visible status word (in <code>ToolCallStatus</code>) carries the meaning, never colour alone</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>One tool invocation by an AI agent or workflow, with its status, input and result</li>\n<li>A transcript where tool details must not bury the conversation (collapsed by default)</li>\n<li>When status must read as a word, not only a colour or spinner</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>Thinking</code> — an agent&#39;s reasoning trace rather than a tool invocation</li>\n<li>Use <code>Expander</code> or <code>Collapsible</code> — generic disclosure with no tool semantics</li>\n<li>Use <code>ChatMessage</code> — a complete message in a conversation list</li>\n<li>Use <code>ErrorMessage</code> — a validation message tied to a form field</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.</p>\n<h2>Styles</h2>\n<p>Target <code>.tool-call</code> (and <code>[data-status]</code> where it applies). No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders <code>&lt;details&gt;</code> with the base class <code>tool-call</code> and appends the consumer class</li>\n<li>Attribute behaviour as listed under Props and ARIA, each asserted with a test</li>\n<li>Children render; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>The component never opens, times or animates itself. Open it yourself on error so <code>ToolCallError</code> (a <code>role=&quot;alert&quot;</code>) is reachable, and keep any spinner in CSS keyed on <code>[data-status=&quot;running&quot;]</code>, switched off under <code>prefers-reduced-motion</code>.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>tool-call-name</code></li>\n<li><code>tool-call-status</code></li>\n<li><code>tool-call-input</code></li>\n<li><code>tool-call-output</code></li>\n<li><code>tool-call-error</code></li>\n<li><code>thinking</code></li>\n<li><code>expander</code></li>\n<li><code>streaming-text</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details\">MDN details element</a></li>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#alert\">WAI-ARIA alert role</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<details class=\"tool-call\" data-status=\"done\" open><summary class=\"tool-call-summary\"><span class=\"tool-call-name\">search_web</span> <span class=\"tool-call-status\" data-status=\"done\">Done</span></summary><div class=\"tool-call-content\"><div class=\"tool-call-input\" role=\"group\" aria-label=\"Input\"><pre tabindex=\"0\">{\"query\": \"weather in London\"}</pre></div><div class=\"tool-call-output\" role=\"group\" aria-label=\"Output\"><pre tabindex=\"0\">12 degrees, light rain</pre></div></div></details>";
  const svelteSource: string = "// In your Svelte component:\nimport ToolCall from \"lily-design-system-svelte-headless/components/ToolCall/ToolCall.svelte\";\n\n<ToolCall>\n  <!-- content -->\n</ToolCall>\n";
  const usageCode: string = "<ToolCall status=\"running\" bind:open>\n  {#snippet summary()}\n    <ToolCallName>search_web</ToolCallName>\n    <ToolCallStatus status=\"running\">Running</ToolCallStatus>\n  {/snippet}\n  <ToolCallInput label=\"Input\"><pre>{\"query\": \"weather\"}</pre></ToolCallInput>\n</ToolCall>\n";
  const variants: { title: string; html: string }[] = [{"title":"Pending (closed)","html":"<details class=\"tool-call\" data-status=\"pending\"><summary class=\"tool-call-summary\"><span class=\"tool-call-name\">search_web</span> <span class=\"tool-call-status\" data-status=\"pending\">Pending</span></summary><div class=\"tool-call-content\"><div class=\"tool-call-input\" role=\"group\" aria-label=\"Input\"><pre tabindex=\"0\">{\"query\": \"weather in London\"}</pre></div></div></details>"},{"title":"Running (busy)","html":"<details class=\"tool-call\" data-status=\"running\" aria-busy=\"true\" open><summary class=\"tool-call-summary\"><span class=\"tool-call-name\">search_web</span> <span class=\"tool-call-status\" data-status=\"running\">Running</span></summary><div class=\"tool-call-content\"><div class=\"tool-call-input\" role=\"group\" aria-label=\"Input\"><pre tabindex=\"0\">{\"query\": \"weather in London\"}</pre></div></div></details>"},{"title":"Error (open, with the alert)","html":"<details class=\"tool-call\" data-status=\"error\" open><summary class=\"tool-call-summary\"><span class=\"tool-call-name\">search_web</span> <span class=\"tool-call-status\" data-status=\"error\">Failed</span></summary><div class=\"tool-call-content\"><div class=\"tool-call-error\" role=\"alert\">The tool timed out after 30 seconds.</div></div></details>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ToolCall — Lily Design System</title>
  <meta name="description" content="A headless wrapper for a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/tool-call/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: tool-call</li>
      <li>PascalCase: ToolCall</li>
      <li>Description: a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;details&gt;</li>
      <li>CSS class: .tool-call</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>Native <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code> semantics; no ARIA role is added</li>
      <li><code>aria-busy="true"</code> only while <code>status="running"</code></li>
      <li><code>data-status</code> is for consumer CSS; the visible status word (in <code>ToolCallStatus</code>) carries the meaning, never colour alone</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Enter / Space on the native <code>&lt;summary&gt;</code> toggles</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string -- Appended to the base class</li>
      <li><code>status</code>: string (optional) -- <code>pending</code>, <code>running</code>, <code>done</code> or <code>error</code>; sets <code>data-status</code>, and <code>aria-busy="true"</code> only while running</li>
      <li><code>open</code>: boolean -- Whether expanded (bindable / <code>v-model</code> / <code>@bind-Open</code> / <code>open</code> attribute)</li>
      <li><code>summary</code>: slot -- Summary content: name and status words</li>
      <li><code>children</code>: slot -- The body</li>
      <li><code>...restProps</code>: HTML attributes -- Spread onto the root <code>&lt;details&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
