<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>Thinking</h1>\n<p>Thinking is a headless disclosure for showing an AI assistant&#39;s reasoning or progress trace. It is a native <code>&lt;details&gt;</code> that is closed by default; while the trace is still arriving, <code>streaming</code> marks the root with <code>data-streaming</code> and <code>aria-busy</code> so consumer CSS and assistive technology know it is incomplete.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;details class=&quot;thinking&quot;&gt;</code> with <code>&lt;summary class=&quot;thinking-summary&quot;&gt;{label}&lt;/summary&gt;</code> and <code>&lt;div class=&quot;thinking-content&quot;&gt;</code></li>\n<li>Closed by default; <code>open</code> is bindable</li>\n<li><code>streaming</code> true adds <code>data-streaming=&quot;true&quot;</code> and <code>aria-busy=&quot;true&quot;</code>; false omits both attributes</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;details&gt;</code></li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>className</code>: string (default: <code>&quot;&quot;</code>) -- CSS class name appended to the base class</li>\n<li><code>label</code>: string (required) -- summary text</li>\n<li><code>open</code>: boolean (default: <code>false</code>) -- bindable</li>\n<li><code>streaming</code>: boolean (default: <code>false</code>) -- content is still arriving</li>\n<li><code>children</code>: slot -- the reasoning content</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;details&gt;</code></li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Thinking label=&quot;Thinking&quot; streaming={isStreaming} bind:open&gt;\n  &lt;p&gt;Considering the options...&lt;/p&gt;\n&lt;/Thinking&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Enter: toggles when the summary has focus (native)</li>\n<li>Space: toggles when the summary has focus (native)</li>\n<li>Tab: moves focus to / from the summary</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>Native <code>details</code>/<code>summary</code> disclosure semantics</li>\n<li><code>aria-busy=&quot;true&quot;</code> on the root only while <code>streaming</code></li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to reveal an assistant&#39;s reasoning without crowding the answer.</li>\n<li>Use when the trace may still be arriving and should be flagged as busy.</li>\n<li>Use when the reasoning is optional reading for most users.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for general supplementary help -- use <code>details</code>.</li>\n<li>Do not use for a custom-controlled toggle -- use <code>expander</code>.</li>\n<li>Do not use for the answer itself -- keep the answer visible.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders native <code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code>. It decides no marker, animation or streaming indicator; those are consumer CSS keyed on <code>[open]</code> and <code>[data-streaming]</code>.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling via <code>.thinking</code>, <code>.thinking-summary</code>, <code>.thinking-content</code> and <code>[data-streaming]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify root <code>&lt;details class=&quot;thinking&quot;&gt;</code> with <code>summary.thinking-summary</code></li>\n<li>Verify closed by default and <code>open</code> opens it</li>\n<li>Verify children render in <code>.thinking-content</code></li>\n<li>Verify clicking the summary toggles</li>\n<li>Verify <code>streaming</code> sets and clears <code>data-streaming</code> / <code>aria-busy</code></li>\n<li>Verify pass-through attributes</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Show a subtle in-progress cue while <code>data-streaming</code> is set; respect reduced motion.</li>\n<li><strong>Developers</strong>: Set <code>streaming</code> false when the stream ends so <code>aria-busy</code> is cleared.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>details</code> — a general native disclosure</li>\n<li><code>collapsible</code> — a native-details panel with a summary prop</li>\n<li><code>expander</code> — a button-driven disclosure</li>\n<li><code>loading</code> — a busy indicator</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>MDN details element: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details</a></li>\n<li>WAI-ARIA Disclosure Pattern: <a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/\">https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<details class=\"thinking\"><summary class=\"thinking-summary\">Thinking</summary><div class=\"thinking-content\">Comparing the two options, then checking the constraints before answering.</div></details>";
  const svelteSource: string = "// In your Svelte component:\nimport Thinking from \"lily-design-system-svelte-headless/components/Thinking/Thinking.svelte\";\n\n<Thinking>\n  <!-- content -->\n</Thinking>\n";
  const usageCode: string = "<Thinking label=\"Thinking\" streaming={isStreaming} bind:open>\n  <p>Considering the options...</p>\n</Thinking>\n";
  const variants: { title: string; html: string }[] = [{"title":"Open","html":"<details class=\"thinking\" open><summary class=\"thinking-summary\">Thinking</summary><div class=\"thinking-content\">Comparing the two options, then checking the constraints before answering.</div></details>"},{"title":"Streaming (busy)","html":"<details class=\"thinking\" open data-streaming=\"true\" aria-busy=\"true\"><summary class=\"thinking-summary\">Thinking</summary><div class=\"thinking-content\">Comparing the two opt</div></details>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Thinking — Lily Design System</title>
  <meta name="description" content="Thinking is a headless disclosure for showing an AI assistant's reasoning or progress trace. It is a native &lt;details&gt; that is closed by default; while the trace is still arriving, streaming marks the root with data-streaming and aria-busy so consumer CSS and assistive technology know it is incomp…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/thinking/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: thinking</li>
      <li>PascalCase: Thinking</li>
      <li>Description: a closed-by-default disclosure for an assistant's reasoning, with a streaming state</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</li>
      <li>HTML tag: &lt;details&gt;</li>
      <li>CSS class: .thinking</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>Native <code>details</code>/<code>summary</code> disclosure semantics</li>
      <li><code>aria-busy="true"</code> on the root only while <code>streaming</code></li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Enter: toggles when the summary has focus (native)</li>
      <li>Space: toggles when the summary has focus (native)</li>
      <li>Tab: moves focus to / from the summary</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>className</code>: string (default: <code>""</code>) -- CSS class name appended to the base class</li>
      <li><code>label</code>: string (required) -- summary text</li>
      <li><code>open</code>: boolean (default: <code>false</code>) -- bindable</li>
      <li><code>streaming</code>: boolean (default: <code>false</code>) -- content is still arriving</li>
      <li><code>children</code>: slot -- the reasoning content</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;details&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
