<svelte:head>
  <title>Lily + Figma — Lily Design System</title>
  <meta
    name="description"
    content="There is no maintained Lily Figma library or plugin. The 45 reference themes' design tokens are published in DTCG format and can be imported into Figma today with an existing community plugin."
  />
</svelte:head>

<section class="hero">
  <p class="hero-eyebrow">Lily + Figma</p>
  <h1>No maintained Figma library — here's what exists instead</h1>
  <p class="hero-tagline">
    This page used to say "coming soon." It doesn't anymore, because nobody
    was building it. Here is the honest state, and a real path that works
    today.
  </p>
</section>

<section class="prose" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
  <h2>What doesn't exist</h2>
  <p>
    There is no official Lily component library in Figma, and no maintained
    Figma plugin. Building and maintaining a design-tool library well is a
    real, ongoing commitment — Figma component structure, variant naming,
    auto-layout, a publish pipeline of its own — separate from maintaining
    code, and this project has not taken it on.
  </p>

  <h2>What exists today</h2>
  <p>
    Each of the 45 reference themes has its design-token primitives —
    colour, radius, size, border — published in
    <a href="https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/"
      >DTCG 2025.10 format</a
    >
    at
    <a
      href="https://github.com/LilyDesignSystem/lily-design-system/tree/main/themes/tokens"
      ><code>themes/tokens/*.json</code></a
    >. That format is exactly what modern token tooling reads. You can pull a
    Lily theme's palette into Figma yourself, right now, with no plugin from
    this project:
  </p>
  <ol>
    <li>
      Install the community
      <a href="https://tokens.studio/">Tokens Studio for Figma</a>
      plugin (or Figma's own Variables import, where your plan supports DTCG
      import).
    </li>
    <li>
      Import <code>themes/tokens/{`{theme-slug}`}.json</code> for whichever
      theme you want — for example
      <code>united-kingdom-national-health-service-england-for-patients.json</code>.
    </li>
    <li>
      Tokens Studio creates Figma variables from the DTCG values, which you
      can then apply to your own components.
    </li>
  </ol>
  <p>
    This gets you Lily's colours and shape tokens in Figma. It does not get
    you Lily's actual components as Figma components — nobody has built
    that, and this page will not pretend otherwise.
  </p>

  <h2>Is a real Figma library planned?</h2>
  <p>
    Not currently, and it isn't free to promise: see
    <a
      href="https://github.com/LilyDesignSystem/lily-design-system/blob/main/RFC.md#rfc-6-is-45-reference-themes-useful-or-should-this-be-a-token-system"
      >RFC 6</a
    >
    for the open question and what would change the project's mind — most
    usefully, a designer saying specifically what they need from this layer.
    If that's you,
    <a href="mailto:joel@joelparkerhenderson.com">say so</a>
    or open an issue.
  </p>
</section>
