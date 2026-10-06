<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>KbdShortcut</h1>\n<p>KbdShortcut renders a keyboard shortcut such as Ctrl + K as an outer <code>&lt;kbd&gt;</code> holding one inner <code>&lt;kbd&gt;</code> per key with a decorative separator between them. Use <code>kbd</code> for a single key reference.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Root <code>&lt;kbd class=&quot;kbd-shortcut&quot;&gt;</code> containing, per key, <code>&lt;kbd class=&quot;kbd-shortcut-key&quot;&gt;</code></li>\n<li>Between keys: <code>&lt;span class=&quot;kbd-shortcut-separator&quot; aria-hidden=&quot;true&quot;&gt;</code> containing <code>separator</code> (default <code>+</code>)</li>\n<li>Optional <code>label</code> becomes <code>aria-label</code> on the root as the spoken form; absent, screen readers read the keys</li>\n<li>Spreads <code>restProps</code> onto the root</li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>className</code>: string (default: <code>&quot;&quot;</code>) -- CSS class name appended to the base class</li>\n<li><code>keys</code>: string[] (required) -- the key names, in order</li>\n<li><code>separator</code>: string (default: <code>&quot;+&quot;</code>) -- decorative separator between keys</li>\n<li><code>label</code>: string (optional) -- spoken form, applied as <code>aria-label</code></li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the root</li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;KbdShortcut keys={[&quot;Ctrl&quot;, &quot;K&quot;]} label=&quot;Control K&quot; /&gt;\n&lt;KbdShortcut keys={[&quot;G&quot;, &quot;H&quot;]} separator=&quot; then &quot; /&gt;\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None. KbdShortcut is a passive display element</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>Separators are <code>aria-hidden=&quot;true&quot;</code> so they are not read</li>\n<li><code>aria-label={label}</code> -- optional spoken form on the root</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to show a multi-key shortcut in menus, help panels and command palettes.</li>\n<li>Use where the keys, order and separator should be consistent.</li>\n<li>Use in onboarding that teaches shortcuts.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for a single key -- use <code>kbd</code>.</li>\n<li>Do not use for code or commands -- use <code>code</code> or <code>code-block</code>.</li>\n<li>Do not use to make a shortcut work -- it only displays one.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders nested <code>&lt;kbd&gt;</code> elements. Keycap appearance, spacing and separator styling are consumer CSS; no key icons are bundled.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling via <code>.kbd-shortcut</code>, <code>.kbd-shortcut-key</code> and <code>.kbd-shortcut-separator</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify the root is a <code>&lt;kbd&gt;</code> with class <code>kbd-shortcut</code></li>\n<li>Verify one inner <code>kbd-shortcut-key</code> per key, in order</li>\n<li>Verify separators only between keys, default <code>+</code>, configurable, <code>aria-hidden</code></li>\n<li>Verify <code>label</code> becomes <code>aria-label</code></li>\n<li>Verify pass-through attributes</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Style platform-appropriate key names; show Cmd on macOS and Ctrl elsewhere.</li>\n<li><strong>Developers</strong>: Detect the platform in your app and pass the right <code>keys</code>; this component does no detection or localisation.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>kbd</code> — a single key</li>\n<li><code>code</code> — inline code</li>\n<li><code>menu</code> — menus that often show shortcuts</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>MDN kbd element: <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd\">https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<kbd class=\"kbd-shortcut\"><kbd class=\"kbd-shortcut-key\">Ctrl</kbd><span class=\"kbd-shortcut-separator\" aria-hidden=\"true\">+</span><kbd class=\"kbd-shortcut-key\">K</kbd></kbd>";
  const svelteSource: string = "// In your Svelte component:\nimport KbdShortcut from \"lily-design-system-svelte-headless/components/KbdShortcut/KbdShortcut.svelte\";\n\n<KbdShortcut>\n  <!-- content -->\n</KbdShortcut>\n";
  const usageCode: string = "<KbdShortcut keys={[\"Ctrl\", \"K\"]} label=\"Control K\" />\n<KbdShortcut keys={[\"G\", \"H\"]} separator=\" then \" />\n";
  const variants: { title: string; html: string }[] = [{"title":"Three keys","html":"<kbd class=\"kbd-shortcut\"><kbd class=\"kbd-shortcut-key\">Cmd</kbd><span class=\"kbd-shortcut-separator\" aria-hidden=\"true\">+</span><kbd class=\"kbd-shortcut-key\">Shift</kbd><span class=\"kbd-shortcut-separator\" aria-hidden=\"true\">+</span><kbd class=\"kbd-shortcut-key\">P</kbd></kbd>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>KbdShortcut — Lily Design System</title>
  <meta name="description" content="KbdShortcut renders a keyboard shortcut such as Ctrl + K as an outer &lt;kbd&gt; holding one inner &lt;kbd&gt; per key with a decorative separator between them. Use kbd for a single key reference." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/kbd-shortcut/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: kbd-shortcut</li>
      <li>PascalCase: KbdShortcut</li>
      <li>Description: a multi-key keyboard shortcut shown as a row of key caps</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</li>
      <li>HTML tag: &lt;kbd&gt;</li>
      <li>CSS class: .kbd-shortcut</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>Separators are <code>aria-hidden="true"</code> so they are not read</li>
      <li><code>aria-label=&#123;label&#125;</code> -- optional spoken form on the root</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None. KbdShortcut is a passive display element</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>className</code>: string (default: <code>""</code>) -- CSS class name appended to the base class</li>
      <li><code>keys</code>: string[] (required) -- the key names, in order</li>
      <li><code>separator</code>: string (default: <code>"+"</code>) -- decorative separator between keys</li>
      <li><code>label</code>: string (optional) -- spoken form, applied as <code>aria-label</code></li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
