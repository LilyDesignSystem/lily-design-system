<!--
  Example: finding a dental practice that is taking new patients. A search with filters, results whose availability is
  written in words, and a waiting-list request that reports its outcome in a status line. Invented practices.
-->
<script lang="ts">
  import HealthShell from '#lib/components/HealthShell.svelte';

  type Practice = {
    id: string;
    name: string;
    area: string;
    km: number;
    adults: boolean;
    children: boolean;
    urgent: boolean;
    wait: string;
    stepFree: boolean;
    languages: string[];
    phone: string;
  };
  const practices: Practice[] = [
    { id: 'a', name: 'Riverside Dental Practice', area: 'Riverside', km: 0.8, adults: true, children: true, urgent: false, wait: 'No wait', stepFree: true, languages: ['English', 'Arabic'], phone: '01632 960001' },
    { id: 'b', name: 'Hillcrest Family Dental', area: 'Hillcrest', km: 1.9, adults: false, children: true, urgent: true, wait: 'About 4 months', stepFree: true, languages: ['English'], phone: '01632 960002' },
    { id: 'c', name: 'Marketplace Dental Care', area: 'Town centre', km: 2.4, adults: true, children: false, urgent: true, wait: 'About 9 weeks', stepFree: false, languages: ['English', 'Polish'], phone: '01632 960003' },
    { id: 'd', name: 'Parkside Dentists', area: 'Parkside', km: 3.6, adults: false, children: false, urgent: false, wait: 'Waiting list closed', stepFree: true, languages: ['English', 'Hindi', 'Urdu'], phone: '01632 960004' },
    { id: 'e', name: 'Harbour Dental Surgery', area: 'Harbour', km: 5.2, adults: true, children: true, urgent: true, wait: 'About 3 weeks', stepFree: true, languages: ['English'], phone: '01632 960005' }
  ];

  let postcode = $state('');
  let need = $state<'any' | 'adults' | 'children' | 'urgent'>('any');
  let stepFreeOnly = $state(false);
  let sort = $state<'distance' | 'wait'>('distance');
  let searched = $state(false);
  let status = $state('');
  let listed = $state<string[]>([]);

  const shown = $derived(
    practices
      .filter((p) => (need === 'adults' ? p.adults : need === 'children' ? p.children : need === 'urgent' ? p.urgent : true))
      .filter((p) => (stepFreeOnly ? p.stepFree : true))
      .toSorted((a, b) => (sort === 'distance' ? a.km - b.km : Number(b.adults || b.children) - Number(a.adults || a.children) || a.km - b.km))
  );

  function availability(p: Practice): { text: string; state: string } {
    if (p.adults && p.children) return { text: 'Taking new adults and children', state: 'good' };
    if (p.adults) return { text: 'Taking new adults only', state: 'good' };
    if (p.children) return { text: 'Taking new children only', state: 'warn' };
    return { text: 'Not taking new patients', state: 'bad' };
  }

  function search(e: SubmitEvent) {
    e.preventDefault();
    searched = true;
    status = postcode.trim()
      ? `${shown.length} practices found near ${postcode.trim()}.`
      : `${shown.length} practices found. Add a postcode to sort by real distance.`;
  }
  function join(p: Practice) {
    if (!listed.includes(p.id)) listed = [...listed, p.id];
    status = `You have asked to join the waiting list at ${p.name}. The practice will contact you; nothing is booked yet.`;
  }
</script>

<HealthShell pageTitle="Find a dental practice" current="health-care-dental-access">
  <h1>Find a dental practice taking new patients</h1>
  <p>Search by postcode. Each practice says in words whether it is taking new patients, and how long people wait.</p>

  <form class="hc-card dn-form" onsubmit={search}>
    <div class="hc-field">
      <label for="dn-postcode">Postcode (optional)</label>
      <input id="dn-postcode" class="text-input" type="text" autocomplete="postal-code" bind:value={postcode} />
    </div>
    <fieldset class="dn-fs">
      <legend>I am looking for</legend>
      {#each [['any', 'Any new patients'], ['adults', 'An adult'], ['children', 'A child'], ['urgent', 'Urgent care']] as [v, l] (v)}
        <label class="dn-opt"><input type="radio" class="radio-input" name="need" value={v} bind:group={need} /> {l}</label>
      {/each}
    </fieldset>
    <label class="dn-opt"><input type="checkbox" class="checkbox-input" bind:checked={stepFreeOnly} /> Step-free access only</label>
    <div class="hc-field">
      <label for="dn-sort">Sort by</label>
      <select id="dn-sort" class="select" bind:value={sort}>
        <option value="distance">Distance</option>
        <option value="wait">Taking patients first</option>
      </select>
    </div>
    <button type="submit" class="button button-primary">Search</button>
  </form>

  <div class="hc-status" role="status">{status || 'Choose what you need, then search.'}</div>

  {#if searched}
    <h2>{shown.length} {shown.length === 1 ? 'practice' : 'practices'}</h2>
    {#if shown.length === 0}
      <p>No practice matches. Try removing a filter, or call the dental helpline.</p>
    {/if}
    <ul class="dn-results">
      {#each shown as p (p.id)}
        {@const a = availability(p)}
        <li class="hc-card" data-state={a.state}>
          <h3>{p.name}</h3>
          <p><span class="hc-pill" data-state={a.state}>{a.text}</span></p>
          <dl class="dn-dl">
            <div><dt>Area</dt><dd>{p.area}, {p.km} km away</dd></div>
            <div><dt>Waiting time</dt><dd>{p.wait}</dd></div>
            <div><dt>Step-free access</dt><dd>{p.stepFree ? 'Yes' : 'No'}</dd></div>
            <div><dt>Languages</dt><dd>{p.languages.join(', ')}</dd></div>
            <div><dt>Telephone</dt><dd><a href={`tel:${p.phone.replace(/\s/g, '')}`}>{p.phone}</a></dd></div>
          </dl>
          {#if a.state === 'bad'}
            <p>This practice is not taking new patients. Choose another practice.</p>
          {:else if listed.includes(p.id)}
            <p><span class="hc-pill" data-state="good">On the waiting list</span></p>
          {:else}
            <button type="button" class="button" onclick={() => join(p)}>Join the waiting list<span class="hc-vh"> at {p.name}</span></button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</HealthShell>

<style>
  .dn-form {
    display: grid;
    gap: 0.75rem;
    max-inline-size: 36rem;
  }
  .dn-fs {
    display: grid;
    gap: 0.25rem;
    margin: 0;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-base-300, currentColor);
  }
  .dn-opt {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
  }
  .dn-results {
    display: grid;
    gap: 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .dn-dl {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0.5rem 1rem;
    margin: 0 0 0.75rem;
  }
  .dn-dl dt {
    font-size: 0.8125rem;
    font-weight: 700;
  }
  .dn-dl dd {
    margin: 0;
  }
</style>
