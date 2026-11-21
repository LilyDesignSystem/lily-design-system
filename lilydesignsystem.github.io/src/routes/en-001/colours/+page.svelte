<script lang="ts">
  import { onMount } from 'svelte';
  import StylesNav from '#lib/components/StylesNav.svelte';

  type Role = { id: string; label: string; use: string };
  const roles: Role[] = [
    { id: 'primary', label: 'Primary', use: 'The one main action in a view, and the strongest brand colour.' },
    { id: 'secondary', label: 'Secondary', use: 'Supporting actions and links.' },
    { id: 'accent', label: 'Accent', use: 'A small, deliberate highlight.' },
    { id: 'neutral', label: 'Neutral', use: 'Chrome: bars, badges, quiet surfaces.' },
    { id: 'info', label: 'Info', use: 'Helpful, non-urgent messages.' },
    { id: 'success', label: 'Success', use: 'A completed or healthy state.' },
    { id: 'warning', label: 'Warning', use: 'Something to check before continuing.' },
    { id: 'error', label: 'Error', use: 'A failure or a blocking problem.' }
  ];
  const surfaces = [
    { id: 'base-100', label: 'Base 100', use: 'The page and card surface.' },
    { id: 'base-200', label: 'Base 200', use: 'A recessed area behind cards.' },
    { id: 'base-300', label: 'Base 300', use: 'Borders and dividers.' }
  ];

  // Every pair the guidance says must be readable: a fill with its own content colour, and body text on each surface.
  type Pair = { name: string; fg: string; bg: string; ratio: number | null; pass: string };
  const pairDefs = [
    ...roles.map((r) => ({ name: `${r.label} fill with its content`, fg: `--color-${r.id}-content`, bg: `--color-${r.id}` })),
    ...surfaces.map((s) => ({ name: `Body text on ${s.label}`, fg: '--color-base-content', bg: `--color-${s.id}` }))
  ];
  let pairs = $state<Pair[]>(pairDefs.map((p) => ({ ...p, ratio: null, pass: 'Measuring…' })));
  let themeName = $state('');

  // Colours may be written in any CSS colour syntax, so a one-pixel canvas turns each into sRGB bytes.
  function rgb(css: string): [number, number, number] {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const x = c.getContext('2d', { willReadFrequently: true })!;
    x.fillStyle = '#000';
    x.fillStyle = css;
    x.fillRect(0, 0, 1, 1);
    const d = x.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  }
  function luminance([r, g, b]: [number, number, number]): number {
    const f = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function ratioOf(fg: string, bg: string): number {
    const a = luminance(rgb(fg));
    const b = luminance(rgb(bg));
    const [hi, lo] = a > b ? [a, b] : [b, a];
    return (hi + 0.05) / (lo + 0.05);
  }
  function verdict(r: number): string {
    if (r >= 7) return 'Passes AAA (7:1) and AA (4.5:1)';
    if (r >= 4.5) return 'Passes AA (4.5:1), not AAA';
    if (r >= 3) return 'Fails AA for text; fine only for large text or a boundary (3:1)';
    return 'Fails: below 3:1';
  }
  function measure() {
    const cs = getComputedStyle(document.documentElement);
    themeName = document.documentElement.dataset.theme || 'default';
    pairs = pairDefs.map((p) => {
      const r = ratioOf(cs.getPropertyValue(p.fg).trim(), cs.getPropertyValue(p.bg).trim());
      return { ...p, ratio: r, pass: verdict(r) };
    });
  }

  onMount(() => {
    measure();
    // A theme change swaps the stylesheet after data-theme changes, so measure again shortly afterwards.
    let timer: ReturnType<typeof setTimeout>;
    const again = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 400);
    };
    const mo = new MutationObserver(again);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    mo.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
    return () => {
      mo.disconnect();
      clearTimeout(timer);
    };
  });

  const overlay = `:root[data-brand="example"] {
  --color-primary: oklch(42% 0.14 262);
  --color-primary-content: oklch(100% 0 0);
  --lily-brand: oklch(42% 0.14 262);
  --lily-on-brand: oklch(100% 0 0);
}`;
</script>

<svelte:head>
  <title>Colours — Lily Design System</title>
  <meta
    name="description"
    content="Lily's colour roles and a live contrast table for the theme you have chosen."
  />
</svelte:head>

<section class="page-intro">
  <h1>Colours</h1>
  <p class="page-intro-tagline">
    Colours are named for the job they do, not the shade they are. Every theme fills in the same roles, so a component
    never knows which palette it wears.
  </p>
</section>

<section class="prose">
  <StylesNav current="colours" />

  <h2>When to use colour</h2>
  <p>
    Use colour to group related things, to separate actions from content and to point at what needs attention. Take
    every colour from a role token, such as <code>--color-primary</code>, never from a literal value.
  </p>

  <h2>When not to use colour</h2>
  <p>
    Never let colour carry meaning alone. A red border is not an error message; a green dot is not “done”. Write the
    state in words, and use colour as a second cue. Never use a brand colour for text or a control’s edge unless it
    passes 4.5:1.
  </p>

  <h2>The roles</h2>
  <p>
    Each swatch below is painted with the live theme (<strong>{themeName || 'default'}</strong>). Use the header’s
    theme picker and watch them change.
  </p>
  <ul class="swatches">
    {#each roles as r (r.id)}
      <li style={`background: var(--color-${r.id}); color: var(--color-${r.id}-content);`}>
        <strong>{r.label}</strong>
        <span>{r.use}</span>
        <code>--color-{r.id}</code>
      </li>
    {/each}
  </ul>

  <h3>Surfaces and text</h3>
  <ul class="swatches">
    {#each surfaces as s (s.id)}
      <li style={`background: var(--color-${s.id}); color: var(--color-base-content); border: 1px solid var(--color-base-300);`}>
        <strong>{s.label}</strong>
        <span>{s.use}</span>
        <code>--color-{s.id}</code>
      </li>
    {/each}
  </ul>

  <h2>Pairs</h2>
  <p>
    Every fill has a matching <code>-content</code> colour for the text on it. Always use them together. Body text is
    <code>--color-base-content</code> on the three base surfaces. Muted text is the body colour mixed toward its
    surface, never a free-standing grey.
  </p>

  <h2>Live contrast check</h2>
  <p>
    This table measures the pairs of the theme you are using, in your browser, against WCAG 2.2: 4.5:1 for normal
    text (AA) and 7:1 for AAA. The reference <code>light</code> and <code>dark</code> themes must pass AA; other themes
    are the user’s choice, so their failures are reported rather than blocked.
  </p>
  <div class="scroll" role="region" aria-label="Contrast table" tabindex="0">
    <table>
      <caption>Contrast of colour pairs in the current theme</caption>
      <thead>
        <tr><th scope="col">Pair</th><th scope="col">Sample</th><th scope="col">Ratio</th><th scope="col">Result</th></tr>
      </thead>
      <tbody>
        {#each pairs as p (p.name)}
          <tr>
            <th scope="row">{p.name}</th>
            <td>
              <span class="chip" style={`color: var(${p.fg}); background: var(${p.bg});`}>Aa</span>
            </td>
            <td>{p.ratio === null ? '…' : `${p.ratio.toFixed(2)}:1`}</td>
            <td>{p.pass}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Links, focus and brand</h2>
  <ul>
    <li><strong>Links</strong> keep an underline, so they are not found by colour alone, and the visited and hover states each have their own token.</li>
    <li><strong>Focus</strong> is a 2px outline with a 2px offset in <code>--lily-focus-ring</code>, at least 3:1 against the page, and <code>3px solid Highlight</code> in forced-colours mode.</li>
    <li><strong>Brand</strong> colour (<code>--lily-brand</code>, <code>--lily-on-brand</code>) is for bands, rules and logo backgrounds only.</li>
    <li><strong>Charts</strong> use <code>--lily-chart-color-1</code> to <code>-6</code>, always with a pattern, shape or label as well.</li>
  </ul>

  <h2>Make it yours without forking</h2>
  <p>
    Write a brand overlay: one rule on <code>:root[data-brand]</code>, loaded after the theme, setting only documented
    tokens. A colour pair is set together and must be at least 4.5:1.
  </p>
  <pre><code>{overlay}</code></pre>

  <h2>Dark, high-contrast and forced colours</h2>
  <p>
    Dark and high-contrast are themes in their own right, switched with <code>data-theme</code>. When the operating
    system forces colours, Lily’s themes step back and let system colours through; nothing relies on a background image.
  </p>
</section>

<style>
  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
    gap: 0.75rem;
    margin: 0 0 1.5rem;
    padding: 0;
    list-style: none;
  }
  .swatches li {
    display: grid;
    gap: 0.25rem;
    padding: 0.75rem;
    border-radius: var(--lily-radius-md, 0.5rem);
    min-block-size: 6rem;
  }
  .swatches code {
    background: transparent;
    color: inherit;
    font-size: 0.8125rem;
  }
  .scroll {
    overflow-x: auto;
  }
  .chip {
    display: inline-block;
    padding: 0.125rem 0.75rem;
    border-radius: 0.25rem;
    border: 1px solid var(--color-base-300, currentColor);
    font-weight: 700;
  }
</style>
