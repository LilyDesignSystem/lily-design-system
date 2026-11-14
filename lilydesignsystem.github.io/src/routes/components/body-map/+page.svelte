<script lang="ts">
  // Rendered from components/slug/index.md — regenerate with bin/generate-site-pages, do not edit.
  const intro: string = "<h1>Body Map</h1>\n<p>BodyMap is a headless picker for marking regions of the body, such as wound or pain sites: a <code>&lt;fieldset&gt;</code> named by its <code>&lt;legend&gt;</code>, holding the consumer&#39;s drawing and a list of real checkboxes, one per region. Lily ships no drawing.</p>\n<p><strong>Status:</strong> experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow.</p>\n";
  const usage: string = "<h2>Usage</h2>\n<pre tabindex=\"0\"><code class=\"language-html\">&lt;BodyMap label=&quot;Where is the pain?&quot; name=&quot;sites&quot; regions={[{ id: &quot;head&quot;, label: &quot;Head&quot; }, { id: &quot;chest&quot;, label: &quot;Chest&quot; }]}&gt;\n  &lt;svg viewBox=&quot;0 0 40 80&quot;&gt;\n    &lt;circle data-region=&quot;head&quot; cx=&quot;20&quot; cy=&quot;8&quot; r=&quot;7&quot; /&gt;\n    &lt;rect data-region=&quot;chest&quot; x=&quot;10&quot; y=&quot;17&quot; width=&quot;20&quot; height=&quot;22&quot; /&gt;\n  &lt;/svg&gt;\n&lt;/BodyMap&gt;\n</code></pre>\n";
  const rest: string = "<h2>Props</h2>\n<ul>\n<li><code>label</code>: string (required) — the question, rendered as the <code>&lt;legend&gt;</code></li>\n<li><code>regions</code>: { id, label }[] (required) — the regions, in the order the list shows them</li>\n<li><code>selected</code>: string[] (optional) — the chosen region ids (bindable or controlled)</li>\n<li><code>name</code>: string (optional) — the checkboxes&#39; form name</li>\n<li><code>children</code>: slot (optional) — the drawing; mark each clickable shape with <code>data-region</code></li>\n<li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>\n</ul>\n<h2>Keyboard Interactions</h2>\n<table>\n<thead>\n<tr>\n<th>Key</th>\n<th>Action</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>Tab</td>\n<td>Moves to the next region checkbox</td>\n</tr>\n<tr>\n<td>Space</td>\n<td>Toggles the focused region</td>\n</tr>\n</tbody></table>\n<h2>ARIA</h2>\n<ul>\n<li>A native <code>&lt;fieldset&gt;</code> named by its <code>&lt;legend&gt;</code>; each checkbox is named by the region&#39;s words. The drawing is <code>aria-hidden</code>, since its shapes are not focusable; the list is the equivalent</li>\n</ul>\n<h2>When to Use</h2>\n<ul>\n<li>Use to record where a symptom, wound or injury is, on a drawing people recognise.</li>\n<li>Use where several regions may be chosen at once.</li>\n</ul>\n<h2>When Not to Use</h2>\n<ul>\n<li>Do not rely on the drawing alone; the region list is the accessible control and must stay visible.</li>\n<li>Do not use for a single choice of region — use <code>radio-group</code>.</li>\n</ul>\n<h2>Headless</h2>\n<p>This headless component ships zero CSS and decides nothing visual. The consumer provides all styling targeting the <code>.body-map</code> class hook, and every word.</p>\n<h2>Styles</h2>\n<p><code>.body-map</code> and its parts, and <code>[data-selected]</code> on the drawing&#39;s shapes.</p>\n<h2>Testing</h2>\n<ul>\n<li>The legend names the group; the drawing is hidden; each region is a checkbox</li>\n<li>Space toggles a region; a click on a shape toggles it where script runs</li>\n<li>Chosen regions submit with the form</li>\n</ul>\n<h2>Advice</h2>\n<ul>\n<li>Name each region in the words patients and clinicians both use; offer left and right from the patient&#39;s side, and say so.</li>\n<li>Draw front and back views as two body maps, or as two groups of shapes with distinct region ids.</li>\n</ul>\n<h2>Implementation Notes</h2>\n<ul>\n<li>Renders <code>&lt;fieldset class=&quot;body-map&quot;&gt;</code> with a <code>&lt;legend&gt;</code>, the drawing in <code>.body-map-figure</code> (<code>aria-hidden</code>), and <code>.body-map-regions</code>, a list of checkboxes</li>\n<li>The checkboxes are the control: they submit with the form under <code>name</code>, and a keyboard or screen-reader user chooses with them</li>\n<li>Where script runs, a click on a drawing shape marked <code>data-region</code> toggles its checkbox, and chosen shapes get <code>data-selected</code> for the theme (Svelte, React, Vue, Angular, Web Components)</li>\n<li>Blazor cannot read the click or mark shapes without JS interop: its <code>Drawing</code> fragment receives the chosen ids, so the consumer marks its own shapes; HTML, Nunjucks and Alpine leave the drawing to the consumer&#39;s script</li>\n</ul>\n<h2>Related components</h2>\n<ul>\n<li><code>checkbox-group</code> — a group of checkbox inputs</li>\n<li><code>figure</code> — a figure with a caption</li>\n</ul>\n<h2>References</h2>\n<ul>\n<li>Spec: spec/healthcare-ui/index.md</li>\n</ul>\n<hr>\n<p>Lily™ and Lily Design System™ are trademarks.</p>\n";
  // BEGIN auto-generated component example consts
  const demoHtml: string = "<fieldset class=\"body-map\"><legend class=\"body-map-legend\">Where is the pain?</legend><div class=\"body-map-figure\" aria-hidden=\"true\"><svg viewBox=\"0 0 40 80\" width=\"80\" height=\"160\"><circle data-region=\"head\" cx=\"20\" cy=\"8\" r=\"7\"></circle><rect data-region=\"chest\" x=\"10\" y=\"17\" width=\"20\" height=\"22\"></rect></svg></div><ul class=\"body-map-regions\"><li><label class=\"body-map-region\"><input type=\"checkbox\" name=\"sites\" value=\"head\"> Head</label></li><li><label class=\"body-map-region\"><input type=\"checkbox\" name=\"sites\" value=\"chest\"> Chest</label></li></ul></fieldset>";
  const svelteSource: string = "// In your Svelte component:\nimport BodyMap from \"lily-design-system-svelte-headless/components/BodyMap/BodyMap.svelte\";\n\n<BodyMap>\n  <!-- content -->\n</BodyMap>\n";
  const usageCode: string = "<BodyMap label=\"Where is the pain?\" name=\"sites\" regions={[{ id: \"head\", label: \"Head\" }, { id: \"chest\", label: \"Chest\" }]}>\n  <svg viewBox=\"0 0 40 80\">\n    <circle data-region=\"head\" cx=\"20\" cy=\"8\" r=\"7\" />\n    <rect data-region=\"chest\" x=\"10\" y=\"17\" width=\"20\" height=\"22\" />\n  </svg>\n</BodyMap>\n";
  const variants: { title: string; html: string }[] = [];
  // END auto-generated component example consts
</script>

<svelte:head>
  <title>BodyMap — Lily Design System</title>
  <meta name="description" content="BodyMap is a headless picker for marking regions of the body, such as wound or pain sites: a &lt;fieldset&gt; named by its &lt;legend&gt;, holding the consumer's drawing and a list of real checkboxes, one per region. Lily ships no drawing." />
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
    <a href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/components/body-map/AGENTS.md">canonical metadata</a>
    — the machine-checked source the implementations are held to.
  </p>
    <h3>Metadata</h3>
    <ul>
      <li>Component: body-map</li>
      <li>PascalCase: BodyMap</li>
      <li>Description: a picker for marking regions of the body on a consumer-supplied drawing, with a checkbox for each region</li>
      <li>Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow</li>
      <li>HTML tag: &lt;fieldset&gt;</li>
      <li>CSS class: .body-map</li>
      <li>Interactive: yes</li>
    </ul>
    <h3>ARIA</h3>
    <ul>
      <li>A native <code>&lt;fieldset&gt;</code> named by its <code>&lt;legend&gt;</code>; each checkbox is named by the region's words. The drawing is <code>aria-hidden</code>, since its shapes are not focusable; the list is the equivalent</li>
    </ul>
    <h3>Keyboard</h3>
    <ul>
      <li>Tab moves through the checkboxes; Space toggles one</li>
    </ul>
    <h3>Props</h3>
    <ul>
      <li><code>label</code>: string (required) — the question, rendered as the <code>&lt;legend&gt;</code></li>
      <li><code>regions</code>: &#123; id, label &#125;[] (required) — the regions, in the order the list shows them</li>
      <li><code>selected</code>: string[] (optional) — the chosen region ids (bindable or controlled)</li>
      <li><code>name</code>: string (optional) — the checkboxes' form name</li>
      <li><code>children</code>: slot (optional) — the drawing; mark each clickable shape with <code>data-region</code></li>
      <li><code>...restProps</code>: any — additional HTML attributes spread onto the root</li>
    </ul>
</section>
<!-- END generated: canonical contract -->
