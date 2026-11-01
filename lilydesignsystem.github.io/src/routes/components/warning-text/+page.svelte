<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Warning Text</h1>\n<p>Warning text is a short warning about something important, such as the legal consequence of an action or of not acting: an icon and one bold line of text. It is the GOV.UK and DHCW warning-text pattern, headless.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The component renders a <code>&lt;div&gt;</code> holding an optional icon and a <code>&lt;strong&gt;</code> line. The consumer supplies the icon (Lily bundles none), the visually hidden prefix such as &quot;Warning&quot; in their own language, and the text. The component adds no ARIA beyond hiding the icon, draws nothing and carries no strings of its own.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;WarningText&gt;\n  {#snippet icon()}!{/snippet}\n  &lt;span class=&quot;visually-hidden&quot;&gt;Warning&lt;/span&gt;\n  You can be fined up to £5,000 if you do not register.\n&lt;/WarningText&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>icon</code></td>\n<td>slot</td>\n<td>—</td>\n<td>Optional decorative icon, rendered inside an <code>aria-hidden</code> span</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The visually hidden prefix, then the warning text</td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;div&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None. The element is not focusable.</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>No role: the root is a plain <code>&lt;div&gt;</code>, read in page order with the content around it, so it is not announced when the page loads</li>\n<li><code>aria-hidden=&quot;true&quot;</code> on <code>.warning-text-icon</code>, so a glyph such as &quot;!&quot; is not read out</li>\n<li>The consumer&#39;s visually hidden prefix tells a screen reader user the kind of message before its text</li>\n<li>Do not put <code>aria-label</code> on the root: a <code>&lt;div&gt;</code> with no role cannot be named, and the label would replace nothing</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>To warn users about something important near the action or decision it relates to, such as the legal consequences of an action, or of not taking one</li>\n<li>When the warning fits in one short line or sentence and needs no heading or further content</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>WarningCallout</code> — for a warning that needs a heading or several sentences, such as time-critical or health-affecting information on a content page</li>\n<li>Use <code>InsetText</code> — for helpful information that should stand out but is not a warning</li>\n<li>Use <code>Alert</code> — for a status message that appears or changes while the page is open and must be announced (<code>role=&quot;alert&quot;</code>)</li>\n<li>Use <code>Notification</code> — for a brief message about an event or update outside the user&#39;s current task</li>\n<li>Use <code>ErrorMessage</code> and <code>ErrorSummary</code> — for errors in what the user entered</li>\n<li>Do not use for routine or reversible consequences, or repeat it so often on a page that it stops standing out</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only: the elements, the class hooks and hiding the icon. It decides no icon, colour, size, weight, spacing or visually-hidden technique.</p>\n<h2>Styles</h2>\n<p>Target <code>.warning-text</code>, <code>.warning-text-icon</code> and <code>.warning-text-text</code>. The <code>&lt;strong&gt;</code> is bold by default in browsers; keep it bold even where a reset removes user-agent styles. The reference themes do not restyle it yet. No default styles are included in the component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> with class <code>warning-text</code> and appends the consumer class</li>\n<li>A supplied icon renders inside <code>.warning-text-icon</code> with <code>aria-hidden=&quot;true&quot;</code>; with no icon, no wrapper is rendered</li>\n<li>The children render inside <code>strong.warning-text-text</code>, the hidden prefix included</li>\n<li>The component adds no text of its own; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Hidden prefix</strong>: Put a visually hidden prefix such as &quot;Warning&quot; at the start of the content so a screen reader user hears the kind of message before its text. Lily ships no English and no prop for it: supply the string in your own language, hidden with your own visually-hidden class (clip it; never <code>display: none</code>, which hides it from screen readers too). GOV.UK notes you may need to rewrite the hidden text to fit your context.</li>\n<li><strong>Icon</strong>: Supply the icon as text (GOV.UK and DHCW use &quot;!&quot; in a circle drawn with CSS) or an inline SVG. It is hidden from assistive technology, so it must not carry meaning the text lacks. Draw it with <code>currentColor</code> and the page background so it follows a user&#39;s colour overrides, and check it in forced-colours mode.</li>\n<li><strong>Dark backgrounds</strong>: DHCW has a reverse variant for dark backgrounds; use the consumer class or a <code>data-*</code> attribute on the root for it.</li>\n<li><strong>Placement</strong>: Keep it close to the action or decision it is about. Do not use it to report errors.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;div class=&quot;warning-text {class}&quot;&gt;</code></li>\n<li>When an icon is supplied, it renders first, inside <code>&lt;span class=&quot;warning-text-icon&quot; aria-hidden=&quot;true&quot;&gt;</code> (the Angular port always renders this wrapper, empty when nothing is projected into <code>[icon]</code>)</li>\n<li>The children render inside <code>&lt;strong class=&quot;warning-text-text&quot;&gt;</code>: the visually hidden prefix first, then the text</li>\n<li><code>restProps</code> spread onto the root; no state, no behaviour, no live region</li>\n<li>The hidden prefix is content, not a prop, as in <code>warning-callout</code>: Lily ships no English default and no prop for it</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>warning-callout</code></li>\n<li><code>inset-text</code></li>\n<li><code>alert</code></li>\n<li><code>notification</code></li>\n<li><code>error-message</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://design-system.service.gov.uk/components/warning-text/\">GOV.UK Design System: Warning text</a></li>\n<li><a href=\"https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/warning-callout.html\">DHCW Design System: Warning callout, Warning text variant</a></li>\n<li><a href=\"https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-strong-element\">HTML strong element</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"warning-text\"><span class=\"warning-text-icon\" aria-hidden=\"true\">!</span><strong class=\"warning-text-text\"><span class=\"visually-hidden\">Warning</span> You can be fined up to £5,000 if you do not register.</strong></div>";
  const svelteSource: string = "// In your Svelte component:\nimport WarningText from \"lily-design-system-svelte-headless/components/WarningText/WarningText.svelte\";\n\n<WarningText>\n  <!-- content -->\n</WarningText>\n";
  const usageCode: string = "<WarningText>\n  {#snippet icon()}!{/snippet}\n  <span class=\"visually-hidden\">Warning</span>\n  You can be fined up to £5,000 if you do not register.\n</WarningText>\n";
  const variants: { title: string; html: string }[] = [{"title":"Inline SVG icon","html":"<div class=\"warning-text\"><span class=\"warning-text-icon\" aria-hidden=\"true\"><svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" focusable=\"false\"><circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"currentColor\"/><rect x=\"11\" y=\"6\" width=\"2\" height=\"8\" fill=\"Canvas\"/><rect x=\"11\" y=\"16\" width=\"2\" height=\"2\" fill=\"Canvas\"/></svg></span><strong class=\"warning-text-text\"><span class=\"visually-hidden\">Warning</span> You must appeal within 1 year of getting your decision letter.</strong></div>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>WarningText — Lily Design System</title>
  <meta name="description" content="Warning text is a short warning about something important, such as the legal consequence of an action or of not acting: an icon and one bold line of text. It is the GOV.UK and DHCW warning-text pattern, headless." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/warning-text/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: warning-text</li>
      <li>PascalCase: WarningText</li>
      <li>Description: a short warning shown as an icon and a bold line of text, with a visually hidden prefix supplied by the consumer</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;div&gt;</li>
      <li>CSS class: .warning-text</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>None added on the root: it is a plain <code>&lt;div&gt;</code> with no role, so do not give it <code>aria-label</code> (a generic element cannot be named)</li>
      <li><code>aria-hidden="true"</code> on the icon wrapper, so a glyph such as "!" is not read</li>
      <li>The hidden prefix gives screen reader users the kind of message before its text</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None. The component is not focusable</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>icon</code>: slot (optional) -- the decorative icon; rendered inside the <code>aria-hidden</code> wrapper</li>
      <li><code>children</code>: slot (required) -- the visually hidden prefix, then the warning text</li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;div&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
