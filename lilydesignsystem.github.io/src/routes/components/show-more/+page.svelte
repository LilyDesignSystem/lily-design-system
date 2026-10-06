<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>ShowMore</h1>\n<p>ShowMore holds long content and a button that toggles it between clamped and fully shown. Unlike <code>expander</code>, the content is never removed from the DOM or the accessibility tree; the clamp is a purely visual consumer CSS rule keyed on <code>data-expanded</code>, so find-in-page and screen readers still reach all of it.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root <code>&lt;div class=&quot;show-more&quot;&gt;</code> containing <code>&lt;div class=&quot;show-more-content&quot; id data-expanded&gt;</code> and <code>&lt;button type=&quot;button&quot; class=&quot;show-more-button&quot;&gt;</code></li>\n<li>The button text is <code>moreLabel</code> when collapsed and <code>lessLabel</code> when expanded -- both required, no English default</li>\n<li>The button carries <code>aria-expanded</code> and <code>aria-controls</code> pointing at the content <code>id</code></li>\n<li><code>expanded</code> is bindable, default <code>false</code></li>\n<li>No inline style: the clamp is consumer CSS on <code>[data-expanded=&quot;false&quot;]</code></li>\n<li>Spreads <code>restProps</code> onto the root</li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>className</code>: string (default: <code>&quot;&quot;</code>) -- CSS class name appended to the base class</li>\n<li><code>moreLabel</code>: string (required) -- button text while collapsed</li>\n<li><code>lessLabel</code>: string (required) -- button text while expanded</li>\n<li><code>expanded</code>: boolean (default: <code>false</code>) -- bindable</li>\n<li><code>children</code>: slot -- the content</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the root</li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;ShowMore moreLabel=&quot;Show more&quot; lessLabel=&quot;Show less&quot; bind:expanded&gt;\n  &lt;p&gt;A long description...&lt;/p&gt;\n&lt;/ShowMore&gt;\n</code></pre>\n<p>Consumer CSS:</p>\n<pre tabindex=\"0\"><code class=\"language-css\">.show-more-content[data-expanded=&quot;false&quot;] { max-height: 6em; overflow: hidden; }\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Enter: toggles when the button has focus (native)</li>\n<li>Space: toggles when the button has focus (native)</li>\n<li>Tab: moves focus to / from the button</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>aria-expanded={expanded}</code> -- on the button</li>\n<li><code>aria-controls={contentId}</code> -- on the button, references the content <code>id</code></li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for long descriptions, reviews or lists where a short preview is enough most of the time.</li>\n<li>Use when the full content must remain searchable and available to assistive technology.</li>\n<li>Use to shorten a page without hiding content behind a click-to-reveal region.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use to hide supplementary help -- use <code>details</code> or <code>expander</code>.</li>\n<li>Do not use to split a long page into sections -- use <code>accordion-nav</code> or <code>collapsible</code>.</li>\n<li>Do not use for paging through many items -- use <code>pagination-nav</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders a <code>&lt;div&gt;</code>, a content wrapper and a native <code>&lt;button&gt;</code>. It decides no clamp height, fade or animation; those are consumer CSS.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling via <code>.show-more</code>, <code>.show-more-content</code> (with <code>[data-expanded]</code>) and <code>.show-more-button</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify root <code>&lt;div class=&quot;show-more&quot;&gt;</code> and button <code>type=&quot;button&quot;</code></li>\n<li>Verify collapsed by default with <code>moreLabel</code>, <code>aria-expanded=false</code>, <code>data-expanded=false</code></li>\n<li>Verify the content stays in the DOM while collapsed</li>\n<li>Verify click expands (lessLabel, true) and collapses again</li>\n<li>Verify Enter and Space toggle</li>\n<li>Verify <code>aria-controls</code> matches the content id</li>\n<li>Verify no inline style</li>\n<li>Verify pass-through attributes</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Pair the clamp with a fade so users see content is cut off. Honour reduced motion in any transition.</li>\n<li><strong>Developers</strong>: The clamp lives in your CSS; without it the toggle changes only <code>data-expanded</code>.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>expander</code> — removes content from the DOM when collapsed</li>\n<li><code>details</code> — native disclosure of supplementary content</li>\n<li><code>collapsible</code> — a native-details panel</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA Disclosure Pattern: <a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/\">https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"show-more\"><div class=\"show-more-content\" id=\"demo-show-more\" data-expanded=\"false\"><p>The first paragraph is always visible. The rest of this content is clamped by consumer CSS until the button below reveals it.</p><p>A second paragraph that appears once expanded.</p></div><button type=\"button\" class=\"show-more-button\" aria-expanded=\"false\" aria-controls=\"demo-show-more\">Show more</button></div>";
  const svelteSource: string = "// In your Svelte component:\nimport ShowMore from \"lily-design-system-svelte-headless/components/ShowMore/ShowMore.svelte\";\n\n<ShowMore>\n  <!-- content -->\n</ShowMore>\n";
  const usageCode: string = "<ShowMore moreLabel=\"Show more\" lessLabel=\"Show less\" bind:expanded>\n  <p>A long description...</p>\n</ShowMore>\n";
  const variants: { title: string; html: string }[] = [{"title":"Expanded","html":"<div class=\"show-more\"><div class=\"show-more-content\" id=\"show-more-expanded\" data-expanded=\"true\"><p>The first paragraph is always visible. The rest of this content is clamped by consumer CSS until the button below reveals it.</p><p>A second paragraph that appears once expanded.</p></div><button type=\"button\" class=\"show-more-button\" aria-expanded=\"true\" aria-controls=\"show-more-expanded\">Show less</button></div>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>ShowMore — Lily Design System</title>
  <meta name="description" content="ShowMore holds long content and a button that toggles it between clamped and fully shown. Unlike expander, the content is never removed from the DOM or the accessibility tree; the clamp is a purely visual consumer CSS rule keyed on data-expanded, so find-in-page and screen readers still reach all…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/show-more/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: show-more</li>
      <li>PascalCase: ShowMore</li>
      <li>Description: clamp long content behind a show more / show less toggle</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .show-more</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>aria-expanded=&#123;expanded&#125;</code> -- on the button</li>
      <li><code>aria-controls=&#123;contentId&#125;</code> -- on the button, references the content <code>id</code></li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Enter: toggles when the button has focus (native)</li>
      <li>Space: toggles when the button has focus (native)</li>
      <li>Tab: moves focus to / from the button</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>className</code>: string (default: <code>""</code>) -- CSS class name appended to the base class</li>
      <li><code>moreLabel</code>: string (required) -- button text while collapsed</li>
      <li><code>lessLabel</code>: string (required) -- button text while expanded</li>
      <li><code>expanded</code>: boolean (default: <code>false</code>) -- bindable</li>
      <li><code>children</code>: slot -- the content</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
