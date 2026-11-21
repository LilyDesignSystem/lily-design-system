<script lang="ts">
  import StylesNav from '#lib/components/StylesNav.svelte';

  const topics = [
    {
      slug: 'principles',
      title: 'Principles',
      text: 'Eight commitments that settle design arguments before they start, each with the check that enforces it.'
    },
    {
      slug: 'colours',
      title: 'Colours',
      text: 'Role-based colour tokens that every one of the 63 themes fills in, with a live contrast table for whichever theme you have chosen.'
    },
    {
      slug: 'typographies',
      title: 'Typographies',
      text: 'Font stacks that follow the reader’s language, the heading scale, line height, and the seven-step text size the reader controls.'
    },
    {
      slug: 'icons',
      title: 'Icons',
      text: 'One icon family drawn on one grid, the contract an icon must meet, and when words should do the job instead.'
    },
    {
      slug: 'layouts',
      title: 'Layouts',
      text: 'Intrinsic sizing before breakpoints, a spacing scale, container queries, logical properties and reflow at 320 pixels.'
    },
    {
      slug: 'templates',
      title: 'Templates',
      text: 'Whole-page structures for content pages, dashboards and clinical workspaces, with working examples you can open.'
    }
  ];
</script>

<svelte:head>
  <title>Styles — Lily Design System</title>
  <meta
    name="description"
    content="Lily's style guide: principles, colours, typographies, icons, layouts and page templates, all driven by the theme you choose."
  />
</svelte:head>

<section class="page-intro">
  <h1>Styles</h1>
  <p class="page-intro-tagline">
    Lily ships components with no visual decisions in them. Everything you see on these pages comes from a theme: a
    set of tokens that any of 63 reference stylesheets, or your own, fills in. Change the theme with the picker in the
    header and every specimen below changes with it.
  </p>
</section>

<section class="prose">
  <StylesNav current="styles" />

  <h2>Six topics</h2>
  <div class="card-grid">
    {#each topics as t (t.slug)}
      <a class="card" href={`/en-001/${t.slug}/`}>
        <h3 class="card-heading">{t.title}</h3>
        <p class="card-description">{t.text}</p>
        <p class="card-meta">→ {t.title}</p>
      </a>
    {/each}
  </div>

  <h2>How the styles fit together</h2>
  <ol>
    <li><strong>Tokens</strong> name roles, not values: a primary colour, a body font, a medium space.</li>
    <li><strong>Themes</strong> give every token a value, and are plain CSS files you can read and fork.</li>
    <li><strong>Components</strong> carry only a class hook such as <code>button</code> or <code>card</code>; a theme styles the hook.</li>
    <li><strong>Your service</strong> adds a brand overlay of at most twenty declarations, never a fork.</li>
  </ol>

  <div class="callout">
    <p>
      Each topic page is a specimen sheet as well as guidance. The colours, type and spacing you see are read from the
      theme live, so what you check here is what your users get.
    </p>
  </div>
</section>
