<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Footnote</h1>\n<p>A footnote provides supplementary information, citations, or clarifications that support the main content without cluttering it. Footnotes are commonly used in articles, academic writing, legal documents, and documentation to reference sources, define terms, or add context.</p>\n<p><strong>Status:</strong> stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.</p>\n<p>This component renders a <code>&lt;span role=&quot;note&quot;&gt;</code>, telling screen readers the content is supplementary without making each footnote a landmark, as an <code>&lt;aside&gt;</code> would. Each footnote is identified by a unique <code>id</code>, allowing in-page links from superscript reference markers in the main text to jump directly to the footnote.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<p>Simple footnote with a source reference:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Footnote id=&quot;fn1&quot;&gt;Source: Example et al., 2024&lt;/Footnote&gt;\n</code></pre>\n<p>Footnote linked from main content via superscript:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;!-- In-page link from main content to footnote --&gt;\n&lt;p&gt;\n  This claim is supported by research.&lt;a href=&quot;#fn1&quot;&gt;&lt;sup&gt;1&lt;/sup&gt;&lt;/a&gt;\n&lt;/p&gt;\n\n&lt;!-- Footnote at the bottom of the page or section --&gt;\n&lt;Footnote id=&quot;fn1&quot;&gt;\n  &lt;a href=&quot;#ref1&quot;&gt;1.&lt;/a&gt; Example, A. (2024). &lt;em&gt;Research Title&lt;/em&gt;. Journal Name.\n&lt;/Footnote&gt;\n</code></pre>\n<p>Multiple footnotes in a clinical guideline:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;p&gt;\n  Blood pressure should be measured at every visit.&lt;a href=&quot;#fn1&quot;&gt;&lt;sup&gt;1&lt;/sup&gt;&lt;/a&gt; Patients with\n  readings above 140/90 mmHg require follow-up.&lt;a href=&quot;#fn2&quot;&gt;&lt;sup&gt;2&lt;/sup&gt;&lt;/a&gt;\n&lt;/p&gt;\n\n&lt;Separator label=&quot;Footnotes&quot; /&gt;\n\n&lt;Footnote id=&quot;fn1&quot;&gt;\n  &lt;a href=&quot;#ref1&quot;&gt;1.&lt;/a&gt; NICE Guideline NG136: Hypertension in adults, 2019.\n&lt;/Footnote&gt;\n&lt;Footnote id=&quot;fn2&quot;&gt;\n  &lt;a href=&quot;#ref2&quot;&gt;2.&lt;/a&gt; WHO Technical Report on Cardiovascular Disease Prevention, 2023.\n&lt;/Footnote&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>id</code>: string (required) -- unique footnote identifier, used for the element id</li>\n<li><code>children</code>: slot (required) -- footnote content to render inside the span</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<p>None -- this component is a passive container. Keyboard navigation is handled by any interactive elements placed inside the footnote by the consumer (such as links).</p>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;note&quot;</code> -- indicates supplementary content that is related to the main content</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for citations, source references, or supplementary clarifications in articles, academic content, or legal documents.</li>\n<li>Use when the additional information should not interrupt the main content flow.</li>\n<li>Use in clinical guidelines, research papers, or policy documents to reference supporting evidence.</li>\n<li>Use for legal disclaimers or terms that need to be associated with specific claims in the text.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for inline citations or bibliographic references -- use Citation instead.</li>\n<li>Do not use for general informational callouts -- use InsetText or InformationCallout instead.</li>\n<li>Do not use for critical information the user must read -- use Alert instead.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component provides a <code>&lt;span role=&quot;note&quot;&gt;</code> with an <code>id</code> for in-page linking from superscript reference markers. The consumer provides all visual styling including indentation, font size, numbering, and separator lines.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.footnote</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders a <code>&lt;span&gt;</code> element with class <code>footnote</code></li>\n<li>Verify role=&quot;note&quot;` -- indicates supplementary content that is related to the main content</li>\n<li>Verify the root has no <code>aria-label</code></li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Position footnotes at the bottom of the page or section with a clear visual separator. Use smaller text to distinguish footnotes from body content.</li>\n<li><strong>Developers</strong>: Ensure the <code>id</code> prop matches the <code>href</code> fragment on the in-page link (e.g., <code>&lt;a href=&quot;#fn1&quot;&gt;</code>) for proper jump-to-footnote navigation.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a <code>&lt;span role=&quot;note&quot;&gt;</code>, not an <code>&lt;aside&gt;</code>, so each footnote is not its own landmark</li>\n<li>The <code>id</code> prop identifies the element for in-page linking (the reference links to <code>#id</code>); it is not used as a name, since an identifier such as <code>fn-1</code> is not one</li>\n<li>Accepts a <code>children</code> slot for flexible footnote content (text, links, citations)</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;span&gt;</code> element for consumer customization</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>citation</code> — a citation acknowledges the relevance of a work of another to the topic of discussion</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA note role: <a href=\"https://www.w3.org/TR/wai-aria-1.2/#note\">https://www.w3.org/TR/wai-aria-1.2/#note</a></li>\n<li>MDN note role: <a href=\"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/note_role\">https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/note_role</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<p>The average adult walks around 5,000 steps a day.<a href=\"#demo-fn-1\"><sup>1</sup></a></p><p><span class=\"footnote\" id=\"demo-fn-1\" role=\"note\">1. Office for National Statistics, 2023 activity survey.</span></p>";
  const svelteSource: string = "// In your Svelte component:\nimport Footnote from \"lily-design-system-svelte-headless/components/Footnote/Footnote.svelte\";\n\n<Footnote>\n  <!-- content -->\n</Footnote>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import Footnote from \"./Footnote.svelte\";\n<\/script>\n\n<p>This claim is supported by research.<a href=\"#fn1\"><sup>1</sup></a></p>\n<Footnote id=\"fn1\">Source: Example et al., 2024</Footnote>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Footnote — Lily Design System</title>
  <meta name="description" content="A footnote provides supplementary information, citations, or clarifications that support the main content without cluttering it. Footnotes are commonly used in articles, academic writing, legal documents, and documentation to reference sources, define terms, or add context." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/footnote/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: footnote</li>
      <li>PascalCase: Footnote</li>
      <li>Description: a footnote reference and content element</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;span&gt;</li>
      <li>CSS class: .footnote</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="note"</code> -- indicates supplementary content that is related to the main content</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>No keyboard interactions — this is a passive element</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>id</code>: string (required) -- unique footnote identifier, used for the element id</li>
      <li><code>children</code>: slot (required) -- footnote content to render inside the span</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
