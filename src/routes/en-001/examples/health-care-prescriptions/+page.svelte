<!--
  Example: an inpatient medicines chart. Prescriptions are listed with dose, route and frequency; a grid shows each
  scheduled dose's state in words; recording a dose reports the outcome in a status line and keeps focus where it was.
  Allergies sit above the chart. Invented patient and medicines; nothing here is dosing advice.
-->
<script lang="ts">
  import HealthShell from '#lib/components/HealthShell.svelte';

  type Dose = { time: string; state: 'Given' | 'Due' | 'Overdue' | 'Not given' | 'Not yet due'; note?: string };
  type Rx = { id: string; drug: string; dose: string; route: string; freq: string; prn: boolean; doses: Dose[] };

  let items = $state<Rx[]>([
    { id: 'r1', drug: 'Paracetamol', dose: '1 g', route: 'Oral', freq: 'Four times a day', prn: false, doses: [{ time: '06:00', state: 'Given' }, { time: '12:00', state: 'Given' }, { time: '18:00', state: 'Due' }, { time: '24:00', state: 'Not yet due' }] },
    { id: 'r2', drug: 'Amoxicillin', dose: '500 mg', route: 'Oral', freq: 'Three times a day', prn: false, doses: [{ time: '08:00', state: 'Given' }, { time: '14:00', state: 'Overdue' }, { time: '22:00', state: 'Not yet due' }] },
    { id: 'r3', drug: 'Enoxaparin', dose: '40 mg', route: 'Subcutaneous', freq: 'Once a day', prn: false, doses: [{ time: '18:00', state: 'Due' }] },
    { id: 'r4', drug: 'Ondansetron', dose: '4 mg', route: 'Oral', freq: 'When needed, up to 3 times a day', prn: true, doses: [] }
  ]);
  const times = ['06:00', '08:00', '12:00', '14:00', '18:00', '22:00', '24:00'];

  let status = $state('');
  const tone = (s: Dose['state']) => (s === 'Given' ? 'good' : s === 'Overdue' ? 'bad' : s === 'Due' ? 'warn' : 'neutral');

  function record(rx: Rx, time: string, as: 'Given' | 'Not given') {
    const d = rx.doses.find((x) => x.time === time);
    if (!d) return;
    d.state = as;
    status = `${rx.drug} ${rx.dose} at ${time} recorded as ${as.toLowerCase()}.`;
  }
  const overdue = $derived(items.flatMap((r) => r.doses.filter((d) => d.state === 'Overdue').map((d) => `${r.drug} at ${d.time}`)));
</script>

<HealthShell pageTitle="Medicines chart" current="health-care-prescriptions">
  <h1>Medicines chart</h1>

  <section class="hc-card rx-patient" aria-label="Patient">
    <p><strong>Example patient</strong> · 72 years · Female · Ward 4, bed 12 · Hospital number M0000456</p>
    <p class="rx-allergy"><strong>Allergies:</strong> penicillin (rash, recorded 2019). Weight 61 kg, recorded today.</p>
  </section>

  {#if overdue.length}
    <div class="hc-status" style="border-inline-start-color: var(--color-error)">
      <strong>Overdue:</strong> {overdue.join('; ')}
    </div>
  {/if}
  <div class="hc-status" role="status">{status || 'Choose “Given” or “Not given” on a due or overdue dose to record it.'}</div>

  <section class="hc-card" aria-labelledby="rx-chart">
    <h2 id="rx-chart">Today’s doses</h2>
    <div class="hc-scroll">
      <table class="table rx-table">
        <caption class="hc-vh">Scheduled doses by time, today</caption>
        <thead>
          <tr>
            <th scope="col">Medicine</th>
            <th scope="col">Dose, route</th>
            {#each times as t (t)}<th scope="col">{t}</th>{/each}
          </tr>
        </thead>
        <tbody>
          {#each items.filter((r) => !r.prn) as rx (rx.id)}
            <tr>
              <th scope="row">{rx.drug}<br /><span class="rx-freq">{rx.freq}</span></th>
              <td>{rx.dose}, {rx.route}</td>
              {#each times as t (t)}
                {@const d = rx.doses.find((x) => x.time === t)}
                <td>
                  {#if d}
                    <span class="hc-pill" data-state={tone(d.state)}>{d.state}</span>
                    {#if d.state === 'Due' || d.state === 'Overdue'}
                      <span class="rx-actions">
                        <button type="button" class="button" onclick={() => record(rx, t, 'Given')}>Given<span class="hc-vh">: {rx.drug} at {t}</span></button>
                        <button type="button" class="button" onclick={() => record(rx, t, 'Not given')}>Not given<span class="hc-vh">: {rx.drug} at {t}</span></button>
                      </span>
                    {/if}
                  {:else}
                    <span class="hc-vh">Not scheduled</span><span aria-hidden="true">–</span>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section class="hc-card" aria-labelledby="rx-prn">
    <h2 id="rx-prn">When needed</h2>
    <ul>
      {#each items.filter((r) => r.prn) as rx (rx.id)}
        <li><strong>{rx.drug}</strong> {rx.dose}, {rx.route}. {rx.freq}. <span class="hc-pill" data-state="neutral">No dose given today</span></li>
      {/each}
    </ul>
  </section>

  <section class="hc-card" aria-labelledby="rx-all">
    <h2 id="rx-all">All prescriptions</h2>
    <div class="hc-scroll">
      <table class="table rx-table">
        <caption class="hc-vh">Current prescriptions</caption>
        <thead><tr><th scope="col">Medicine</th><th scope="col">Dose</th><th scope="col">Route</th><th scope="col">Frequency</th><th scope="col">Type</th></tr></thead>
        <tbody>
          {#each items as rx (rx.id)}
            <tr><th scope="row">{rx.drug}</th><td>{rx.dose}</td><td>{rx.route}</td><td>{rx.freq}</td><td>{rx.prn ? 'When needed' : 'Regular'}</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</HealthShell>

<style>
  .rx-patient {
    margin-block-end: 0.75rem;
  }
  .rx-patient p {
    margin: 0 0 0.25rem;
  }
  .rx-allergy {
    color: var(--lily-error-text, var(--color-error));
  }
  .rx-table {
    inline-size: 100%;
  }
  .rx-table td,
  .rx-table th {
    vertical-align: top;
    min-inline-size: 5.5rem;
    overflow-wrap: break-word;
    word-break: normal;
  }
  .rx-freq {
    font-size: 0.75rem;
    font-weight: 400;
  }
  .rx-actions {
    display: grid;
    gap: 0.25rem;
    margin-block-start: 0.25rem;
  }
  :global(.rx-actions .button) {
    font-size: 0.75rem;
    padding-inline: 0.5rem;
  }
</style>
