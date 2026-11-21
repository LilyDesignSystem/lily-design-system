<!--
  Example: one list of a person's medicines drawn from several settings. Each row says where the record came from,
  when it was last updated, and whether the sources agree, in words. Filter by source; compare two sources side by
  side. The list is read-only, and says so. Invented person and medicines.
-->
<script lang="ts">
  import HealthShell from '#lib/components/HealthShell.svelte';

  type Source = 'GP practice' | 'Community pharmacy' | 'Hospital';
  type Med = { drug: string; sources: Partial<Record<Source, string>>; status: 'Active' | 'Stopped' | 'Changed'; updated: string; from: Source };
  const meds: Med[] = [
    { drug: 'Metformin', sources: { 'GP practice': '500 mg twice a day', 'Community pharmacy': '500 mg twice a day', Hospital: '500 mg twice a day' }, status: 'Active', updated: '2026-10-30', from: 'GP practice' },
    { drug: 'Ramipril', sources: { 'GP practice': '5 mg once a day', 'Community pharmacy': '5 mg once a day', Hospital: '10 mg once a day' }, status: 'Changed', updated: '2026-11-12', from: 'Hospital' },
    { drug: 'Atorvastatin', sources: { 'GP practice': '20 mg at night', 'Community pharmacy': '20 mg at night' }, status: 'Active', updated: '2026-09-02', from: 'GP practice' },
    { drug: 'Amoxicillin', sources: { Hospital: '500 mg three times a day, 5 days' }, status: 'Stopped', updated: '2026-11-15', from: 'Hospital' },
    { drug: 'Salbutamol inhaler', sources: { 'Community pharmacy': '2 puffs when needed' }, status: 'Active', updated: '2026-08-21', from: 'Community pharmacy' }
  ];
  const sources: Source[] = ['GP practice', 'Community pharmacy', 'Hospital'];

  let filter = $state<'All' | Source>('All');
  let cmpA = $state<Source>('GP practice');
  let cmpB = $state<Source>('Hospital');

  const shown = $derived(filter === 'All' ? meds : meds.filter((m) => m.sources[filter as Source] !== undefined));

  function agree(m: Med): { text: string; state: string } {
    const vals = Object.values(m.sources);
    if (vals.length === 1) return { text: `Recorded by one source only`, state: 'neutral' };
    return new Set(vals).size === 1 ? { text: 'Sources agree', state: 'good' } : { text: 'Sources differ: check before changing', state: 'warn' };
  }
  const tone = (s: Med['status']) => (s === 'Active' ? 'good' : s === 'Changed' ? 'warn' : 'neutral');
  const diffs = $derived(
    meds.filter((m) => m.sources[cmpA] !== undefined || m.sources[cmpB] !== undefined).map((m) => ({
      drug: m.drug,
      a: m.sources[cmpA] ?? 'Not recorded',
      b: m.sources[cmpB] ?? 'Not recorded'
    }))
  );
</script>

<HealthShell pageTitle="Shared medicines list" current="health-care-shared-medicines">
  <h1>Medicines list</h1>

  <section class="hc-card sm-patient" aria-label="Person">
    <p><strong>Example person</strong> · 63 years · Female · Allergies: none recorded</p>
    <p>List gathered <time datetime="2026-11-21T08:15">21 Nov 2026, 08:15</time> from three sources. This list is read-only: change a medicine in the system that owns the record.</p>
  </section>

  <section class="hc-card" aria-labelledby="sm-list">
    <h2 id="sm-list">All medicines</h2>
    <fieldset class="sm-fs">
      <legend>Show medicines recorded by</legend>
      {#each ['All', ...sources] as s (s)}
        <label class="sm-opt"><input type="radio" class="radio-input" name="src" value={s} bind:group={filter} /> {s}</label>
      {/each}
    </fieldset>
    <p role="status">{shown.length} of {meds.length} medicines shown</p>
    <div class="hc-scroll">
      <table class="table sm-table">
        <caption class="hc-vh">Medicines across sources</caption>
        <thead><tr><th scope="col">Medicine</th><th scope="col">Status</th>{#each sources as s (s)}<th scope="col">{s}</th>{/each}<th scope="col">Check</th><th scope="col">Last updated</th></tr></thead>
        <tbody>
          {#each shown as m (m.drug)}
            {@const a = agree(m)}
            <tr>
              <th scope="row">{m.drug}</th>
              <td><span class="hc-pill" data-state={tone(m.status)}>{m.status}</span></td>
              {#each sources as s (s)}<td>{m.sources[s] ?? 'Not recorded'}</td>{/each}
              <td><span class="hc-pill" data-state={a.state}>{a.text}</span></td>
              <td><time datetime={m.updated}>{m.updated}</time> by {m.from}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="hc-card" aria-labelledby="sm-cmp">
    <h2 id="sm-cmp">Compare two sources</h2>
    <div class="sm-pick">
      <div class="hc-field"><label for="sm-a">First source</label>
        <select id="sm-a" class="select" bind:value={cmpA}>{#each sources as s (s)}<option>{s}</option>{/each}</select></div>
      <div class="hc-field"><label for="sm-b">Second source</label>
        <select id="sm-b" class="select" bind:value={cmpB}>{#each sources as s (s)}<option>{s}</option>{/each}</select></div>
    </div>
    {#if cmpA === cmpB}
      <p>Choose two different sources to compare.</p>
    {:else}
      <div class="hc-scroll">
        <table class="table sm-table">
          <caption class="hc-vh">Comparison of {cmpA} and {cmpB}</caption>
          <thead><tr><th scope="col">Medicine</th><th scope="col">{cmpA}</th><th scope="col">{cmpB}</th><th scope="col">Result</th></tr></thead>
          <tbody>
            {#each diffs as d (d.drug)}
              <tr>
                <th scope="row">{d.drug}</th><td>{d.a}</td><td>{d.b}</td>
                <td><span class="hc-pill" data-state={d.a === d.b ? 'good' : 'warn'}>{d.a === d.b ? 'Same' : 'Different'}</span></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</HealthShell>

<style>
  .sm-patient p {
    margin: 0 0 0.25rem;
  }
  .sm-fs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    margin: 0 0 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-base-300, currentColor);
  }
  .sm-opt {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
  }
  .sm-table {
    inline-size: 100%;
  }
  .sm-table td,
  .sm-table th {
    vertical-align: top;
    min-inline-size: 6rem;
    overflow-wrap: break-word;
    word-break: normal;
  }
  .sm-pick {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
  }
</style>
