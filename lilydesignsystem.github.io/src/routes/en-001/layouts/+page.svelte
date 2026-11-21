<script lang="ts">
  import StylesNav from '#lib/components/StylesNav.svelte';

  const breakpoints = [
    { name: 'Narrow', from: 'Base rules, no query', use: 'The default layout. Every page starts here, at 320 CSS pixels.' },
    { name: 'Wide', from: '48rem (768px at default size)', use: 'A sidebar appears, a list becomes a table, columns split.' }
  ];
  const spaces = [
    { token: '--lily-space-xs', rem: '0.25rem' },
    { token: '--lily-space-sm', rem: '0.5rem' },
    { token: '--lily-space-md', rem: '1rem' },
    { token: '--lily-space-lg', rem: '1.5rem' },
    { token: '--lily-space-xl', rem: '2rem' }
  ];
  const widths = ['narrower', 'narrow', 'normal', 'wide', 'wider'];

  const cq = `.card-host { container-type: inline-size; }
@container (min-width: 30rem) {
  .card { display: grid; grid-template-columns: 8rem 1fr; }
}`;
  const grid = `.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: var(--lily-space-md);
}`;
</script>

<svelte:head>
  <title>Layouts — Lily Design System</title>
  <meta
    name="description"
    content="Lily's layout rules: intrinsic sizing, a spacing scale, container queries, logical properties and reflow at 320 pixels."
  />
</svelte:head>

<section class="page-intro">
  <h1>Layouts</h1>
  <p class="page-intro-tagline">
    Let content size the layout first, then add a breakpoint only when the arrangement truly changes. The result works
    from a phone to a wall display, and in any language or reading direction.
  </p>
</section>

<section class="prose">
  <StylesNav current="layouts" />

  <h2>When to use these rules</h2>
  <p>
    For every page and every component, because the headless layer ships no layout. The themes and your own CSS decide
    it, and these rules keep the two consistent.
  </p>

  <h2>When to leave them</h2>
  <p>
    A full-screen workspace, a canvas tool or an embedded third-party application may need its own layout. Keep the
    same accessibility floor: reflow, focus that is never hidden, and targets large enough to press.
  </p>

  <h2>Rules</h2>
  <ol>
    <li><strong>Start narrow.</strong> The base rules are the small-screen layout; queries add width with <code>min-width</code>.</li>
    <li><strong>Size by content.</strong> Reach for <code>minmax()</code>, <code>clamp()</code>, <code>flex-wrap</code> and <code>auto-fit</code> before a breakpoint.</li>
    <li><strong>Breakpoints in <code>rem</code>,</strong> so they follow the reader’s font size.</li>
    <li><strong>Components ask their container; page shells ask the window.</strong></li>
    <li><strong>Logical properties</strong> (<code>inline-size</code>, <code>margin-inline</code>) so right-to-left needs no second stylesheet.</li>
    <li><strong>No horizontal scrolling at 320 pixels,</strong> and none at 400 percent zoom. A wide table scrolls inside its own labelled region, never the page.</li>
    <li><strong>Never <code>width: 100vw</code></strong> on a full-width block; it includes the scrollbar.</li>
  </ol>

  <h2>Breakpoints</h2>
  <table>
    <caption>The themes’ breakpoints</caption>
    <thead><tr><th scope="col">Name</th><th scope="col">From</th><th scope="col">What changes</th></tr></thead>
    <tbody>
      {#each breakpoints as b (b.name)}
        <tr><th scope="row">{b.name}</th><td>{b.from}</td><td>{b.use}</td></tr>
      {/each}
    </tbody>
  </table>

  <h2>Spacing scale</h2>
  <p>
    Five steps, in <code>rem</code>, and two fluid values (<code>--space-fluid-gutter</code>,
    <code>--space-fluid-section</code>) that grow with the viewport between a floor and a ceiling. Bars below are drawn
    with the tokens themselves.
  </p>
  <ul class="space-scale">
    {#each spaces as s (s.token)}
      <li>
        <code>{s.token}</code>
        <span>{s.rem}</span>
        <span class="bar" style={`inline-size: var(${s.token}, ${s.rem});`}></span>
      </li>
    {/each}
  </ul>

  <h2>Line length</h2>
  <p>
    Five content-width tokens cap a line of text so it stays readable:
    {#each widths as w, i (w)}<code>--content-width-{w}</code>{i < widths.length - 1 ? ', ' : '.'}{/each}
  </p>

  <h2>Components ask their container</h2>
  <p>
    A card should care about the room it is given, not the window. Drag the corner of the box below to resize it; the
    card changes arrangement at 30rem of its own width.
  </p>
  <div class="resizer" tabindex="0" role="group" aria-label="Resizable container demonstration">
    <div class="card-host">
      <div class="demo-card">
        <div class="demo-media" aria-hidden="true"></div>
        <div>
          <h3>Adaptive card</h3>
          <p>Stacks when narrow and puts the media beside the text once its container is wide enough.</p>
        </div>
      </div>
    </div>
  </div>
  <pre><code>{cq}</code></pre>

  <h2>A grid that needs no breakpoint</h2>
  <pre><code>{grid}</code></pre>

  <h2>The five-region page</h2>
  <p>
    Many applications use one shell: a header, a left and a right aside, a main area and a footer. Lily’s grail layout
    components give it semantic landmarks; the theme decides when the asides collapse.
  </p>
  <div class="grail" aria-hidden="true">
    <div class="g header">Header</div>
    <div class="g left">Left aside</div>
    <div class="g main">Main</div>
    <div class="g right">Right aside</div>
    <div class="g footer">Footer</div>
  </div>

  <h2>Check it</h2>
  <ul>
    <li>Open the page at 320 pixels wide, then at 400 percent zoom. Nothing should need sideways scrolling.</li>
    <li>Set the text size to the largest step and switch to a right-to-left language.</li>
    <li>Fix a bar to an edge? Set <code>--lily-fixed-bar-block-end</code> so a focused control is never hidden behind it.</li>
  </ul>
</section>

<style>
  .space-scale {
    display: grid;
    gap: 0.5rem;
    margin: 0 0 1.5rem;
    padding: 0;
    list-style: none;
  }
  .space-scale li {
    display: grid;
    grid-template-columns: minmax(9rem, 12rem) 5rem 1fr;
    align-items: center;
    gap: 0.5rem 1rem;
  }
  .bar {
    block-size: 0.75rem;
    background: var(--color-primary, currentColor);
    border-radius: 999px;
  }
  .resizer {
    resize: horizontal;
    overflow: auto;
    min-inline-size: 12rem;
    max-inline-size: 100%;
    inline-size: 100%;
    padding: 0.75rem;
    border: 2px dashed var(--color-base-300, currentColor);
    margin-block-end: 1rem;
  }
  .card-host {
    container-type: inline-size;
  }
  .demo-card {
    display: grid;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--lily-radius-md, 0.5rem);
    background: var(--color-base-100, Canvas);
  }
  .demo-media {
    block-size: 5rem;
    background: var(--color-primary, currentColor);
    border-radius: var(--lily-radius-sm, 0.25rem);
  }
  @container (min-width: 30rem) {
    .demo-card {
      grid-template-columns: 8rem 1fr;
    }
    .demo-media {
      block-size: auto;
    }
  }
  .grail {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 3fr) minmax(0, 1fr);
    grid-template-areas:
      'header header header'
      'left main right'
      'footer footer footer';
    gap: 0.5rem;
    margin-block-end: 1.5rem;
  }
  .g {
    padding: 0.75rem;
    border: 1px solid var(--color-base-300, currentColor);
    background: var(--color-base-200, Canvas);
    text-align: center;
  }
  .header { grid-area: header; }
  .left { grid-area: left; }
  .main { grid-area: main; min-block-size: 5rem; background: var(--color-base-100, Canvas); }
  .right { grid-area: right; }
  .footer { grid-area: footer; }
  @media (max-width: 30rem) {
    .space-scale li {
      grid-template-columns: minmax(0, 1fr);
    }
    .grail {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: 'header' 'main' 'left' 'right' 'footer';
    }
  }
</style>
