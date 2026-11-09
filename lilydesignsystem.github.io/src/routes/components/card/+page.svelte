<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Card</h1>\n<p>A card groups related content and actions into a self-contained semantic container, making it easy to browse and compare items. Cards are commonly used for product listings, user profiles, article previews, media galleries, and dashboard widgets. They present a digestible summary of information that can include headings, text, and interactive elements.</p>\n<p><strong>Status:</strong> stable — exercised in composed page flows under e2e and axe, beyond the per-component checks.</p>\n<p>The component renders a <code>&lt;div&gt;</code>, which becomes <code>role=&quot;group&quot;</code> when a <code>label</code> names it. It supports a configurable heading level (h2-h6) for proper document outline, and the heading can optionally be wrapped in a link when an <code>href</code> is provided.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<p>Card with linked heading for a condition page:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Card\n  heading=&quot;Diabetes&quot;\n  headingLevel=&quot;{2}&quot;\n  href=&quot;/conditions/diabetes&quot;\n&gt;\n  &lt;p&gt;\n    Find out about type 1 and type 2 diabetes, including symptoms, diagnosis, and how to manage the\n    condition.\n  &lt;/p&gt;\n&lt;/Card&gt;\n</code></pre>\n<p>Card with action link for a profile:</p>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;Card\n  heading=&quot;Dr Sarah Mitchell&quot;\n  label=&quot;GP profile&quot;\n&gt;\n  &lt;p&gt;General Practitioner&lt;/p&gt;\n  &lt;p&gt;Special interests: cardiology, respiratory medicine&lt;/p&gt;\n  &lt;ActionLink href=&quot;/book/dr-mitchell&quot;&gt;Book an appointment&lt;/ActionLink&gt;\n&lt;/Card&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>heading</code>: string (optional) -- heading text for the card</li>\n<li><code>headingLevel</code>: 2 | 3 | 4 | 5 | 6 (default: 3) -- HTML heading level</li>\n<li><code>href</code>: string (optional) -- makes the heading a link</li>\n<li><code>label</code>: string (optional) -- names the card (<code>aria-label</code>, with <code>role=&quot;group&quot;</code>)</li>\n<li><code>children</code>: slot (required) -- card body content</li>\n<li><code>...restProps</code>: Any additional HTML attributes passed to the root <code>&lt;div&gt;</code></li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Tab: Focus the heading link when <code>href</code> is provided</li>\n<li>Enter: Activate the heading link (browser default)</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>No role when unlabelled: a <code>&lt;div&gt;</code></li>\n<li><code>role=&quot;group&quot;</code> and <code>aria-label</code> when <code>label</code> is given -- names the card as a group, not a landmark</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to group related content such as a service listing, team member profile, or article preview into a scannable unit.</li>\n<li>Use when users need to browse and compare multiple items in a grid or list layout.</li>\n<li>Use when the content is self-contained and makes sense as a standalone summary.</li>\n<li>Use the <code>href</code> prop to make the card heading a link when the card leads to a detail page.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use to highlight content within long-form pages -- use InsetText or WarningCallout instead.</li>\n<li>Do not use for medical care instructions with urgency levels -- use CareCard instead.</li>\n<li>Do not use for single full-width content sections -- use Panel or a plain section element.</li>\n<li>Do not use when content needs to be hidden/revealed -- use Details or Expander instead.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless Card component provides a <code>&lt;div&gt;</code> (a named group when labelled), configurable heading level for document outline, and an optional heading link via <code>href</code>. The consumer provides all visual styling including card borders, shadows, spacing, background colors, and layout of header, body, and footer areas.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling. The component renders with a <code>.card</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the component renders a <code>&lt;div&gt;</code> element with class <code>card</code></li>\n<li>Verify a labelled card has <code>role=&quot;group&quot;</code> and its <code>aria-label</code>, and an unlabelled one has no role</li>\n<li>Verify keyboard interactions work correctly</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Keep card content concise and scannable. Use consistent card heights within a grid to maintain visual rhythm.</li>\n<li><strong>Developers</strong>: Choose the heading level carefully to preserve the document outline hierarchy. Use the <code>label</code> prop when multiple cards appear on one page to help screen reader users distinguish between them.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders a <code>&lt;div&gt;</code>: a card is not always a stand-alone item, and an <code>&lt;article&gt;</code> on every card in a list is noise for screen-reader users. Pass <code>role=&quot;article&quot;</code> for a card that is one</li>\n<li>Heading level is configurable (2-6) for proper document outline structure</li>\n<li>When <code>href</code> is provided, the heading text wraps in an <code>&lt;a&gt;</code> element for navigation</li>\n<li>Optional <code>label</code> names the card, which then has <code>role=&quot;group&quot;</code>; with no label the <code>&lt;div&gt;</code> is generic and unnamed</li>\n<li>Content is provided through child elements</li>\n<li>Passes through all additional HTML attributes via <code>...restProps</code></li>\n</ul>\n<h2>Composition</h2>\n<p>Card supports header, body, and footer content areas through its children slot. Structure the card content with a heading for the header area, paragraph or descriptive content for the body, and action links or buttons for the footer. The <code>heading</code> prop provides a built-in heading element, or consumers can supply their own heading as part of the children content.</p>\n<h2>Related components</h2>\n<ul>\n<li><code>feature-card</code> — a large content card with a prominent image positioned alongside or above the text</li>\n<li><code>product-card</code> — a specialized card for displaying a product with image, title, price, and actions</li>\n<li><code>panel</code> — a generic content panel with optional heading</li>\n<li><code>tile</code> — a grouping container that presents related content in a structured format, often as a single clickable area</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div\">MDN div element</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"card\"><h3>Card Title</h3><p>Card content goes here.</p></div>";
  const svelteSource: string = "// In your Svelte component:\nimport Card from \"lily-design-system-svelte-headless/components/Card/Card.svelte\";\n\n<Card>\n  <!-- content -->\n</Card>\n";
  const usageCode: string = "<script lang=\"ts\">\n  import Card from \"./Card.svelte\";\n<\/script>\n\n<Card>\n  <h3>Plain card</h3>\n  <p>Body content.</p>\n</Card>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Card — Lily Design System</title>
  <meta name="description" content="A card groups related content and actions into a self-contained semantic container, making it easy to browse and compare items. Cards are commonly used for product listings, user profiles, article previews, media galleries, and dashboard widgets. They present a digestible summary of information t…" />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/card/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: card</li>
      <li>PascalCase: Card</li>
      <li>Description: a grouped content container with header, body, and footer areas</li>
      <li>Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .card</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>No role when unlabelled: a <code>&lt;div&gt;</code></li>
      <li><code>role="group"</code> and <code>aria-label</code> when <code>label</code> is given -- names the card as a group, not a landmark</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab: Focus the heading link when <code>href</code> is provided</li>
      <li>Enter: Activate the heading link (browser default)</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>heading</code>: string (optional) -- heading text for the card</li>
      <li><code>headingLevel</code>: 2 | 3 | 4 | 5 | 6 (default: 3) -- HTML heading level</li>
      <li><code>href</code>: string (optional) -- makes the heading a link</li>
      <li><code>label</code>: string (optional) -- names the card (<code>aria-label</code>, with <code>role="group"</code>)</li>
      <li><code>children</code>: slot (required) -- card body content</li>
      <li><code>...restProps</code>: Any additional HTML attributes passed to the root <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
