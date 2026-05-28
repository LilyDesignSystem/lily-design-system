<script lang="ts">
  const html: string = "<h1>PhaseBanner</h1>\n\n<p>A small banner that signals a service is in alpha or beta and points to a feedback link, setting honest expectations for early users that the service is still changing.</p>\n\n<p>The pattern was popularised by GOV.UK to flag that a service is being iterated on, so users know that things may move and that their feedback is wanted. The component is intentionally lightweight: a phase tag rendered as a <code>&lt;strong&gt;</code> next to short descriptive text supplied by the consumer (typically containing a feedback link). It has no <code>role=\"alert\"</code> semantics — phase status is meta-information about the service, not an interruption — but consumers can promote it to a landmark by adding <code>role=\"region\"</code> + <code>aria-label</code> if their layout calls for it.</p>\n\n<p>For service-wide announcements that aren't about development phase, use <code>AnnouncementBanner</code>. For ad-hoc top-of-page banners, use <code>Banner</code>.</p>\n\n<h2>Implementation Notes</h2>\n\n<ul>\n<li>Renders a <code>&lt;div&gt;</code> with an embedded phase tag (e.g. \"Alpha\", \"Beta\") and a feedback link</li>\n<li>The phase tag is rendered as a <code>&lt;strong&gt;</code> so it is semantically emphasised</li>\n<li>Children slot is reserved for the descriptive text (often containing the feedback link)</li>\n<li>Renders no role by default — the banner is meta-information about the service, not a landmark</li>\n<li>Spreads <code>restProps</code> onto the root <code>&lt;div&gt;</code> for consumer customization</li>\n</ul>\n\n<h2>Props</h2>\n\n<table>\n<thead>\n<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>\n</thead>\n<tbody>\n<tr><td><code>phase</code></td><td>string (required)</td><td>—</td><td>Phase label, e.g. \"Alpha\", \"Beta\", \"Live\"</td></tr>\n<tr><td><code>children</code></td><td>slot (required)</td><td>—</td><td>Descriptive text and feedback link</td></tr>\n<tr><td><code>...restProps</code></td><td>HTML attributes</td><td>—</td><td>Spread onto the root <code>&lt;div&gt;</code></td></tr>\n</tbody>\n</table>\n\n<h2>Usage</h2>\n\n<pre><code class=\"language-html\">&lt;PhaseBanner phase=\"Beta\"&gt;\n  This is a new service – your &lt;a href=\"/feedback\"&gt;feedback&lt;/a&gt; will help us improve it.\n&lt;/PhaseBanner&gt;</code></pre>\n\n<h2>Keyboard Interactions</h2>\n\n<ul>\n<li>Native anchor keyboard behaviour applies for any feedback link inside the banner</li>\n</ul>\n\n<h2>ARIA</h2>\n\n<ul>\n<li>Native semantics — no special ARIA needed</li>\n<li>Consumers may add <code>role=\"region\"</code> + <code>aria-label</code> if they treat this banner as a landmark</li>\n</ul>\n\n<h2>When to Use</h2>\n\n<ul>\n<li>Indicating that a service is in alpha or beta and inviting feedback from early users</li>\n<li>Communicating that a service is iterating quickly and may change</li>\n</ul>\n\n<h2>When Not to Use</h2>\n\n<ul>\n<li>Use <code>AnnouncementBanner</code> for service-wide messages unrelated to development phase</li>\n<li>Use <code>Banner</code> for general-purpose top-of-page banners</li>\n</ul>\n\n<h2>Headless</h2>\n\n<p>This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.</p>\n\n<h2>Styles</h2>\n\n<p>The component renders with <code>.phase-banner</code> as the root class. No default styles are included.</p>\n\n<h2>Related components</h2>\n\n<ul>\n<li><code>announcement-banner</code> — service-wide messages</li>\n<li><code>banner</code> — generic top banner</li>\n<li><code>status-tag</code> — single-element status indicator</li>\n</ul>\n\n<h2>References</h2>\n\n<ul>\n<li><a href=\"https://design-system.service.gov.uk/components/phase-banner/\">GOV.UK Phase banners pattern</a></li>\n</ul>";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<div class=\"phase-banner\" aria-label=\"a banner showing service development phase and inviting feedback\">PhaseBanner</div>";
  const svelteSource: string = "// In your Svelte component:\nimport PhaseBanner from \"lily-design-system-svelte-headless/components/PhaseBanner/PhaseBanner.svelte\";\n\n<PhaseBanner>\n  <!-- content -->\n</PhaseBanner>\n";
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>PhaseBanner — Lily Design System</title>
  <meta name="description" content="A small banner that signals a service is in alpha or beta and points to a feedback link, setting honest expectations for early users that the service is still changing." />
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

