<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>StreamingText</h1>\n<p>A headless wrapper for text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete. It is a polite, atomic status region that goes busy while text is still arriving.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The component renders a <code>&lt;div role=&quot;status&quot; aria-live=&quot;polite&quot; aria-atomic=&quot;true&quot;&gt;</code>. While <code>streaming</code> is true it is marked busy (<code>aria-busy=&quot;true&quot;</code>, <code>data-streaming=&quot;true&quot;</code>), so assistive technology waits rather than announcing every chunk. When <code>streaming</code> becomes false the finished text is announced once. The component never splits, times, reveals or animates the text: the consumer appends chunks to the children and owns any caret or reduced-motion CSS. Sources, citations, actions and follow-ups are deliberately out of scope.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;div class=&quot;streaming-text {class}&quot; role=&quot;status&quot; aria-live=&quot;polite&quot; aria-atomic=&quot;true&quot;&gt;</code> containing the children</li>\n<li><code>streaming</code> adds <code>aria-busy=&quot;true&quot;</code> and <code>data-streaming=&quot;true&quot;</code>; both are absent otherwise (never <code>&quot;false&quot;</code>)</li>\n<li><code>label</code> (optional) becomes <code>aria-label</code></li>\n<li><code>restProps</code> spread onto the root; no internal state, timers or drawing</li>\n</ul>\n<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>label</code></td>\n<td>string (optional)</td>\n<td>—</td>\n<td>Accessible name of the status region</td>\n</tr>\n<tr>\n<td><code>streaming</code></td>\n<td>boolean</td>\n<td><code>false</code></td>\n<td>True while chunks are still arriving</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The text so far</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;div&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;StreamingText label=&quot;Assistant answer&quot; streaming={isStreaming}&gt;\n  {answerSoFar}\n&lt;/StreamingText&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None. The region is not focusable and has no controls.</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;status&quot;</code> with <code>aria-live=&quot;polite&quot;</code> and <code>aria-atomic=&quot;true&quot;</code>: the whole text is announced once, politely</li>\n<li><code>aria-busy=&quot;true&quot;</code> while streaming asks assistive technology to hold announcements until the stream ends</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>An AI or assistant answer that arrives in chunks and should be announced once when complete</li>\n<li>Any text that grows over time (a long transcription, a progressively built summary) where per-chunk announcements would be noise</li>\n<li>When you want consumer CSS to show a caret or loading cue through <code>[data-streaming]</code></li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>Thinking</code> — a collapsible block for the agent&#39;s reasoning trace rather than the answer</li>\n<li>Use <code>ChatMessage</code> — a complete message in a conversation list</li>\n<li>Use <code>Loading</code> or <code>ProgressSpinner</code> — indeterminate activity with no text to announce</li>\n<li>Use <code>Notification</code> or <code>Toast</code> — a short alert that must interrupt rather than a growing body of text</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only: the live region, its politeness and the busy state. It decides no timing, word splitting, animation, caret or visual style.</p>\n<h2>Styles</h2>\n<p>Target <code>.streaming-text</code> and <code>.streaming-text[data-streaming]</code>. A caret is consumer CSS; if you add one with a pseudo-element, keep it decorative and respect <code>prefers-reduced-motion</code>. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> with class <code>streaming-text</code></li>\n<li>Is a <code>status</code> region with <code>aria-live=&quot;polite&quot;</code> and <code>aria-atomic=&quot;true&quot;</code></li>\n<li>Not busy by default; busy and <code>data-streaming</code> while <code>streaming</code>; cleared when it becomes false</li>\n<li><code>label</code> sets <code>aria-label</code> and is omitted when absent</li>\n<li>Children render; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Append chunks to the existing text rather than replacing the element, and flip <code>streaming</code> to false exactly once, after the last chunk, so the finished answer is announced a single time. Screen-reader support for <code>aria-busy</code> varies, so test with your target readers. Keep any typing animation in CSS and turn it off under <code>prefers-reduced-motion</code>.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>thinking</code></li>\n<li><code>chat-message</code></li>\n<li><code>loading</code></li>\n<li><code>progress-spinner</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://www.w3.org/TR/wai-aria-1.2/#status\">WAI-ARIA status role</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-busy\">MDN aria-busy</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live\">MDN aria-live</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"streaming-text\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" aria-label=\"Assistant answer\" aria-busy=\"true\" data-streaming=\"true\">The answer is arriv</div>";
  const svelteSource: string = "// In your Svelte component:\nimport StreamingText from \"lily-design-system-svelte-headless/components/StreamingText/StreamingText.svelte\";\n\n<StreamingText>\n  <!-- content -->\n</StreamingText>\n";
  const usageCode: string = "<script lang=\"ts\">\n    import StreamingText from \"./StreamingText.svelte\";\n<\/script>\n\n<StreamingText label=\"Assistant answer\" streaming={isStreaming}>\n    {answerSoFar}\n</StreamingText>\n";
  const variants: { title: string; html: string }[] = [{"title":"Streaming (busy: assistive technology waits)","html":"<div class=\"streaming-text\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" aria-label=\"Assistant answer\" aria-busy=\"true\" data-streaming=\"true\">Headless components decide meaning, not look and fe</div>"},{"title":"Complete (the finished text is announced once)","html":"<div class=\"streaming-text\" role=\"status\" aria-live=\"polite\" aria-atomic=\"true\" aria-label=\"Assistant answer\">Headless components decide meaning, not look and feel.</div>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>StreamingText — Lily Design System</title>
  <meta name="description" content="A headless wrapper for text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete. It is a polite, atomic status region that goes busy while text is still arriving." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/streaming-text/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: streaming-text</li>
      <li>PascalCase: StreamingText</li>
      <li>Description: text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .streaming-text</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="status"</code>, <code>aria-live="polite"</code>, <code>aria-atomic="true"</code></li>
      <li><code>aria-busy="true"</code> while streaming</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>label</code>: string (optional) -- accessible name</li>
      <li><code>streaming</code>: boolean (default: <code>false</code>) -- true while chunks are still arriving</li>
      <li><code>children</code>: slot -- the text so far</li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
