<script lang="ts">
  import StylesNav from '#lib/components/StylesNav.svelte';

  // The stroke paths, on a 16 by 16 grid, of the icons the page-header controls and the demo app use.
  const icons = [
    { id: 'home', label: 'Home', d: 'M2.5 8 8 3l5.5 5M4 7v6.5h3v-3.5h2v3.5h3V7' },
    { id: 'search', label: 'Search', d: 'M7 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM10.5 10.5l3 3' },
    { id: 'settings', label: 'Settings', d: 'M2.5 5h6M11.5 5h2M2.5 11h2M7.5 11h6M9.5 3.5v3M5.5 9.5v3' },
    { id: 'help', label: 'Help', d: 'M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM6.3 6.3a1.8 1.8 0 1 1 2.5 1.7c-.5.3-.8.7-.8 1.2M8 11.3h.01' },
    { id: 'email', label: 'Email', d: 'M2 4h12v8H2zM2.5 4.5 8 9l5.5-4.5' },
    { id: 'calendar', label: 'Calendar', d: 'M2.5 4h11v9.5h-11zM2.5 7h11M5 2.5v3M11 2.5v3' },
    { id: 'table', label: 'Table', d: 'M2.5 3h11v10h-11zM2.5 6.5h11M2.5 10h11M6.5 3v10' },
    { id: 'board', label: 'Board', d: 'M2.5 3h3v10h-3zM6.5 3h3v6h-3zM10.5 3h3v8h-3z' },
    { id: 'timeline', label: 'Timeline', d: 'M2 2v12M3.5 4h5M5.5 8h6M4 12h4.5' },
    { id: 'people', label: 'People', d: 'M6 7.5a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6zM2 13c.4-2.5 2-3.7 4-3.7s3.6 1.2 4 3.7M11 7a2 2 0 1 0 0-4M12 9.5c1.2.4 1.9 1.5 2 3' },
    { id: 'place', label: 'Place', d: 'M8 14s4.5-4 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 10 8 14 8 14zM8 8.3a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z' },
    { id: 'bolt', label: 'Quick action', d: 'M9 2 4 9h4l-1 5 5-7H8z' },
    { id: 'add', label: 'Add', d: 'M8 3v10M3 8h10' },
    { id: 'close', label: 'Close', d: 'M3.5 3.5l9 9M12.5 3.5l-9 9' },
    { id: 'check', label: 'Done', d: 'M3 8.5l3.2 3L13 4.5' },
    { id: 'arrow', label: 'Next', d: 'M2.5 8h11M9 3.5 13.5 8 9 12.5' }
  ];

  const markup = `<button type="button" class="button">
  <svg viewBox="0 0 16 16" width="1.05rem" height="1.05rem"
       aria-hidden="true" focusable="false" fill="none"
       stroke="currentColor" stroke-width="1.6"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
  </svg>
  Continue
</button>`;
  const iconOnly = `<button type="button" class="button" aria-label="Close">
  <svg viewBox="0 0 16 16" … aria-hidden="true">…</svg>
</button>`;
</script>

<svelte:head>
  <title>Icons — Lily Design System</title>
  <meta
    name="description"
    content="Lily's icon contract: one grid, one stroke, always decorative, always with a name."
  />
</svelte:head>

<section class="page-intro">
  <h1>Icons</h1>
  <p class="page-intro-tagline">
    Icons help people scan, but they mean different things to different people. Lily treats an icon as decoration that
    sits beside a name, and gives every icon one drawing contract so a set reads as a family.
  </p>
</section>

<section class="prose">
  <StylesNav current="icons" />

  <h2>When to use icons</h2>
  <ul>
    <li>To reinforce a label people already read, such as an arrow on “Continue”.</li>
    <li>To make a familiar, repeated action quick to find in a tool people use daily.</li>
    <li>To mark a status that is also written in words.</li>
  </ul>

  <h2>When not to</h2>
  <ul>
    <li>Do not let an icon be the only carrier of meaning, or replace a text label.</li>
    <li>Do not use one icon for two meanings in the same service.</li>
    <li>Do not add an icon for decoration alone.</li>
  </ul>

  <h2>The set</h2>
  <p>
    These sixteen icons are drawn from the same contract. They take the colour and size of the text beside them, so
    they follow the theme, the text size and forced-colours mode.
  </p>
  <ul class="gallery">
    {#each icons as i (i.id)}
      <li>
        <svg
          viewBox="0 0 16 16"
          width="1.75rem"
          height="1.75rem"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"><path d={i.d} /></svg
        >
        <span>{i.label}</span>
      </li>
    {/each}
  </ul>

  <h2>The contract</h2>
  <div class="scroll" role="region" aria-label="Icon contract" tabindex="0">
  <table>
    <caption>What every Lily icon must be</caption>
    <thead><tr><th scope="col">Property</th><th scope="col">Rule</th><th scope="col">Why</th></tr></thead>
    <tbody>
      <tr><th scope="row">Grid</th><td><code>viewBox="0 0 16 16"</code></td><td>One grid keeps optical size equal across the set.</td></tr>
      <tr><th scope="row">Stroke</th><td><code>stroke="currentColor"</code>, width 1.6, round caps and joins</td><td>The icon inherits the text colour, so contrast and themes just work.</td></tr>
      <tr><th scope="row">Size</th><td>In <code>rem</code>, about <code>1.05rem</code></td><td>It grows with the reader’s text size.</td></tr>
      <tr><th scope="row">Role</th><td><code>aria-hidden="true"</code>, <code>focusable="false"</code></td><td>An icon is decoration; the control’s name is the label.</td></tr>
      <tr><th scope="row">Fill</th><td><code>fill="none"</code></td><td>Strokes only, so a high-contrast theme can recolour them.</td></tr>
    </tbody>
  </table>
  </div>
  <p>A script checks all 80 bundled picker icons against this contract on every build.</p>

  <h2>Always give the control a name</h2>
  <p>With a visible label, the label is the name. The icon beside it is hidden from assistive technology.</p>
  <p>
    <button type="button" class="button button-primary">
      Continue
      <svg viewBox="0 0 16 16" width="1.05rem" height="1.05rem" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" /></svg>
    </button>
  </p>
  <pre><code>{markup}</code></pre>
  <p>
    Where space allows only an icon, put the name in <code>aria-label</code> and show a tooltip that appears on hover
    and on keyboard focus.
  </p>
  <pre><code>{iconOnly}</code></pre>

  <h2>Placement and size</h2>
  <ul>
    <li>Place an icon before its label in left-to-right text; mirror it in right-to-left only when its direction means something (an arrow does; a magnifier does not).</li>
    <li>Keep icons at one size within a control group, and give touch targets at least 44 by 44 CSS pixels on coarse pointers.</li>
    <li>Never animate an icon to attract attention; honour <code>prefers-reduced-motion</code> when you must.</li>
  </ul>

  <h2>Bring your own</h2>
  <p>
    Lily ships no icon library and no imagery. Replace a bundled icon through the component’s children, following the
    same contract, or use your own set. A new icon should earn its place with evidence that it helps people finish a
    task.
  </p>
</section>

<style>
  .scroll {
    overflow-x: auto;
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
    gap: 0.75rem;
    margin: 0 0 1.5rem;
    padding: 0;
    list-style: none;
  }
  .gallery li {
    display: grid;
    justify-items: center;
    gap: 0.25rem;
    padding: 0.75rem 0.5rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--lily-radius-md, 0.5rem);
    font-size: 0.875rem;
  }
  .button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
