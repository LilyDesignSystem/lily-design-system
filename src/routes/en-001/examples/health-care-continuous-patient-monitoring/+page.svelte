<!--
  Example: an intensive-care overview. Each bed shows its latest readings from bedside devices, an early-warning
  state in words, a trend, and when the reading was taken. Updates arrive every few seconds; they can be paused
  (WCAG 2.2.2), rows never reorder under focus, and only a change of alert state is announced. Invented, simulated data.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import HealthShell from '#lib/components/HealthShell.svelte';
  import { Sparkline } from '@lilydesignsystem/svelte-headless';

  type Bed = { id: string; label: string; person: string; hr: number; sys: number; dia: number; spo2: number; rr: number; temp: number; trend: number[] };
  let beds = $state<Bed[]>([
    { id: 'b1', label: 'Bed 1', person: 'Patient A, 66 y', hr: 88, sys: 122, dia: 74, spo2: 96, rr: 16, temp: 37.1, trend: [86, 87, 88, 89, 88, 88] },
    { id: 'b2', label: 'Bed 2', person: 'Patient B, 54 y', hr: 112, sys: 98, dia: 60, spo2: 93, rr: 22, temp: 38.4, trend: [96, 100, 104, 108, 110, 112] },
    { id: 'b3', label: 'Bed 3', person: 'Patient C, 71 y', hr: 74, sys: 134, dia: 80, spo2: 98, rr: 14, temp: 36.8, trend: [76, 75, 75, 74, 74, 74] },
    { id: 'b4', label: 'Bed 4', person: 'Patient D, 48 y', hr: 131, sys: 86, dia: 52, spo2: 89, rr: 27, temp: 39.0, trend: [110, 118, 122, 126, 129, 131] }
  ]);

  let paused = $state(false);
  let updated = $state('08:00:00');
  let announce = $state('');
  let tick = 0;

  // A simple illustrative score: counts how many readings sit outside a typical band. Not a validated clinical score.
  function level(b: Bed): { text: string; state: string; n: number } {
    let n = 0;
    if (b.hr < 50 || b.hr > 110) n += 2;
    else if (b.hr > 100) n += 1;
    if (b.sys < 90) n += 2;
    if (b.spo2 < 92) n += 2;
    else if (b.spo2 < 95) n += 1;
    if (b.rr > 24) n += 2;
    else if (b.rr > 20) n += 1;
    if (b.temp > 38.5) n += 1;
    if (n >= 5) return { text: 'Urgent review needed', state: 'bad', n };
    if (n >= 2) return { text: 'Increased monitoring', state: 'warn', n };
    return { text: 'Stable', state: 'good', n };
  }
  const prevText: Record<string, string> = {};

  function step() {
    tick++;
    const t = new Date(Date.UTC(2026, 10, 21, 8, 0, tick * 5));
    updated = t.toISOString().slice(11, 19);
    beds = beds.map((b, i) => {
      const wobble = ((tick + i * 3) % 5) - 2;
      const hr = Math.max(40, Math.min(160, b.hr + wobble));
      return { ...b, hr, trend: [...b.trend.slice(-5), hr] };
    });
    for (const b of beds) {
      const now = level(b).text;
      if (prevText[b.id] && prevText[b.id] !== now) announce = `${b.label}: now ${now.toLowerCase()}.`;
      prevText[b.id] = now;
    }
  }

  onMount(() => {
    for (const b of beds) prevText[b.id] = level(b).text;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // With reduced motion the updates start paused; the person can resume them.
    if (reduced) paused = true;
    const id = setInterval(() => {
      if (!paused) step();
    }, 5000);
    return () => clearInterval(id);
  });
</script>

<HealthShell pageTitle="Intensive care monitoring" current="health-care-continuous-patient-monitoring">
  <h1>Intensive care overview</h1>
  <p class="mo-bar">
    Readings from bedside devices. Last update <time>{updated}</time>.
    <button type="button" class="button" aria-pressed={paused} onclick={() => (paused = !paused)}>{paused ? 'Resume updates' : 'Pause updates'}</button>
  </p>
  <p class="hc-status" role="status">{announce || 'Alert changes are announced here.'}</p>

  <ul class="mo-beds">
    {#each beds as b (b.id)}
      {@const lv = level(b)}
      <li class="hc-card" data-state={lv.state}>
        <h2>{b.label} <span class="mo-person">{b.person}</span></h2>
        <p><span class="hc-pill" data-state={lv.state}>{lv.text}</span> <span class="mo-score">Illustrative score {lv.n}</span></p>
        <dl class="mo-vitals">
          <div><dt>Heart rate</dt><dd>{b.hr} <span>/min</span></dd></div>
          <div><dt>Blood pressure</dt><dd>{b.sys}/{b.dia} <span>mmHg</span></dd></div>
          <div><dt>Oxygen saturation</dt><dd>{b.spo2} <span>%</span></dd></div>
          <div><dt>Breathing rate</dt><dd>{b.rr} <span>/min</span></dd></div>
          <div><dt>Temperature</dt><dd>{b.temp.toFixed(1)} <span>°C</span></dd></div>
        </dl>
        <div class="mo-trend">
          <Sparkline label={`Heart rate, last six readings: ${b.trend.join(', ')} per minute`} class="mo-spark">
            <svg viewBox="0 0 100 24" focusable="false" aria-hidden="true">
              <polyline
                points={b.trend.map((v, i) => `${(i * 100) / (b.trend.length - 1)},${24 - ((v - Math.min(...b.trend)) / (Math.max(...b.trend) - Math.min(...b.trend) || 1)) * 20 - 2}`).join(' ')}
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </Sparkline>
          <span class="mo-trend-text">Heart rate: {b.trend[0]} to {b.trend[b.trend.length - 1]}</span>
        </div>
      </li>
    {/each}
  </ul>
  <p class="mo-legend">The state is written for every bed; colour is only a second cue. The score here is a teaching illustration, not a validated clinical score.</p>
</HealthShell>

<style>
  .mo-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
  }
  .mo-beds {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
    gap: 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .mo-beds h2 {
    font-size: 1.0625rem;
  }
  .mo-person {
    font-size: 0.8125rem;
    font-weight: 400;
  }
  .mo-score {
    font-size: 0.8125rem;
  }
  .mo-vitals {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
  .mo-vitals dt {
    font-size: 0.75rem;
    font-weight: 700;
  }
  .mo-vitals dd {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
  }
  .mo-vitals dd span {
    font-size: 0.75rem;
    font-weight: 400;
  }
  .mo-trend {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  :global(.mo-spark svg) {
    inline-size: 6rem;
    block-size: 1.5rem;
    color: var(--color-primary);
  }
  .mo-trend-text {
    font-size: 0.8125rem;
  }
  .mo-legend {
    margin-block-start: 0.75rem;
    font-size: 0.8125rem;
  }
</style>
