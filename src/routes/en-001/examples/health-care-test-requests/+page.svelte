<!--
  Example: requesting laboratory tests from a general practice. Choose a patient's tests from a catalogue, give the
  clinical reason and urgency, see what will be requested, then submit; a tracker shows each request's state in words.
  The form reports its errors in a summary that takes focus. Invented patient and tests.
-->
<script lang="ts">
  import HealthShell from '#lib/components/HealthShell.svelte';

  type Test = { id: string; name: string; group: string; sample: string };
  const catalogue: Test[] = [
    { id: 'fbc', name: 'Full blood count', group: 'Blood', sample: 'Purple-top tube' },
    { id: 'ufe', name: 'Urea and electrolytes', group: 'Blood', sample: 'Gold-top tube' },
    { id: 'hba1c', name: 'Glycated haemoglobin', group: 'Blood', sample: 'Purple-top tube' },
    { id: 'lft', name: 'Liver function', group: 'Blood', sample: 'Gold-top tube' },
    { id: 'msu', name: 'Urine culture', group: 'Urine', sample: 'Sterile pot' },
    { id: 'acr', name: 'Urine albumin to creatinine ratio', group: 'Urine', sample: 'Plain pot' },
    { id: 'throat', name: 'Throat swab', group: 'Swabs', sample: 'Charcoal swab' }
  ];
  const groups = [...new Set(catalogue.map((t) => t.group))];

  type Req = { ref: string; tests: string; urgency: string; state: 'Requested' | 'Collected' | 'Received at laboratory' | 'Reported'; when: string };
  let requests = $state<Req[]>([
    { ref: 'R-1042', tests: 'Full blood count', urgency: 'Routine', state: 'Reported', when: '2026-11-18' },
    { ref: 'R-1051', tests: 'Urine culture', urgency: 'Urgent', state: 'Received at laboratory', when: '2026-11-20' }
  ]);

  let selected = $state<string[]>([]);
  let urgency = $state('');
  let reason = $state('');
  let fasting = $state(false);
  let errors = $state<{ id: string; text: string }[]>([]);
  let summaryEl = $state<HTMLElement>();
  let status = $state('');

  const chosen = $derived(catalogue.filter((t) => selected.includes(t.id)));
  const samples = $derived([...new Set(chosen.map((t) => t.sample))]);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const found: { id: string; text: string }[] = [];
    if (selected.length === 0) found.push({ id: 'tr-tests', text: 'Choose at least one test' });
    if (!urgency) found.push({ id: 'tr-routine', text: 'Choose how urgent the request is' });
    if (!reason.trim()) found.push({ id: 'tr-reason', text: 'Enter the clinical reason for the request' });
    errors = found;
    status = '';
    if (found.length) {
      await Promise.resolve();
      summaryEl?.focus();
      return;
    }
    const ref = `R-${1052 + requests.length}`;
    requests = [{ ref, tests: chosen.map((t) => t.name).join(', '), urgency, state: 'Requested', when: '2026-11-21' }, ...requests];
    status = `Request ${ref} sent for ${chosen.length} ${chosen.length === 1 ? 'test' : 'tests'}. Print the labels and give the patient the sample guidance.`;
    selected = [];
    urgency = '';
    reason = '';
    fasting = false;
  }
  const tone = (s: Req['state']) => (s === 'Reported' ? 'good' : s === 'Requested' ? 'neutral' : 'warn');
</script>

<HealthShell pageTitle="Request laboratory tests" current="health-care-test-requests">
  <h1>Request laboratory tests</h1>

  <section class="hc-card tr-patient" aria-label="Patient">
    <p><strong>Example patient</strong> · 47 years · Female</p>
    <p>Hospital number M0000123 · Allergies: none recorded</p>
  </section>

  {#if errors.length}
    <div class="hc-status tr-errors" role="alert" tabindex="-1" bind:this={summaryEl} style="--hc-tone: var(--color-error); border-inline-start-color: var(--color-error)">
      <h2>There is a problem</h2>
      <ul>
        {#each errors as er (er.id)}<li><a href={`#${er.id}`}>{er.text}</a></li>{/each}
      </ul>
    </div>
  {/if}
  {#if status}<div class="hc-status" role="status">{status}</div>{/if}

  <div class="hc-grid">
    <form class="hc-card" onsubmit={submit} novalidate>
      <h2>New request</h2>
      <fieldset class="tr-fs" id="tr-tests">
        <legend>Tests</legend>
        {#each groups as g (g)}
          <h3 class="tr-gh">{g}</h3>
          {#each catalogue.filter((t) => t.group === g) as t (t.id)}
            <label class="tr-opt"><input type="checkbox" class="checkbox-input" value={t.id} bind:group={selected} /> {t.name}</label>
          {/each}
        {/each}
      </fieldset>

      <fieldset class="tr-fs">
        <legend>Urgency</legend>
        <label class="tr-opt"><input id="tr-routine" type="radio" class="radio-input" name="u" value="Routine" bind:group={urgency} /> Routine</label>
        <label class="tr-opt"><input type="radio" class="radio-input" name="u" value="Urgent" bind:group={urgency} /> Urgent (same day)</label>
      </fieldset>

      <div class="hc-field">
        <label for="tr-reason">Clinical reason</label>
        <textarea id="tr-reason" class="textarea" rows="3" bind:value={reason}></textarea>
      </div>
      <label class="tr-opt"><input type="checkbox" class="checkbox-input" bind:checked={fasting} /> Patient was fasting</label>
      <p><button type="submit" class="button button-primary">Send request</button></p>
    </form>

    <section class="hc-card" aria-labelledby="tr-sum" aria-live="polite">
      <h2 id="tr-sum">This request</h2>
      {#if chosen.length === 0}
        <p>No tests chosen yet.</p>
      {:else}
        <ul>
          {#each chosen as t (t.id)}<li>{t.name} <span class="tr-sample">({t.sample})</span></li>{/each}
        </ul>
        <p><strong>Samples to collect:</strong> {samples.join('; ')}</p>
        <p>{fasting ? 'Fasting sample noted.' : 'Fasting not recorded.'}</p>
      {/if}
    </section>
  </div>

  <section class="hc-card" aria-labelledby="tr-track">
    <h2 id="tr-track">Requests for this patient</h2>
    <div class="hc-scroll">
      <table class="table tr-table">
        <caption class="hc-vh">Requests, newest first</caption>
        <thead><tr><th scope="col">Reference</th><th scope="col">Tests</th><th scope="col">Urgency</th><th scope="col">State</th><th scope="col">Date</th></tr></thead>
        <tbody>
          {#each requests as r (r.ref)}
            <tr>
              <th scope="row">{r.ref}</th><td>{r.tests}</td><td>{r.urgency}</td>
              <td><span class="hc-pill" data-state={tone(r.state)}>{r.state}</span></td>
              <td><time datetime={r.when}>{r.when}</time></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</HealthShell>

<style>
  .tr-patient {
    margin-block-end: 0.75rem;
  }
  .tr-patient p {
    margin: 0;
  }
  .tr-fs {
    margin: 0 0 0.75rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-base-300, currentColor);
    display: grid;
    gap: 0.25rem;
  }
  .tr-gh {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
  }
  .tr-opt {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
  }
  .tr-sample {
    font-size: 0.8125rem;
  }
  .tr-errors h2 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    color: var(--lily-error-text, var(--color-error));
  }
  .tr-table {
    inline-size: 100%;
  }
</style>
