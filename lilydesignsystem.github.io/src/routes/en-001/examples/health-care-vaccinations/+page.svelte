<!--
  Example: recording and reviewing vaccinations, in English and Welsh. A person's vaccination record (the
  immunization-record-list components), a form to record a dose, vaccine stock by site, and a count of doses recorded
  today by three-hour period. The language switch changes every string, and dates and numbers go through Intl in the
  chosen language; the page marks each language with lang. The Welsh text is an unreviewed draft and says so (task P41-T1
  is the real review). Invented person, sites and numbers.
-->
<script lang="ts">
  import HealthShell from '#lib/components/HealthShell.svelte';
  import { ImmunizationRecordList, ImmunizationRecordListItem } from '@lilydesignsystem/svelte-headless';

  type Lang = 'en' | 'cy';
  const S = {
    en: {
      title: 'Record and review vaccinations',
      language: 'Language',
      draft: 'This page is in English. The Welsh version is an unreviewed draft.',
      person: 'Example person, 34 years',
      recordHeading: 'Vaccination record',
      recordName: 'Vaccinations',
      none: 'No vaccinations recorded',
      dose: (n: number, of: number) => `Dose ${n} of ${of}`,
      given: 'Given',
      notGiven: 'Not given',
      formHeading: 'Record a vaccination',
      vaccine: 'Vaccine',
      choose: 'Choose a vaccine',
      batch: 'Batch number',
      date: 'Date given',
      save: 'Save vaccination',
      problem: 'There is a problem',
      errVaccine: 'Choose a vaccine',
      errBatch: 'Enter a batch number',
      saved: (v: string, d: string) => `Recorded: ${v}, given on ${d}.`,
      stockHeading: 'Vaccine stock by site',
      site: 'Site',
      stock: 'Doses in stock',
      expires: 'Expires',
      state: 'Stock',
      plenty: 'Enough',
      low: 'Low: order more',
      soon: 'Expires soon: use first',
      todayHeading: 'Doses recorded today',
      period: 'Three-hour period',
      count: 'Doses',
      total: 'Total today',
      refreshed: 'Refreshed at',
      vaccines: { flu: 'Influenza (flu)', covid: 'COVID-19', mmr: 'Measles, mumps and rubella', tdp: 'Tetanus, diphtheria and polio' }
    },
    cy: {
      title: 'Cofnodi ac adolygu brechiadau',
      language: 'Iaith',
      draft: 'Mae’r dudalen hon yn Gymraeg. Mae’r fersiwn Cymraeg yn ddrafft heb ei adolygu.',
      person: 'Unigolyn enghreifftiol, 34 oed',
      recordHeading: 'Cofnod brechu',
      recordName: 'Brechiadau',
      none: 'Dim brechiadau wedi’u cofnodi',
      dose: (n: number, of: number) => `Dos ${n} o ${of}`,
      given: 'Rhoddwyd',
      notGiven: 'Heb ei roi',
      formHeading: 'Cofnodi brechiad',
      vaccine: 'Brechlyn',
      choose: 'Dewiswch frechlyn',
      batch: 'Rhif swp',
      date: 'Dyddiad rhoi',
      save: 'Cadw’r brechiad',
      problem: 'Mae problem',
      errVaccine: 'Dewiswch frechlyn',
      errBatch: 'Rhowch rif swp',
      saved: (v: string, d: string) => `Cofnodwyd: ${v}, a roddwyd ar ${d}.`,
      stockHeading: 'Stoc brechlynnau fesul safle',
      site: 'Safle',
      stock: 'Dosau mewn stoc',
      expires: 'Yn dod i ben',
      state: 'Stoc',
      plenty: 'Digon',
      low: 'Isel: archebwch ragor',
      soon: 'Yn dod i ben yn fuan: defnyddiwch yn gyntaf',
      todayHeading: 'Dosau a gofnodwyd heddiw',
      period: 'Cyfnod tair awr',
      count: 'Dosau',
      total: 'Cyfanswm heddiw',
      refreshed: 'Adnewyddwyd am',
      vaccines: { flu: 'Ffliw', covid: 'COVID-19', mmr: 'Y frech goch, clwy’r pennau a rwbela', tdp: 'Tetanws, difftheria a pholio' }
    }
  } as const;

  let lang = $state<Lang>('en');
  const t = $derived(S[lang]);
  const tag = $derived(lang === 'cy' ? 'cy-GB' : 'en-GB');
  // Intl falls back silently to another language when the browser has no data for one, which would show a Welsh reader a
  // US-style date. When the language is not supported, write the unambiguous ISO date instead.
  const supported = $derived(Intl.DateTimeFormat.supportedLocalesOf([tag]).length > 0);
  const fmtDate = $derived((iso: string) =>
    supported
      ? new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
      : iso
  );
  const fmtNum = $derived((n: number) => new Intl.NumberFormat(tag).format(n));

  type Rec = { vaccine: keyof typeof S.en.vaccines; date: string; dose: [number, number]; batch: string; status: 'completed' | 'not-done' };
  let record = $state<Rec[]>([
    { vaccine: 'tdp', date: '2008-03-14', dose: [3, 3], batch: 'TD-0412', status: 'completed' },
    { vaccine: 'mmr', date: '2009-06-02', dose: [2, 2], batch: 'MM-7710', status: 'completed' },
    { vaccine: 'flu', date: '2025-10-21', dose: [1, 1], batch: 'FL-2209', status: 'completed' }
  ]);

  let vaccine = $state('');
  let batch = $state('');
  let date = $state('2026-11-21');
  let errors = $state<string[]>([]);
  let status = $state('');
  let summaryEl = $state<HTMLElement>();

  async function save(e: SubmitEvent) {
    e.preventDefault();
    const found: string[] = [];
    if (!vaccine) found.push(t.errVaccine);
    if (!batch.trim()) found.push(t.errBatch);
    errors = found;
    status = '';
    if (found.length) {
      await Promise.resolve();
      summaryEl?.focus();
      return;
    }
    record = [...record, { vaccine: vaccine as Rec['vaccine'], date, dose: [1, 1], batch: batch.trim(), status: 'completed' }];
    status = t.saved(t.vaccines[vaccine as Rec['vaccine']], fmtDate(date));
    vaccine = '';
    batch = '';
  }

  const stockRows = [
    { site: { en: 'Town hall clinic', cy: 'Clinig y neuadd tref' }, v: 'flu' as const, n: 420, exp: '2026-12-31', level: 'plenty' as const },
    { site: { en: 'Market pharmacy', cy: 'Fferyllfa’r farchnad' }, v: 'covid' as const, n: 18, exp: '2027-01-15', level: 'low' as const },
    { site: { en: 'Community centre', cy: 'Canolfan gymunedol' }, v: 'flu' as const, n: 96, exp: '2026-11-28', level: 'soon' as const }
  ];
  const stockTone = { plenty: 'good', low: 'bad', soon: 'warn' } as const;
  const periods = [
    { from: '06:00', to: '09:00', n: 38 },
    { from: '09:00', to: '12:00', n: 126 },
    { from: '12:00', to: '15:00', n: 94 },
    { from: '15:00', to: '18:00', n: 61 }
  ];
  const total = periods.reduce((a, p) => a + p.n, 0);
  const max = Math.max(...periods.map((p) => p.n));
</script>

<HealthShell pageTitle={t.title} current="health-care-vaccinations">
  <div {lang}>
    <h1>{t.title}</h1>

    <div class="vx-lang" role="group" aria-label={t.language}>
      <span>{t.language}:</span>
      <button type="button" class="button" lang="en" aria-pressed={lang === 'en'} onclick={() => (lang = 'en')}>English</button>
      <button type="button" class="button" lang="cy" aria-pressed={lang === 'cy'} onclick={() => (lang = 'cy')}>Cymraeg</button>
    </div>
    <p class="hc-status">{t.draft}</p>

    {#if errors.length}
      <div class="hc-status vx-errors" role="alert" tabindex="-1" bind:this={summaryEl} style="border-inline-start-color: var(--color-error)">
        <h2>{t.problem}</h2>
        <ul>{#each errors as er (er)}<li>{er}</li>{/each}</ul>
      </div>
    {/if}
    {#if status}<div class="hc-status" role="status">{status}</div>{/if}

    <div class="hc-grid">
      <section class="hc-card" aria-labelledby="vx-rec">
        <h2 id="vx-rec">{t.recordHeading}</h2>
        <p>{t.person}</p>
        {#if record.length === 0}
          <ImmunizationRecordList status="none-known" statusLabel={t.none} />
        {:else}
          <ImmunizationRecordList status="known" statusLabel={t.recordName}>
            {#each record as r, i (i)}
              <ImmunizationRecordListItem
                vaccine={t.vaccines[r.vaccine]}
                occurrence={r.date}
                occurrenceLabel={fmtDate(r.date)}
                doseNumberLabel={t.dose(r.dose[0], r.dose[1])}
                status={r.status}
                statusLabel={r.status === 'completed' ? t.given : t.notGiven}
                lotNumber={r.batch}
              />
            {/each}
          </ImmunizationRecordList>
        {/if}
      </section>

      <form class="hc-card" onsubmit={save} novalidate>
        <h2>{t.formHeading}</h2>
        <div class="hc-field">
          <label for="vx-vaccine">{t.vaccine}</label>
          <select id="vx-vaccine" class="select" bind:value={vaccine}>
            <option value="">{t.choose}</option>
            {#each Object.entries(t.vaccines) as [k, v] (k)}<option value={k}>{v}</option>{/each}
          </select>
        </div>
        <div class="hc-field">
          <label for="vx-batch">{t.batch}</label>
          <input id="vx-batch" class="text-input" type="text" autocomplete="off" bind:value={batch} />
        </div>
        <div class="hc-field">
          <label for="vx-date">{t.date}</label>
          <input id="vx-date" class="text-input" type="date" bind:value={date} />
        </div>
        <button type="submit" class="button button-primary">{t.save}</button>
      </form>
    </div>

    <section class="hc-card" aria-labelledby="vx-stock">
      <h2 id="vx-stock">{t.stockHeading}</h2>
      <div class="hc-scroll">
        <table class="table vx-table">
          <caption class="hc-vh">{t.stockHeading}</caption>
          <thead><tr><th scope="col">{t.site}</th><th scope="col">{t.vaccine}</th><th scope="col">{t.stock}</th><th scope="col">{t.expires}</th><th scope="col">{t.state}</th></tr></thead>
          <tbody>
            {#each stockRows as r (r.site.en)}
              <tr>
                <th scope="row">{r.site[lang]}</th>
                <td>{t.vaccines[r.v]}</td>
                <td>{fmtNum(r.n)}</td>
                <td><time datetime={r.exp}>{fmtDate(r.exp)}</time></td>
                <td><span class="hc-pill" data-state={stockTone[r.level]}>{t[r.level]}</span></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <section class="hc-card" aria-labelledby="vx-today">
      <h2 id="vx-today">{t.todayHeading}</h2>
      <p>{t.total}: <strong>{fmtNum(total)}</strong> · {t.refreshed} <time datetime="2026-11-21T15:00">15:00</time></p>
      <div class="hc-scroll">
        <table class="table vx-table">
          <caption class="hc-vh">{t.todayHeading}</caption>
          <thead><tr><th scope="col">{t.period}</th><th scope="col">{t.count}</th><th scope="col"><span class="hc-vh">{t.count}</span></th></tr></thead>
          <tbody>
            {#each periods as p (p.from)}
              <tr>
                <th scope="row">{p.from}–{p.to}</th>
                <td>{fmtNum(p.n)}</td>
                <td><span class="vx-bar" aria-hidden="true" style={`inline-size: ${(p.n / max) * 100}%`}></span></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  </div>
</HealthShell>

<style>
  .vx-lang {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .vx-errors h2 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
    color: var(--lily-error-text, var(--color-error));
  }
  .vx-table {
    inline-size: 100%;
  }
  .vx-table td,
  .vx-table th {
    overflow-wrap: break-word;
    word-break: normal;
  }
  .vx-bar {
    display: block;
    block-size: 0.75rem;
    min-inline-size: 0.25rem;
    background: var(--color-primary, currentColor);
    border-radius: 999px;
  }
  .vx-lang :global(.button[aria-pressed='true']) {
    font-weight: 700;
    outline: 2px solid var(--color-primary, currentColor);
  }
</style>
