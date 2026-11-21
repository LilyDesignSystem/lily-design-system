<script lang="ts">
  import StylesNav from '#lib/components/StylesNav.svelte';

  const principles = [
    {
      title: 'Accessible before anything else',
      rule: 'The target is WCAG 2.2 AAA and the WAI-ARIA Authoring Practices keyboard patterns. A component that cannot be used from the keyboard, or has no accessible name, is unfinished.',
      check: 'Unit tests assert roles, names and keys; every demo page is swept with axe.'
    },
    {
      title: 'Worldwide, never national',
      rule: 'No default currency, weekend, language, calendar or name shape. Where a standard is regional, say so and offer the equivalent for other regions.',
      check: 'A script fails the build on a single-region default in shipped code.'
    },
    {
      title: 'Headless means no visual decisions',
      rule: 'Components ship semantic markup, ARIA, focus and keyboard behaviour. Colour, spacing, type and motion belong to the theme.',
      check: 'A forbidden-literal list is enforced: no hex values, font sizes or breakpoints in a component.'
    },
    {
      title: 'Native before scripted',
      rule: 'Use the platform’s dialog, popover, details and form controls first. Hand-written behaviour is the exception and records why.',
      check: 'Every overlay documents its native-platform decision, and a script keeps the record in step.'
    },
    {
      title: 'Say it in words',
      rule: 'Status, validity and selection are never carried by colour or a picture alone. Pair a mark with text, even if the text is hidden visually.',
      check: 'Examples write every status mark in words; themes are checked for focus and contrast.'
    },
    {
      title: 'Every string belongs to the reader',
      rule: 'A component holds no user-facing English. Labels, plurals and messages arrive as props, and text built around a value comes from a template.',
      check: 'A script fails on a built English string; 64 label packs show the pattern.'
    },
    {
      title: 'Claim only what is proved',
      rule: 'Say “targets”, not “complies”. State what is tested, what is not, and what a person still has to check.',
      check: 'The accessibility statement separates verified from unverified, and generated reports come from test evidence.'
    },
    {
      title: 'Portable and open',
      rule: 'The same catalogue in many frameworks, plain CSS themes, no CSS framework dependency, and every rule written where a contributor can read it.',
      check: 'Parity scripts compare each framework port against the reference.'
    }
  ];
</script>

<svelte:head>
  <title>Principles — Lily Design System</title>
  <meta
    name="description"
    content="The eight principles behind Lily's decisions, each with the check that enforces it."
  />
</svelte:head>

<section class="page-intro">
  <h1>Principles</h1>
  <p class="page-intro-tagline">
    A principle is useful only if it ends an argument and something checks it. Each of these has both.
  </p>
</section>

<section class="prose">
  <StylesNav current="principles" />

  <h2>When to use these</h2>
  <p>
    Use them when two good options disagree: a prettier colour against a clearer label, a clever widget against a
    native control. Decide by the principle, then record the decision beside the component so the next person does not
    reopen it.
  </p>

  <ol class="principles">
    {#each principles as p (p.title)}
      <li>
        <h3>{p.title}</h3>
        <p>{p.rule}</p>
        <p><strong>How it is checked.</strong> {p.check}</p>
      </li>
    {/each}
  </ol>

  <h2>When principles conflict</h2>
  <p>
    Take them in this order: access for every person first, then worldwide reach, then the headless boundary, then
    everything else. A visually richer design never outranks one more person being able to use the service.
  </p>

  <div class="callout">
    <p>
      The principles are the short version. The full specification, with acceptance criteria and sources, is in the
      <a href="https://github.com/LilyDesignSystem/lily-design-system/tree/main/spec">spec directory</a>.
    </p>
  </div>
</section>

<style>
  .principles {
    padding-inline-start: 1.25rem;
  }
  .principles li {
    margin-block-end: 1.5rem;
  }
  .principles h3 {
    margin-block-end: 0.25rem;
  }
</style>
