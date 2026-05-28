<script lang="ts">
  const html: string = "<h1>Email Link</h1>\n\n<p>An email link displays an email as a clickable mailto link. When clicked, it opens the user's default email client with the address pre-filled. This is the read-only companion to EmailAddressInput, used for displaying email addresses in profiles, contact lists, or user cards.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders an <code>&lt;a&gt;</code> element with <code>href=\"mailto:{email}\"</code> for native email client integration</li>\n<li>Displays the email address as visible link text</li>\n<li>Supports an optional <code>aria-label</code> override for cases where additional context is needed</li>\n<li>Spreads <code>restProps</code> for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<ul>\n<li><code>email</code>: string (required) -- the email address to display and link to</li>\n<li><code>label</code>: string (default: <code>undefined</code>) -- optional accessible label override via <code>aria-label</code></li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;a&gt;</code> element</li>\n</ul>\n\n<h2>Usage</h2>\n\n<p>Email link on a contact page:</p>\n\n<pre><code class=\"language-html\">&lt;EmailLink email=\"support@example.com\" label=\"Email our support team\" /&gt;</code></pre>\n\n<p>Email link in a user profile card:</p>\n\n<pre><code class=\"language-html\">&lt;EmailLink email=\"alice@example.com\" /&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<p>None -- this is a standard <code>&lt;a&gt;</code> link; keyboard behavior (Tab to focus, Enter to activate) is provided natively by the browser.</p>\n\n<h2>ARIA</h2>\n\n<ul>\n<li><code>aria-label=\"...\"</code> -- optional override for the accessible name when the visible email text alone is insufficient context</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Use to display an email address as a mailto: hyperlink.</li>\n<li>Use when users should be able to click to open their email client.</li>\n<li>Use on contact pages, user profiles, business listings, and support sections.</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Do not use for entering an email address -- use EmailInput instead.</li>\n<li>Do not use for non-email links -- use ActionLink instead.</li>\n<li>Do not use when the email should be displayed as plain non-interactive text.</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component provides an <code>&lt;a&gt;</code> element with <code>href=\"mailto:{email}\"</code>, the email address as visible link text, and optional <code>aria-label</code> override for additional context. The consumer provides all visual styling for the link appearance.</p>\n\n<h2>Styles</h2>\n\n<p>The consumer provides all CSS styling. The component renders with a <code>.email-link</code> class for targeting. No default styles are included — this is a fully headless component.</p>\n\n<h2>Testing</h2>\n\n<ul>\n<li>Verify the component renders a <code>&lt;a&gt;</code> element with class <code>email-link</code></li>\n<li>Verify aria-label=\"...\"` -- optional override for the accessible name when the visible email text alone is insufficient context</li>\n<li>Verify pass-through attributes are applied</li>\n</ul>\n\n<h2>Advice</h2>\n\n<ul>\n<li><strong>Designers</strong>: Style the email link consistently with other hyperlinks in your design system. Consider adding an email icon to visually indicate the mailto behavior.</li>\n<li><strong>Developers</strong>: Use the <code>label</code> prop to provide additional accessible context when the email address alone is ambiguous (e.g., when multiple email links appear on the same page).</li>\n</ul>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>email-input</code> — an input for entering an email address &lt;input type=\"email\"&gt;</li>\n<li><code>tel-link</code> — a tel hyperlink for a telephone number</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li>MDN <code>mailto:</code> links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_an_email_address</li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<a class=\"email-link\" href=\"mailto:example@example.com\">example@example.com</a>";
  const svelteSource: string = "// In your Svelte component:\nimport EmailLink from \"lily-design-system-svelte-headless/components/EmailLink/EmailLink.svelte\";\n\n<EmailLink>EmailLink</EmailLink>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Email Link — Lily Design System</title>
  <meta name="description" content="An email link displays an email as a clickable mailto link. When clicked, it opens the user's default email client with the address pre-filled. This is the read-only companion to EmailAddressInput,..." />
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

