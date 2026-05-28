<script lang="ts">
  const html: string = "<h1>Step List</h1>\n\n<p>A step list is an ordered list of step items showing progress through a multi-step process. It uses a semantic <code>&lt;ol&gt;</code> element so screen readers announce the count and order of steps.</p>\n\n<p>Use it for wizards, checkout flows, onboarding tours, or any sequence of stages where the user can see their position relative to the whole.</p>\n\n<h2>Composition</h2>\n\n<p>Step List is the parent of Step List Items in the <code>*List</code>/<code>*ListItem</code> pattern.</p>\n\n<pre><code class=\"language-html\">&lt;StepList label=\"Checkout\" current={1}&gt;\n  &lt;StepListItem status=\"finished\"&gt;Cart&lt;/StepListItem&gt;\n  &lt;StepListItem status=\"in-progress\" current&gt;Address&lt;/StepListItem&gt;\n  &lt;StepListItem status=\"waiting\"&gt;Payment&lt;/StepListItem&gt;\n&lt;/StepList&gt;</code></pre>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a semantic <code>&lt;ol class=\"step-list\"&gt;</code> element</li>\n<li><code>aria-label</code> is set when the optional <code>label</code> prop is provided</li>\n<li><code>data-current</code> is set when the optional <code>current</code> prop is provided</li>\n<li>Children are typically <code>step-list-item</code> components</li>\n<li>The <code>&lt;ol&gt;</code> provides list semantics; no extra ARIA role required</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>label</code>: string (optional) -- aria-label</li>\n<li><code>current</code>: number (optional) -- 0-based index of the current step (data-current hook)</li>\n<li><code>children</code>: slot -- step-list-item children</li>\n<li><code>...restProps</code>: any additional HTML attributes</li>\n</ul>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;StepList label=\"Onboarding\" current={2}&gt;\n  &lt;StepListItem status=\"finished\"&gt;Sign up&lt;/StepListItem&gt;\n  &lt;StepListItem status=\"finished\"&gt;Verify email&lt;/StepListItem&gt;\n  &lt;StepListItem status=\"in-progress\" current&gt;Set preferences&lt;/StepListItem&gt;\n  &lt;StepListItem status=\"waiting\"&gt;Done&lt;/StepListItem&gt;\n&lt;/StepList&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>None at this level — keyboard behavior lives on any interactive children.</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>The <code>&lt;ol&gt;</code> element provides list semantics</li>\n<li><code>aria-label</code> provides the accessible name when <code>label</code> is set</li>\n<li><code>data-current</code> is a CSS hook; the active item should also receive <code>aria-current=\"step\"</code> via StepListItem</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to show progress through a sequence of stages (checkout, wizard, onboarding).</li>\n<li>Use when users benefit from seeing where they are in the flow.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for arbitrary unordered content — use a regular list.</li>\n<li>Do not use for navigation menus — use a navigation list or breadcrumb.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>Renders an <code>&lt;ol&gt;</code> with no styling. The orientation, connector lines, status colors, and visual indicators are entirely the consumer's responsibility.</p>\n\n<h2>Styles</h2>\n\n<p>Consumer CSS targets the <code>step-list</code> class. Use <code>data-current</code> to drive position-based styling. Provide horizontal or vertical orientation as needed.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders an <code>&lt;ol&gt;</code> element with class <code>step-list</code></li>\n<li>Verify <code>aria-label</code> is set when <code>label</code> is provided</li>\n<li>Verify <code>data-current</code> reflects the <code>current</code> prop when provided</li>\n<li>Verify children render in document order</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Decide whether to show the user's position via <code>data-current</code> styling or a separate visual indicator. Keep step labels short.</li>\n<li><strong>Developers</strong>: Pass the 0-based index via the <code>current</code> prop so consumer CSS can target the active step. Use StepListItem <code>current</code> to apply <code>aria-current=\"step\"</code>.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>step-list-item</code> — one step in a step list with status of waiting, in progress, finished, or error</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>WAI-ARIA Group Role: https://www.w3.org/TR/wai-aria-1.2/#group</li>\n<li>Ant Design Steps: https://ant.design/components/steps</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"step-list\" aria-label=\"an ordered list of step items showing progress through a multi-step process\">StepList</div>";
  const svelteSource: string = "// In your Svelte component:\nimport StepList from \"lily-design-system-svelte-headless/components/StepList/StepList.svelte\";\n\n<StepList>\n  <!-- list children -->\n</StepList>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Step List — Lily Design System</title>
  <meta name="description" content="A step list is an ordered list of step items showing progress through a multi-step process. It uses a semantic &lt;ol&gt; element so screen readers announce the count and order of steps." />
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
    <summary style="cursor: pointer; font-weight: 600;">Show Svelte source</summary>
    <pre style="overflow-x: auto; padding: 1rem; background: #f0f4f5; border-radius: 0.5rem;"><code>{svelteSource}</code></pre>
  </details>
</section>
<!-- END auto-generated component example -->

