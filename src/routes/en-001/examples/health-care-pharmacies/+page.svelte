<!--
  Example: choosing a community pharmacy and finding which minor ailments it can help with. Pharmacies list their
  services and today's hours in words; choosing one reports the outcome in a status line. Invented pharmacies.
-->
<script lang="ts">
  import HealthShell from '#lib/components/HealthShell.svelte';

  type Pharmacy = { id: string; name: string; area: string; open: string; opensNow: boolean; services: string[] };
  const pharmacies: Pharmacy[] = [
    { id: 'p1', name: 'Greenfield Pharmacy', area: 'Greenfield', open: 'Open until 18:30 today', opensNow: true, services: ['Minor ailments', 'Sore throat test and treat', 'Discharge medicines review', 'Flu vaccination'] },
    { id: 'p2', name: 'Station Road Pharmacy', area: 'Station Road', open: 'Closed. Opens 09:00 tomorrow', opensNow: false, services: ['Minor ailments', 'Emergency contraception'] },
    { id: 'p3', name: 'Lakeside Late Pharmacy', area: 'Lakeside', open: 'Open until 22:00 today', opensNow: true, services: ['Minor ailments', 'Discharge medicines review', 'Emergency contraception', 'Flu vaccination'] }
  ];
  const ailments = ['Indigestion', 'Athlete’s foot', 'Constipation', 'Diarrhoea', 'Head lice', 'Teething', 'Nappy rash', 'Colic', 'Threadworms', 'Acne', 'Hay fever', 'Back pain', 'Cold sores', 'Sore throat', 'Mouth ulcers', 'Conjunctivitis', 'Dry eye'];

  let q = $state('');
  let service = $state('');
  let chosen = $state('');
  let status = $state('');
  const allServices = [...new Set(pharmacies.flatMap((p) => p.services))];

  const shown = $derived(pharmacies.filter((p) => (service ? p.services.includes(service) : true)));
  const matches = $derived(ailments.filter((a) => a.toLowerCase().includes(q.trim().toLowerCase())));

  function choose(p: Pharmacy) {
    chosen = p.id;
    status = `${p.name} is now your chosen pharmacy. You can change it at any time.`;
  }
</script>

<HealthShell pageTitle="Choose a pharmacy" current="health-care-pharmacies">
  <h1>Choose a pharmacy</h1>
  <p>Pick the pharmacy you want to use, and check whether a minor ailment is one a pharmacist can help with without a doctor’s appointment.</p>

  <div class="hc-status" role="status">{status || (chosen ? '' : 'You have not chosen a pharmacy yet.')}</div>

  <div class="hc-grid">
    <section class="hc-card" aria-labelledby="ph-find">
      <h2 id="ph-find">Pharmacies near you</h2>
      <div class="hc-field">
        <label for="ph-service">Show pharmacies offering</label>
        <select id="ph-service" class="select" bind:value={service}>
          <option value="">Any service</option>
          {#each allServices as s (s)}<option value={s}>{s}</option>{/each}
        </select>
      </div>
      <ul class="ph-list">
        {#each shown as p (p.id)}
          <li data-state={p.opensNow ? 'good' : 'neutral'} class="ph-item">
            <h3>{p.name}</h3>
            <p>{p.area} · <span class="hc-pill" data-state={p.opensNow ? 'good' : 'neutral'}>{p.open}</span></p>
            <ul class="ph-services">
              {#each p.services as s (s)}<li>{s}</li>{/each}
            </ul>
            {#if chosen === p.id}
              <p><span class="hc-pill" data-state="good">Your chosen pharmacy</span></p>
            {:else}
              <button type="button" class="button" onclick={() => choose(p)}>Choose this pharmacy<span class="hc-vh">: {p.name}</span></button>
            {/if}
          </li>
        {/each}
      </ul>
      {#if shown.length === 0}<p>No pharmacy offers that service nearby.</p>{/if}
    </section>

    <section class="hc-card" aria-labelledby="ph-ail">
      <h2 id="ph-ail">Can a pharmacist help?</h2>
      <p>Treatment or advice may be offered for these minor ailments at a pharmacy that provides the minor ailments service.</p>
      <div class="hc-field">
        <label for="ph-q">Search the list</label>
        <input id="ph-q" class="text-input" type="search" bind:value={q} />
      </div>
      <p role="status">{matches.length} of {ailments.length} shown</p>
      <ul class="ph-ailments">
        {#each matches as a (a)}<li>{a}</li>{/each}
      </ul>
      <p class="ph-warn"><strong>Not on the list, or getting worse?</strong> Speak to a doctor, or call the 24-hour health helpline.</p>
    </section>
  </div>
</HealthShell>

<style>
  .ph-list,
  .ph-services,
  .ph-ailments {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .ph-list {
    display: grid;
    gap: 0.75rem;
  }
  .ph-item {
    padding: 0.75rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-radius: var(--lily-radius-md, 0.5rem);
  }
  .ph-item h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
  }
  .ph-services {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.75rem;
    margin-block-end: 0.5rem;
    font-size: 0.875rem;
  }
  .ph-services li::before {
    content: '• ';
  }
  .ph-ailments {
    columns: 10rem 2;
  }
  .ph-warn {
    margin-block-start: 0.75rem;
  }
</style>
