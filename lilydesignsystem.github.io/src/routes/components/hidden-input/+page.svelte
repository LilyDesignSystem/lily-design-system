<script lang="ts">
  const html: string = "<h1>Hidden Input</h1>\n\n<p>HiddenInput is a headless component that renders a native <code>&lt;input type=\"hidden\"&gt;</code> element for passing data in forms that should not be visible or editable by the user. It provides a simple, type-safe way to include hidden form values such as CSRF tokens, record IDs, or other metadata that must be submitted with a form.</p>\n\n<p>This component is useful whenever a form needs to carry data that the user should not see or modify directly. The hidden input participates in form submission but has no visual presence, no keyboard interaction, and no ARIA requirements since it is not perceivable.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a native <code>&lt;input type=\"hidden\"&gt;</code> element</li>\n<li>Requires a <code>name</code> prop for the form field name</li>\n<li>The <code>value</code> prop defaults to an empty string</li>\n<li>Spreads <code>restProps</code> onto the input for consumer customization (e.g., <code>id</code>, <code>data-*</code> attributes)</li>\n<li>No ARIA attributes needed because hidden inputs are not perceivable by any user</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>name</code>: string (required) -- the form field name attribute</li>\n<li><code>value</code>: string (default: <code>\"\"</code>) -- the hidden input value</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;input&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>CSRF token included in a form:</p>\n\n<pre><code class=\"language-html\">&lt;Form label=\"Update settings\" onsubmit={save}&gt;\n  &lt;HiddenInput name=\"_csrf\" value={csrfToken} /&gt;\n  &lt;Field label=\"Display name\"&gt;\n    &lt;TextInput label=\"Display name\" value={displayName} /&gt;\n  &lt;/Field&gt;\n  &lt;SubmitInput value=\"Save\" /&gt;\n&lt;/Form&gt;</code></pre>\n\n<p>Record ID for an update operation:</p>\n\n<pre><code class=\"language-html\">&lt;HiddenInput name=\"recordId\" value={patient.id} /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>None -- hidden inputs are not visible or focusable and have no keyboard interaction.</p>\n\n<h2>ARIA</h2>\n\n<p>None -- hidden inputs are not perceivable by users or assistive technologies, so no ARIA attributes are needed.</p>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to include data in form submission that should not be visible to the user, such as CSRF tokens or record IDs.</li>\n<li>Use when the form needs to carry tracking metadata, session identifiers, or pre-set values.</li>\n<li>Use for any non-visible data that must be submitted with the form.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for fields that users should see or edit -- use a standard Input component instead.</li>\n<li>Do not use for sensitive data that should not be in the DOM, as hidden inputs can be inspected by users.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides a native <code>&lt;input type=\"hidden\"&gt;</code> element with <code>name</code> and <code>value</code> attributes for form submission. No ARIA or visual styling is needed because hidden inputs are not perceivable by any user or assistive technology.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.hidden-input</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;input&gt;</code> element with class <code>hidden-input</code></li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: No visual design is needed -- hidden inputs have no visual presence. Document which hidden values your forms require so developers include them.</li>\n<li><strong>Developers</strong>: Always set the <code>name</code> prop for form submission. Never store sensitive data in hidden inputs that could be inspected or modified by the user.</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>input</code> — a generic HTML input element</li>\n<li><code>form</code> — a form element for collecting and submitting user data</li>\n<li><code>field</code> — a form field wrapper with label, input, and error message</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>HTML hidden input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/hidden</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<input class=\"hidden-input\" type=\"hidden\" value=\"secret\" />";
  const svelteSource: string = "// In your Svelte component:\nimport HiddenInput from \"lily-design-system-svelte-headless/components/HiddenInput/HiddenInput.svelte\";\n\n<HiddenInput label=\"Label\" />\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Hidden Input — Lily Design System</title>
  <meta name="description" content="HiddenInput is a headless component that renders a native &lt;input type=&quot;hidden&quot;&gt; element for passing data in forms that should not be visible or editable by the user. It provides a simple, type-safe..." />
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

