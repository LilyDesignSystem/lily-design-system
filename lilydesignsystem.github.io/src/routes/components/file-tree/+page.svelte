<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const html: string = "<h1>FileTree</h1>\n<p>FileTree is a headless tree widget for folders and files following the WAI-ARIA tree pattern. The consumer supplies <code>&lt;li role=&quot;treeitem&quot;&gt;</code> items (folders carry <code>aria-expanded</code> and a nested <code>&lt;ul role=&quot;group&quot;&gt;</code>); the root owns the keyboard and a roving tabindex.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</p>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;ul class=&quot;file-tree&quot; role=&quot;tree&quot; aria-label={label}&gt;</code></li>\n<li>Roving tabindex: exactly one visible treeitem has <code>tabindex=&quot;0&quot;</code>, the rest <code>-1</code>; the tab stop follows focus and is re-seated if its item becomes hidden</li>\n<li>Visible items are those with no closed (<code>aria-expanded=&quot;false&quot;</code>) ancestor treeitem</li>\n<li>Opening and closing is done by toggling <code>aria-expanded</code>; hiding a closed folder&#39;s group is consumer CSS</li>\n<li>Arrow keys clamp at the ends (no wrap), per the APG</li>\n<li>Typeahead matches the item&#39;s own text (excluding nested groups), with a 500 ms buffer</li>\n<li>Enter / Space call <code>click()</code> on the focused item</li>\n<li>No custom events are dispatched</li>\n<li>Spreads <code>restProps</code> onto the <code>&lt;ul&gt;</code></li>\n</ul>\n<h2>Props</h2>\n<ul>\n<li><code>className</code>: string (default: <code>&quot;&quot;</code>) -- CSS class name appended to the base class</li>\n<li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>\n<li><code>children</code>: slot -- the tree items</li>\n<li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;ul&gt;</code></li>\n</ul>\n<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;FileTree label=&quot;Project files&quot;&gt;\n  &lt;li role=&quot;treeitem&quot; aria-expanded=&quot;true&quot; aria-selected=&quot;false&quot;&gt;src\n    &lt;ul role=&quot;group&quot;&gt;\n      &lt;li role=&quot;treeitem&quot; aria-selected=&quot;false&quot;&gt;index.ts&lt;/li&gt;\n    &lt;/ul&gt;\n  &lt;/li&gt;\n  &lt;li role=&quot;treeitem&quot; aria-selected=&quot;false&quot;&gt;readme.md&lt;/li&gt;\n&lt;/FileTree&gt;\n</code></pre>\n<p>Consumer CSS hides a closed folder&#39;s group:</p>\n<pre tabindex=\"0\"><code class=\"language-css\">[role=&quot;treeitem&quot;][aria-expanded=&quot;false&quot;] &gt; [role=&quot;group&quot;] { display: none; }\n</code></pre>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>Tab: moves focus into the tree to the single tab-stop item, and out of it</li>\n<li>ArrowDown / ArrowUp: next / previous visible item (no wrap)</li>\n<li>ArrowRight: on a closed folder opens it; on an open folder moves to its first child</li>\n<li>ArrowLeft: on an open folder closes it; otherwise moves to the parent folder</li>\n<li>Home / End: first / last visible item</li>\n<li><code>*</code>: expands all closed sibling folders at the focused level</li>\n<li>Printable characters: typeahead to the next visible item whose text starts with the typed characters</li>\n<li>Enter / Space: activates the focused item</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li><code>role=&quot;tree&quot;</code> and <code>aria-label={label}</code> on the root</li>\n<li>Consumer supplies <code>role=&quot;treeitem&quot;</code>, <code>role=&quot;group&quot;</code>, <code>aria-expanded</code> (folders) and <code>aria-selected</code></li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use for navigating folders and files, such as a repository, document store or asset library.</li>\n<li>Use for a hierarchy where users need arrow-key navigation and expand / collapse.</li>\n<li>Use when the consumer controls item content, icons and selection.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not use for site navigation links -- use <code>tree-nav</code>.</li>\n<li>Do not use for a simple nested list -- use <code>tree-list</code>.</li>\n<li>Do not use for a flat list of choices -- use <code>listbox</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component renders the <code>&lt;ul role=&quot;tree&quot;&gt;</code> and the keyboard behaviour only. It draws no icons or indentation and does not hide closed folders; the consumer supplies items, icons and CSS.</p>\n<h2>Styles</h2>\n<p>The consumer provides all CSS styling via the <code>.file-tree</code> class, and hides closed groups with <code>[aria-expanded=&quot;false&quot;] &gt; [role=&quot;group&quot;]</code>.</p>\n<h2>Testing</h2>\n<ul>\n<li>Verify <code>&lt;ul role=&quot;tree&quot;&gt;</code> with <code>aria-label</code> and class <code>file-tree</code></li>\n<li>Verify exactly one tab stop that follows focus, and re-seating when hidden</li>\n<li>Verify ArrowDown / ArrowUp, no wrap, skipping closed folders</li>\n<li>Verify Home / End</li>\n<li>Verify ArrowRight open / first child, ArrowLeft close / parent</li>\n<li>Verify <code>*</code> expands siblings only at the focused level</li>\n<li>Verify typeahead (single, multi-character, hidden items ignored, own text only)</li>\n<li>Verify Enter and Space activate</li>\n<li>Verify pass-through attributes</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li><strong>Designers</strong>: Indicate expanded state and the focused item clearly; do not rely on colour alone.</li>\n<li><strong>Developers</strong>: Keep <code>aria-expanded</code> in sync if you also toggle folders by click (a click handler can flip the attribute). Mark files as <code>aria-selected</code> as you need.</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>tree-nav</code> — a navigation landmark containing a tree of links</li>\n<li><code>tree-list</code> — a simpler hierarchical list</li>\n<li><code>listbox</code> — a flat selectable list</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>WAI-ARIA Tree View Pattern: <a href=\"https://www.w3.org/WAI/ARIA/apg/patterns/treeview/\">https://www.w3.org/WAI/ARIA/apg/patterns/treeview/</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<ul class=\"file-tree\" role=\"tree\" aria-label=\"Project files\"><li role=\"treeitem\" aria-expanded=\"true\" tabindex=\"0\">src<ul role=\"group\"><li role=\"treeitem\" tabindex=\"-1\">index.ts</li><li role=\"treeitem\" aria-expanded=\"false\" tabindex=\"-1\">components<ul role=\"group\"><li role=\"treeitem\" tabindex=\"-1\">Button.svelte</li></ul></li></ul></li><li role=\"treeitem\" tabindex=\"-1\">README.md</li></ul>";
  const svelteSource: string = "// In your Svelte component:\nimport FileTree from \"lily-design-system-svelte-headless/components/FileTree/FileTree.svelte\";\n\n<FileTree>\n  <!-- content -->\n</FileTree>\n";
  const usageCode: string = "<FileTree label=\"Project files\">\n  <li role=\"treeitem\" aria-expanded=\"true\" aria-selected=\"false\">src\n    <ul role=\"group\">\n      <li role=\"treeitem\" aria-selected=\"false\">index.ts</li>\n    </ul>\n  </li>\n  <li role=\"treeitem\" aria-selected=\"false\">readme.md</li>\n</FileTree>\n";
  const variants: { title: string; html: string }[] = [{"title":"Folder collapsed","html":"<ul class=\"file-tree\" role=\"tree\" aria-label=\"Project files\"><li role=\"treeitem\" aria-expanded=\"false\" tabindex=\"0\">src<ul role=\"group\"><li role=\"treeitem\" tabindex=\"-1\">index.ts</li></ul></li><li role=\"treeitem\" tabindex=\"-1\">README.md</li></ul>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>FileTree — Lily Design System</title>
  <meta name="description" content="FileTree is a headless tree widget for folders and files following the WAI-ARIA tree pattern. The consumer supplies &lt;li role=&quot;treeitem&quot;&gt; items (folders carry aria-expanded and a nested &lt;ul role=&quot;group&quot;&gt;); the root owns the keyboard and a roving tabindex." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/file-tree/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: file-tree</li>
      <li>PascalCase: FileTree</li>
      <li>Description: a hierarchical tree of folders and files with expandable folders</li>
      <li>Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)</li>
      <li>HTML tag: &lt;ul&gt;</li>
      <li>CSS class: .file-tree</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li><code>role="tree"</code> and <code>aria-label=&#123;label&#125;</code> on the root</li>
      <li>Consumer supplies <code>role="treeitem"</code>, <code>role="group"</code>, <code>aria-expanded</code> (folders) and <code>aria-selected</code></li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab: moves focus into the tree to the single tab-stop item, and out of it</li>
      <li>ArrowDown / ArrowUp: next / previous visible item (no wrap)</li>
      <li>ArrowRight: on a closed folder opens it; on an open folder moves to its first child</li>
      <li>ArrowLeft: on an open folder closes it; otherwise moves to the parent folder</li>
      <li>Home / End: first / last visible item</li>
      <li><code>*</code>: expands all closed sibling folders at the focused level</li>
      <li>Printable characters: typeahead to the next visible item whose text starts with the typed characters</li>
      <li>Enter / Space: activates the focused item</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>className</code>: string (default: <code>""</code>) -- CSS class name appended to the base class</li>
      <li><code>label</code>: string (required) -- accessible name via <code>aria-label</code></li>
      <li><code>children</code>: slot -- the tree items</li>
      <li><code>...restProps</code>: unknown -- additional attributes spread onto the <code>&lt;ul&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
