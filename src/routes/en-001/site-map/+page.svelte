<script lang="ts">
  type Link = { href: string; label: string };
  type Group = { heading: string; links: Link[] };

  const groups: Group[] = [
    {
      heading: 'Start here',
      links: [
        { href: '/', label: 'Home' },
        { href: '/why/', label: 'Why Lily' },
        { href: '/getting-started/', label: 'Getting started' },
        { href: '/how-the-pieces-fit/', label: 'How the pieces fit' },
        { href: '/help/', label: 'Help' },
        { href: '/about/', label: 'About' }
      ]
    },
    {
      heading: 'Components',
      links: [
        { href: '/components/', label: 'All components' },
        { href: '/recipes/', label: 'Recipes' },
        { href: '/patterns/motion/', label: 'Motion patterns' },
        { href: '/label-packs/', label: 'Label packs' },
        { href: '/markdown-editor/', label: 'Markdown editor' }
      ]
    },
    {
      heading: 'Style guide',
      links: [
        { href: '/en-001/styles/', label: 'All styles' },
        { href: '/en-001/principles/', label: 'Principles' },
        { href: '/en-001/colours/', label: 'Colours' },
        { href: '/en-001/typographies/', label: 'Typographies' },
        { href: '/en-001/icons/', label: 'Icons' },
        { href: '/en-001/layouts/', label: 'Layouts' },
        { href: '/en-001/templates/', label: 'Templates' },
        { href: '/theme-contrast/', label: 'Theme contrast table' }
      ]
    },
    {
      heading: 'Tutorials',
      links: [
        { href: '/tutorials/', label: 'All tutorials' },
        { href: '/tutorials/alpine/', label: 'Alpine.js' },
        { href: '/tutorials/angular/', label: 'Angular' },
        { href: '/tutorials/blazor/', label: 'Blazor' },
        { href: '/tutorials/html/', label: 'HTML' },
        { href: '/tutorials/nunjucks/', label: 'Nunjucks' },
        { href: '/tutorials/react/', label: 'React' },
        { href: '/tutorials/solid/', label: 'Solid' },
        { href: '/tutorials/svelte/', label: 'Svelte' },
        { href: '/tutorials/vue/', label: 'Vue' },
        { href: '/tutorials/web-components/', label: 'Web Components' },
        { href: '/tutorials/helpers/', label: 'Helpers' },
        { href: '/tutorials/forms/', label: 'Forms' },
        { href: '/tutorials/theming/', label: 'Theming' },
        { href: '/tutorials/worldwide/', label: 'Worldwide' },
        { href: '/tutorials/shadcn/', label: 'shadcn-compatible registry' },
        { href: '/training/', label: 'Training' }
      ]
    },
    {
      heading: 'Examples',
      links: [
        { href: '/examples/', label: 'Examples by framework' },
        { href: '/demo/svelte/', label: 'Dashboard demonstration' },
        { href: '/en-001/examples/health-care-dental-access/', label: 'Dental access' },
        { href: '/en-001/examples/health-care-test-requests/', label: 'Test requests' },
        { href: '/en-001/examples/health-care-pharmacies/', label: 'Pharmacies' },
        { href: '/en-001/examples/health-care-prescriptions/', label: 'Prescriptions' },
        { href: '/en-001/examples/health-care-continuous-patient-monitoring/', label: 'Continuous patient monitoring' },
        { href: '/en-001/examples/health-care-shared-medicines/', label: 'Shared medicines' },
        { href: '/examples/welsh-clinical-portal/', label: 'Clinician results screen' },
        { href: '/examples/epic-emr-patient-lists-patient-lookup/', label: 'Chart index' },
        { href: '/examples/epic-emr-patient-summary-overview/', label: 'Chart summary overview' },
        { href: '/examples/epic-emr-patient-summary-overview-vital-signs/', label: 'Chart summary: vital signs' },
        { href: '/examples/epic-emr-patient-surgical-specialty/', label: 'Patient list' }
      ]
    },
    {
      heading: 'Decide and migrate',
      links: [
        { href: '/compare/', label: 'Comparisons with other design systems' },
        { href: '/migrating/from-bootstrap/', label: 'Migrating from Bootstrap' },
        { href: '/skills/', label: 'Agent skills' },
        { href: '/lily-figma/', label: 'Lily in Figma' },
        { href: '/lily-claude-design/', label: 'Lily in Claude Design' },
        { href: '/optimize/', label: 'Optimise' }
      ]
    },
    {
      heading: 'Project',
      links: [
        { href: '/news/', label: 'News' },
        { href: '/roadmap/', label: 'Roadmap' },
        { href: '/quality/', label: 'Quality' },
        { href: '/locales/', label: 'Languages' },
        { href: '/accessibility/', label: 'What “targets WCAG 2.2 AAA” means' }
      ]
    },
    {
      heading: 'Policies',
      links: [
        { href: '/en-001/accessibility-statement/', label: 'Accessibility statement' },
        { href: '/en-001/cookie-policy/', label: 'Cookie policy' },
        { href: '/en-001/privacy-policy/', label: 'Privacy policy' },
        { href: '/en-001/terms-of-use/', label: 'Terms of use' },
        { href: '/en-001/site-map/', label: 'Site map' }
      ]
    }
  ];
</script>

<svelte:head>
  <title>Site map — Lily Design System</title>
  <meta name="description" content="An overview of every section of the Lily website, with a link to each page." />
</svelte:head>

<section class="page-intro">
  <h1>Site map</h1>
  <p class="page-intro-tagline">An overview of the Lily website. The site is also available in many languages; use the language control in the header.</p>
</section>

<section class="prose">
  <div class="map">
    {#each groups as g (g.heading)}
      <section aria-labelledby={`sm-${g.heading.replace(/[^a-z]+/gi, '-').toLowerCase()}`}>
        <h2 id={`sm-${g.heading.replace(/[^a-z]+/gi, '-').toLowerCase()}`}>{g.heading}</h2>
        <ul>
          {#each g.links as l (l.href)}
            <li><a href={l.href}>{l.label}</a></li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
  <p>
    Machines can read the full list, including every language and every component, in the
    <a href="/sitemap.xml">XML sitemap</a>.
  </p>
</section>

<style>
  .map {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
    gap: 0.5rem 2rem;
  }
  .map h2 {
    font-size: 1.125rem;
  }
  .map ul {
    margin-block-start: 0;
  }
</style>
