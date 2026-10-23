<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>MiddleTruncation</h1>\n<p>A string shortened in the middle to fit the width its container gives it, keeping the start and the end: <code>quarterly-rep…final-3.pdf</code>. Use it for file names, URLs, identifiers, hashes and e-mail addresses, where the end carries as much meaning as the start and a trailing ellipsis would cut off the part that matters.</p>\n<p><strong>Status:</strong> experimental — implemented and unit-tested in all nine headless catalogs (2026-10-23). Blazor, Nunjucks and plain HTML differ in how they measure; see &quot;Per-library notes&quot;.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;MiddleTruncation text=&quot;quarterly-report-final-version-3.pdf&quot; ellipsis=&quot;…&quot; strategy=&quot;min-end&quot; end={6} /&gt;\n</code></pre>\n<pre tabindex=\"0\"><code class=\"language-css\">/* consumer CSS */\n.middle-truncation { display: block; overflow: hidden; white-space: nowrap; }\n.middle-truncation-full {\n  position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap;\n}\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>text</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>The full text</td>\n</tr>\n<tr>\n<td><code>ellipsis</code></td>\n<td>string (required)</td>\n<td>—</td>\n<td>The cut marker. No default: the headless layer ships no text, and the marker differs by language and context</td>\n</tr>\n<tr>\n<td><code>strategy</code></td>\n<td><code>&quot;even&quot;</code> | <code>&quot;fixed-end&quot;</code> | <code>&quot;min-end&quot;</code></td>\n<td><code>&quot;even&quot;</code></td>\n<td>How the room is shared</td>\n</tr>\n<tr>\n<td><code>end</code></td>\n<td>number</td>\n<td>—</td>\n<td>Characters kept at the end for <code>fixed-end</code> and <code>min-end</code></td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;span&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Per-library notes</h2>\n<ul>\n<li><strong>Svelte, React, Vue, Angular, Web Components, Alpine</strong> measure in the browser exactly as described above; each carries a copy of <code>shared/middle-truncation.ts</code> (the Alpine copy is the same module with its types stripped). Angular has no rest-props spread; Web Components take <code>text</code>, <code>ellipsis</code>, <code>strategy</code> and <code>end</code> as attributes.</li>\n<li><strong>HTML</strong>: the snippet&#39;s <code>&lt;script&gt;</code> finds every <code>.middle-truncation</code>, reads the full text from <code>.middle-truncation-full</code> and <code>data-ellipsis</code> / <code>data-strategy</code> / <code>data-end</code>, and measures in the browser. The algorithm inside the script is generated from the shared module between its <code>BEGIN</code>/<code>END</code> markers.</li>\n<li><strong>Nunjucks</strong>: a server cannot measure, so the macro renders the markup and data attributes only (the HTML script, or the Web Components element, then shortens in the browser); <code>shortened</code> takes text computed on the server.</li>\n<li><strong>Blazor</strong>: no JS interop, so no pixel measuring. <code>MaxCharacters</code> is a budget of user-perceived characters, ellipsis included, and the same strategies apply; without it the full text is shown.</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None. The component is not interactive.</p>\n<h2>ARIA</h2>\n<ul>\n<li>The shortened string is <code>aria-hidden=&quot;true&quot;</code>; assistive technology, find-in-page and copy get the full text from <code>.middle-truncation-full</code></li>\n<li>No role and no <code>aria-label</code>; the text is the content</li>\n<li>A <code>title</code> attribute is not used: it reaches hovering pointers only, not keyboard, touch or screen-reader users</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>A file name, URL, hash, identifier or e-mail address in a bounded space where the end matters as much as the start</li>\n<li>A table cell or list row of unpredictable text length that must stay on one line</li>\n<li>When the full text must stay reachable by screen readers and copy</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use CSS <code>text-overflow: ellipsis</code> — when cutting the end is fine and no JavaScript is wanted</li>\n<li>Use <code>Tooltip</code> or <code>HoverCard</code> — when the full text should appear on demand; combine with this component, do not replace it</li>\n<li>Use a wrapped or multi-line layout — when the text can simply take more room</li>\n<li>Do not use it for prose: a sentence cut in the middle is unreadable</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides the text and its structure only: which characters stay, and that the full text remains in the accessibility tree. It decides no width, font, colour or hiding; the consumer&#39;s CSS supplies the bounded block and the visually hidden full text.</p>\n<h2>Styles</h2>\n<p>The 57 reference themes style <code>.middle-truncation</code> as a bounded one-line block and hide <code>.middle-truncation-full</code> with the clip-rect pattern. In your own CSS, target <code>.middle-truncation</code> (the bounded block), <code>.middle-truncation-visual</code> and <code>.middle-truncation-full</code> (visually hide this one, never <code>display: none</code>). <code>[data-truncated]</code> styles the shortened state, and <code>[data-strategy]</code> the strategy. No default styles are included.</p>\n<h2>Testing</h2>\n<ul>\n<li>Base class first, then the consumer class</li>\n<li>The visual text is shortened to the measured width and re-measured on resize, changing only the visual string</li>\n<li>The shortened text is <code>aria-hidden</code>; the full text is not</li>\n<li>Each strategy keeps the right characters; <code>end</code> of 0 keeps none; a width below the ellipsis still returns the ellipsis</li>\n<li>Grapheme clusters are never split</li>\n<li>Full text when it fits or when there is no layout width</li>\n<li>Rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<p>Pass the ellipsis in the reader&#39;s language and writing system (<code>…</code> is not right everywhere). For a file name, <code>min-end</code> with <code>end</code> set to the extension plus a few characters keeps <code>.pdf</code> readable. Measure in the font actually used: load web fonts first, or the width is measured in a fallback and the result is a little off until the next resize.</p>\n<p>The measure uses the root&#39;s own font, so do not put a different font on the inner spans.</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;span class=&quot;middle-truncation {class}&quot; data-strategy&gt;</code> holding <code>.middle-truncation-visual</code> (<code>aria-hidden=&quot;true&quot;</code>, the shortened string) and <code>.middle-truncation-full</code> (the whole text)</li>\n<li>The width is measured in the browser with canvas text metrics in the root&#39;s computed font and compared with the root&#39;s <code>clientWidth</code>; a <code>ResizeObserver</code> re-measures (at most once per animation frame)</li>\n<li>Until measured, on the server, and when the root has no layout width, the full text is shown, so nothing is lost without JavaScript</li>\n<li>Cuts on grapheme clusters (<code>Intl.Segmenter</code>, falling back to code points), never inside a surrogate pair or an emoji sequence</li>\n<li><code>data-truncated</code> is present while the text is shortened</li>\n<li>The algorithm is the pure <code>truncateMiddle()</code> in <code>shared/middle-truncation.ts</code>; it takes the measuring function as an argument, so it is tested without a browser</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>tooltip</code></li>\n<li><code>hover-card</code></li>\n<li><code>clipboard-copy-button</code> — copy the full value</li>\n<li><code>code</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter\">MDN: Intl.Segmenter</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText\">MDN: CanvasRenderingContext2D.measureText()</a></li>\n<li><a href=\"https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html\">WCAG 1.4.4 Resize Text</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<span class=\"middle-truncation\" data-strategy=\"min-end\" data-truncated><span class=\"middle-truncation-visual\" aria-hidden=\"true\">quarterly-rep…ion-3.pdf</span><span class=\"middle-truncation-full\">quarterly-report-final-version-3.pdf</span></span>";
  const svelteSource: string = "// In your Svelte component:\nimport MiddleTruncation from \"lily-design-system-svelte-headless/components/MiddleTruncation/MiddleTruncation.svelte\";\n\n<MiddleTruncation>\n  <!-- content -->\n</MiddleTruncation>\n";
  const usageCode: string = "<MiddleTruncation text=\"quarterly-report-final-version-3.pdf\" ellipsis=\"…\" strategy=\"min-end\" end={6} />\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>MiddleTruncation — Lily Design System</title>
  <meta name="description" content="A string shortened in the middle to fit the width its container gives it, keeping the start and the end: quarterly-rep…final-3.pdf. Use it for file names, URLs, identifiers, hashes and e-mail addresses, where the end carries as much meaning as the start and a trailing ellipsis would cut off the p…" />
</svelte:head>

<article class="component-page component-page-intro prose" style="max-width: 64rem; margin: 0 auto; padding: 0.5rem 1rem 1rem;">
  {@html intro}
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

{#if usage}
<article class="component-page component-page-usage prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  {@html usage}
</article>
{/if}

<article class="component-page prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  {@html rest}
</article>

<!-- BEGIN generated: canonical contract (bin/generate-api-docs) -->
<section class="component-contract prose" aria-labelledby="contract-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2 id="contract-heading">Canonical contract</h2>
  <p>
    Generated from this component's
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/middle-truncation/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: middle-truncation</li>
      <li>PascalCase: MiddleTruncation</li>
      <li>Description: a string shortened in the middle to fit its width, keeping the start and the end</li>
      <li>Status: experimental — implemented and tested in all nine headless catalogs (2026-10-23); Blazor (<code>MaxCharacters</code>), Nunjucks and HTML measure differently, see index.md</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .middle-truncation</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>The shortened string is <code>aria-hidden="true"</code>; the full text in <code>.middle-truncation-full</code> is what assistive technology, find-in-page and copy receive</li>
      <li>No role and no <code>aria-label</code>: the text content is the accessible content (a <code>title</code> attribute would reach hovering pointers only)</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>text</code>: string (required) -- the full text</li>
      <li><code>ellipsis</code>: string (required) -- the cut marker; no default, the headless layer ships no text</li>
      <li><code>strategy</code>: <code>"even" | "fixed-end" | "min-end"</code> (default: <code>"even"</code>)</li>
      <li><code>end</code>: number (optional) -- characters kept at the end for <code>fixed-end</code> and <code>min-end</code>; ignored by <code>even</code></li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;span&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
