<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Picture</h1>\n<p>A headless wrapper for a responsive image that lets the browser choose among several sources, using the native picture element.</p>\n<p><strong>Status:</strong> beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.</p>\n<p>The component renders the native <code>&lt;picture&gt;</code> element. The consumer supplies the <code>&lt;source&gt;</code> children (each with <code>srcset</code>, and optionally <code>media</code>, <code>type</code> and <code>sizes</code>) and a final <code>&lt;img&gt;</code> that carries the <code>src</code>, the <code>alt</code> text, and the <code>width</code> and <code>height</code>. The browser picks the first source that matches, or falls back to the <code>&lt;img&gt;</code>. The component adds no ARIA, draws nothing and carries no strings of its own.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-svelte\">&lt;Picture&gt;\n  &lt;source\n    srcset=&quot;/images/lily-wide.avif&quot;\n    media=&quot;(min-width: 48rem)&quot;\n    type=&quot;image/avif&quot;\n  /&gt;\n  &lt;source\n    srcset=&quot;/images/lily-wide.webp&quot;\n    media=&quot;(min-width: 48rem)&quot;\n    type=&quot;image/webp&quot;\n  /&gt;\n  &lt;img\n    src=&quot;/images/lily-narrow.jpg&quot;\n    alt=&quot;A white lily in bloom&quot;\n    width=&quot;640&quot;\n    height=&quot;400&quot;\n  /&gt;\n&lt;/Picture&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<table>\n<thead>\n<tr>\n<th>Prop</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody><tr>\n<td><code>class</code></td>\n<td>string</td>\n<td><code>&quot;&quot;</code></td>\n<td>Appended to the base class</td>\n</tr>\n<tr>\n<td><code>children</code></td>\n<td>slot</td>\n<td>—</td>\n<td>The <code>&lt;source&gt;</code> elements, then one <code>&lt;img&gt;</code></td>\n</tr>\n<tr>\n<td><code>...restProps</code></td>\n<td>HTML attributes</td>\n<td>—</td>\n<td>Spread onto the root <code>&lt;picture&gt;</code></td>\n</tr>\n</tbody></table>\n<h2>Keyboard Interactions</h2>\n<ul>\n<li>None. The element is not focusable.</li>\n</ul>\n<h2>ARIA</h2>\n<ul>\n<li>No ARIA is added; the native <code>&lt;picture&gt;</code> carries no role of its own and the <code>&lt;img&gt;</code> inside it supplies the accessible name through <code>alt</code></li>\n<li>Do not put <code>aria-label</code> on the <code>&lt;picture&gt;</code>: it has no role to name. Describe the image with the <code>&lt;img&gt;</code>&#39;s <code>alt</code>, or wrap both in a <code>Figure</code> with a <code>Caption</code></li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Art direction: showing a different crop of the image at different viewport widths</li>\n<li>Offering modern formats (AVIF, WebP) with a JPEG or PNG fallback</li>\n<li>Switching images by media condition, such as a dark-mode or print variant</li>\n<li>Anywhere an <code>Image</code> is not enough because the browser needs more than one source to choose from</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Use <code>Image</code> — one source, with optional caption, and <code>srcset</code>/<code>sizes</code> on the <code>&lt;img&gt;</code> itself handles plain resolution switching</li>\n<li>Use <code>Figure</code> and <code>Caption</code> — to give an image a visible caption (a <code>Picture</code> can sit inside a <code>Figure</code>)</li>\n<li>Use <code>ImageFileInput</code> — choosing an image from the user&#39;s device</li>\n<li>Use <code>Avatar</code> — a person or organisation image with a fallback</li>\n<li>Use a CSS background — for a purely decorative picture that carries no information</li>\n</ul>\n<h2>Headless</h2>\n<p>This component decides semantics only: the element and the class hook. It decides no sizing, aspect ratio, object-fit, border, radius or loading behaviour.</p>\n<h2>Styles</h2>\n<p>Target <code>.picture</code>. A <code>&lt;picture&gt;</code> is <code>display: inline</code> by default and is only a wrapper, so the useful rules go on the <code>&lt;img&gt;</code> inside it (see Advice). The reference themes do not restyle it. No default styles are included in the component.</p>\n<h2>Testing</h2>\n<ul>\n<li>Renders a <code>&lt;picture&gt;</code> with class <code>picture</code> and appends the consumer class</li>\n<li>The <code>&lt;source&gt;</code> and <code>&lt;img&gt;</code> children render, and the <code>&lt;img&gt;</code>&#39;s <code>alt</code> is untouched</li>\n<li>The component adds no text of its own; rest props reach the root</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Always put the <code>&lt;img&gt;</code> last and give it <code>alt</code>, <code>width</code> and <code>height</code>. The width and height attributes let the browser reserve the right space before the file arrives, so the page does not shift as it loads. Give the <code>&lt;source&gt;</code> elements the same aspect ratio as the <code>&lt;img&gt;</code>, or the reserved space will not match.</li>\n<li>Order matters: the browser uses the first <code>&lt;source&gt;</code> that matches. Put the most specific media conditions and the newest formats first.</li>\n<li>Write <code>alt</code> for the image that is shown. If art direction changes what the picture shows, the same <code>alt</code> must still be true of every source.</li>\n<li>Style the <code>&lt;img&gt;</code>, not the <code>&lt;picture&gt;</code>: the <code>&lt;picture&gt;</code> is only a wrapper. See <code>Image</code> for the three rules (<code>display: block</code>, <code>max-inline-size: 100%</code>, <code>block-size: auto</code>).</li>\n<li>Use <code>loading=&quot;lazy&quot;</code> and <code>decoding=&quot;async&quot;</code> on the <code>&lt;img&gt;</code> for images below the fold; do not lazy-load the first image on the page.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;picture class=&quot;picture {class}&quot;&gt;</code> containing the children</li>\n<li><code>restProps</code> spread onto the <code>&lt;picture&gt;</code>; no state, no behaviour</li>\n<li>The <code>&lt;img&gt;</code> is the consumer&#39;s: it is the element that is read by assistive technology, so its <code>alt</code> is the consumer&#39;s string, supplied in the consumer&#39;s language</li>\n<li>A <code>&lt;picture&gt;</code> without an <code>&lt;img&gt;</code> child renders nothing, so always end with one</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>image</code></li>\n<li><code>figure</code></li>\n<li><code>caption</code></li>\n<li><code>image-file-input</code></li>\n<li><code>avatar</code></li>\n</ul>\n<h2>References</h2>\n<ul>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture\">MDN picture element</a></li>\n<li><a href=\"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_images#responsive_images\">MDN Responsive images</a></li>\n<li><a href=\"https://www.w3.org/WAI/tutorials/images/\">WAI Images Tutorial</a></li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<picture class=\"picture\"><source srcset=\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/3000/svg%27 width=%27640%27 height=%27300%27%3E%3Crect width=%27640%27 height=%27200%27 fill=%27%23c8d9ee%27/%3E%3C/svg%3E\" media=\"(min-width: 48rem)\" type=\"image/svg+xml\"><img src=\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27320%27 height=%27200%27%3E%3Crect width=%27320%27 height=%27200%27 fill=%27%23c8d9ee%27/%3E%3C/svg%3E\" alt=\"A pale blue rectangle standing in for a photograph\" width=\"320\" height=\"200\"></picture>";
  const svelteSource: string = "// In your Svelte component:\nimport Picture from \"lily-design-system-svelte-headless/components/Picture/Picture.svelte\";\n\n<Picture>\n  <!-- content -->\n</Picture>\n";
  const usageCode: string = "<Picture>\n  <source\n    srcset=\"wide.webp\"\n    media=\"(min-width: 800px)\"\n    type=\"image/webp\"\n  />\n  <img\n    src=\"small.jpg\"\n    alt=\"A lily in bloom\"\n    width=\"320\"\n    height=\"200\"\n  />\n</Picture>\n";
  const variants: { title: string; html: string }[] = [{"title":"Format choice with a fallback image, lazy-loaded","html":"<picture class=\"picture\"><source srcset=\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27320%27 height=%27200%27%3E%3Crect width=%27320%27 height=%27200%27 fill=%27%23c8d9ee%27/%3E%3C/svg%3E\" type=\"image/svg+xml\"><img src=\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27320%27 height=%27200%27%3E%3Crect width=%27320%27 height=%27200%27 fill=%27%23c8d9ee%27/%3E%3C/svg%3E\" alt=\"A pale blue rectangle standing in for a photograph\" width=\"320\" height=\"200\" loading=\"lazy\" decoding=\"async\"></picture>"}];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>Picture — Lily Design System</title>
  <meta name="description" content="A headless wrapper for a responsive image that lets the browser choose among several sources, using the native picture element." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/picture/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: picture</li>
      <li>PascalCase: Picture</li>
      <li>Description: a responsive image wrapper that lets the browser choose among several sources, using the native picture element</li>
      <li>Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows</li>
      <li>HTML tag: &lt;picture&gt;</li>
      <li>CSS class: .picture</li>
      <li>Interactive: no</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>None added; the <code>&lt;picture&gt;</code> has no role and the <code>&lt;img&gt;</code> inside it is named by its <code>alt</code></li>
      <li>Do not pass <code>aria-label</code> through rest props; it has nothing to name</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>None</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>class</code>: string (default: <code>""</code>) -- appended to the base class</li>
      <li><code>children</code>: slot -- the <code>&lt;source&gt;</code> elements, then one <code>&lt;img&gt;</code></li>
      <li><code>...restProps</code>: HTML attributes -- spread onto the root <code>&lt;picture&gt;</code></li>
    </ul>
</section>
<!-- END generated: canonical contract -->
