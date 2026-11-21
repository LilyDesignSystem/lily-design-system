<!--
  Welsh clinical portal — an example page modelled on a clinician's results screen: a task bar, a patient banner,
  a row of record tabs and a filterable table of test results.

  Every control is a headless Lily component. Pick "NHS Wales (practitioners)" in the theme picker (the default
  here) and the theme turns them into the clinical look; pick another theme and the same markup is restyled. The
  only CSS below is the page's own layout, written with the theme's tokens. The patient is fictional test data,
  and the example ships no logo: the name in the header is plain text, the adopter's own mark would go there.
-->
<script lang="ts">
    import PickerBar from "@lilydesignsystem/svelte-picker-bar";
    import {
        DataTable,
        DataTableHead,
        DataTableBody,
        DataTableRow,
        DataTableTH,
        DataTableTD,
        MedicalBanner,
        TabBar,
        TabBarButton,
    } from "@lilydesignsystem/svelte-headless";
    import { THEMES, THEME_LABELS } from "#lib/themes.js";

    const PRACTITIONERS = "united-kingdom-national-health-service-wales-for-practitioners";

    const tabs = [
        { id: "demographics", label: "Demographics" },
        { id: "documents", label: "Documents", badge: true },
        { id: "tests", label: "Tests", dot: true },
        { id: "medicines", label: "Medicines", badge: true },
        { id: "gp-record", label: "GP Record" },
        { id: "events", label: "Events" },
        { id: "to-do", label: "To Do" },
        { id: "handover", label: "Handover" },
        { id: "admit", label: "Admit", disabled: true },
        { id: "access-log", label: "Access Log" },
    ];
    let tab = $state("tests");

    let includePoct = $state(true);
    let includeOutstanding = $state(true);
    let includeAll = $state(true);

    // Fictional sample results. `flag` is "abnormal" or "normal"; every flag is also written in words.
    const results = [
        { date: "21-Feb-2020", time: "14:16", test: "XR Ankle L/(A) [Reported, signed by radiology]", dept: "RAD", number: "CAV43064857", site: "GENERAL PRACTICE", requestor: "Dr D VAUGHAN", flag: "abnormal" },
        { date: "21-Feb-2020", time: "14:16", test: "XR Ankle L/(A) [Reported, signed by radiology]", dept: "RAD", number: "CAV43595126", site: "GENERAL PRACTICE", requestor: "Dr D VAUGHAN", flag: "abnormal" },
        { date: "21-Feb-2020", time: "12:37", test: "CT Abdomen[A] [Reported, signed by radiology]", dept: "RAD", number: "ABB11030175", site: "OUT PATIENTS", requestor: "Dr A BREWSTER", flag: "abnormal" },
        { date: "21-Feb-2020", time: "12:37", test: "CT Abdomen[A] [Reported, signed by radiology]", dept: "RAD", number: "BCE5434916", site: "OUT PATIENTS", requestor: "Dr A BREWSTER", flag: "abnormal", selected: true },
        { date: "21-Feb-2020", time: "12:37", test: "CT Abdomen[A] [Reported, signed by radiology]", dept: "RAD", number: "CT11166317", site: "OUT PATIENTS", requestor: "Dr A BREWSTER", flag: "abnormal" },
        { date: "21-Feb-2020", time: "12:37", test: "CT Abdomen[A] [Reported, signed by radiology]", dept: "RAD", number: "HCA5962182", site: "OUT PATIENTS", requestor: "Dr A BREWSTER", flag: "abnormal" },
        { date: "21-Feb-2020", time: "12:37", test: "CT Abdomen[A] [Reported, signed by radiology]", dept: "RAD", number: "ABE14416962", site: "OUT PATIENTS", requestor: "Dr A BREWSTER", flag: "abnormal" },
    ];
    const total = 12;

    const nowLabel = "02-Apr-2020 : 8:01";
    let bannerClosed = $state(false);
</script>

<svelte:head>
    <title>Welsh clinical portal — Lily Design System™ example</title>
</svelte:head>

<a
    class="skip-link"
    href="#wcp-main">Skip to main content</a
>

<div class="wcp">
    <header class="wcp-top">
        <div class="wcp-signoff">
            <a href="#wcp-main">DA1s to sign off (0)</a>
        </div>
        <nav
            class="wcp-top-nav"
            aria-label="Portal"
        >
            <a href="#wcp-main">Patient Search</a>
            <a href="#wcp-main">Patient Lists</a>
        </nav>
        <div class="wcp-sensitive">
            <p class="wcp-sensitive-text">Highly Sensitive information is DISPLAYED.</p>
            <p class="wcp-session">
                <time datetime="2020-04-02T08:01">{nowLabel}</time>
                <a href="#wcp-main">Log Out</a>
                <a
                    href="#wcp-main"
                    aria-label="Help"
                    class="wcp-help">?</a
                >
            </p>
        </div>
        <div class="wcp-selects">
            <label>
                <span class="wcp-vh">Ward</span>
                <select class="select">
                    <option>Inpatient Wards</option>
                    <option>Outpatient Clinics</option>
                </select>
            </label>
            <label>
                <span class="wcp-vh">History</span>
                <select class="select">
                    <option>History...</option>
                </select>
            </label>
        </div>
        <p class="wcp-org">
            <span lang="cy">GIG Cymru</span>
            <span lang="en">NHS Wales</span>
        </p>
        <PickerBar
            class="wcp-pickers"
            labels={{
                theme: "Theme",
                locale: "Language",
                textSize: "Text size",
                share: "Share",
            }}
            themesUrl="/assets/themes/"
            themes={THEMES}
            themeProps={{
                value: PRACTITIONERS,
                storageKey: "lily-welsh-portal-theme",
                themeLabels: THEME_LABELS,
            }}
            locales={["en-gb", "cy-gb"]}
            localeProps={{
                localeLabels: { "en-gb": "English", "cy-gb": "Cymraeg" },
                storageKey: "lily-welsh-portal-locale",
            }}
            textSizeProps={{ storageKey: "lily-welsh-portal-text-size" }}
        />
    </header>

    <main
        id="wcp-main"
        class="wcp-main"
    >
        <h1 class="wcp-vh">Test results for PHILLIPS, COLT (Mrs.)</h1>

        <section
            class="wcp-patient"
            aria-label="Patient"
        >
            <div class="wcp-patient-box">
                <dl class="wcp-ids">
                    <div>
                        <dt class="wcp-vh">Name</dt>
                        <dd class="wcp-name">PHILLIPS, COLT (Mrs.)</dd>
                    </div>
                    <div>
                        <dt>NHS Number</dt>
                        <dd>888 883 4516</dd>
                    </div>
                    <div>
                        <dt>Hospital Number</dt>
                        <dd>M8030552</dd>
                    </div>
                </dl>
                <dl class="wcp-demog">
                    <div>
                        <dt>Date of Birth</dt>
                        <dd>25-Apr-1968 (51y)</dd>
                    </div>
                    <div>
                        <dt>Sex</dt>
                        <dd>Female</dd>
                    </div>
                    <div>
                        <dt>Address</dt>
                        <dd>283 North Road, Cardiff, CF14 3BN</dd>
                    </div>
                </dl>
            </div>
            <div class="wcp-alert-slot">
                {#if !bannerClosed}
                    <MedicalBanner
                        label="Patient alerts"
                        type="error"
                        class="wcp-alert"
                    >
                        <span class="wcp-alert-text">Advance care plan discussed</span>
                    </MedicalBanner>
                {/if}
            </div>
            <button
                type="button"
                class="wcp-close"
                aria-label="Close patient"
                onclick={() => (bannerClosed = true)}>×</button
            >
        </section>

        <div class="wcp-info">
            <p>
                Highly Sensitive information is DISPLAYED. <a href="#wcp-main">HIDE</a> for this patient.
                <span class="wcp-sep">|</span> 1 active user(s) <a href="#wcp-main">Show</a>
                <span class="wcp-sep">|</span>
                <label class="wcp-inline"
                    ><input
                        type="checkbox"
                        class="checkbox-input"
                    /> Add to watch list</label
                >
            </p>
            <p>All available tests are displayed (not just CWM TAF Test).</p>
        </div>

        <div class="wcp-tabs-row">
            <TabBar
                label="Patient record"
                class="wcp-tabs"
            >
                {#each tabs as t (t.id)}
                    <TabBarButton
                        selected={tab === t.id}
                        controls="wcp-panel"
                        disabled={t.disabled}
                        id={`wcp-tab-${t.id}`}
                        onclick={() => (tab = t.id)}
                    >
                        {t.label}{#if t.dot}<span
                                class="wcp-dot"
                                aria-hidden="true"></span>{/if}{#if t.badge}<span
                                class="wcp-star"
                                aria-hidden="true">☆</span
                            >{/if}
                    </TabBarButton>
                {/each}
                <span class="wcp-other">Other <span aria-hidden="true">▾</span></span>
            </TabBar>
            <button
                type="button"
                class="button"
            >
                Now
            </button>
        </div>

        <section
            id="wcp-panel"
            role="tabpanel"
            aria-labelledby={`wcp-tab-${tab}`}
            class="wcp-panel"
        >
            {#if tab === "tests"}
                <header class="wcp-panel-head">
                    <h2>Test Results</h2>
                    <fieldset class="wcp-includes">
                        <legend class="wcp-vh">Include</legend>
                        <label
                            ><input
                                type="checkbox"
                                class="checkbox-input"
                                bind:checked={includePoct}
                            /> Include POCT Results</label
                        >
                        <label
                            ><input
                                type="checkbox"
                                class="checkbox-input"
                                bind:checked={includeOutstanding}
                            /> Include Outstanding Requests</label
                        >
                        <label
                            ><input
                                type="checkbox"
                                class="checkbox-input"
                                bind:checked={includeAll}
                            /> Include All Requests</label
                        >
                    </fieldset>
                </header>

                <div class="wcp-scroll">
                    <DataTable
                        label="Test results"
                        class="wcp-table"
                    >
                        <DataTableHead>
                            <DataTableRow>
                                <DataTableTH><span class="wcp-vh">Expand</span></DataTableTH>
                                <DataTableTH>Flag</DataTableTH>
                                <DataTableTH>Date Received/Scheduled</DataTableTH>
                                <DataTableTH>Time Received</DataTableTH>
                                <DataTableTH>Test(s)</DataTableTH>
                                <DataTableTH>Dept.</DataTableTH>
                                <DataTableTH>Test Number</DataTableTH>
                                <DataTableTH>Requesting Site</DataTableTH>
                                <DataTableTH>Requestor</DataTableTH>
                            </DataTableRow>
                            <DataTableRow class="wcp-filter-row">
                                <DataTableTD></DataTableTD>
                                <DataTableTD></DataTableTD>
                                <DataTableTD
                                    ><input
                                        class="text-input"
                                        type="text"
                                        aria-label="Filter by date"
                                        value="02-Apr-2020"
                                    /></DataTableTD
                                >
                                <DataTableTD></DataTableTD>
                                <DataTableTD
                                    ><input
                                        class="text-input"
                                        type="text"
                                        aria-label="Filter by test"
                                        placeholder="No Filter..."
                                    /></DataTableTD
                                >
                                <DataTableTD
                                    ><input
                                        class="text-input"
                                        type="text"
                                        aria-label="Filter by department"
                                        placeholder="No Filter..."
                                    /></DataTableTD
                                >
                                <DataTableTD
                                    ><input
                                        class="text-input"
                                        type="text"
                                        aria-label="Filter by test number"
                                        placeholder="No Filter..."
                                    /></DataTableTD
                                >
                                <DataTableTD
                                    ><input
                                        class="text-input"
                                        type="text"
                                        aria-label="Filter by requesting site"
                                        placeholder="No Filter..."
                                    /></DataTableTD
                                >
                                <DataTableTD
                                    ><input
                                        class="text-input"
                                        type="text"
                                        aria-label="Filter by requestor"
                                        placeholder="No Filter..."
                                    /></DataTableTD
                                >
                            </DataTableRow>
                        </DataTableHead>
                        <DataTableBody>
                            {#each results as r (r.number)}
                                <DataTableRow
                                    aria-selected={r.selected ? "true" : undefined}
                                    data-selected={r.selected ? "" : undefined}
                                >
                                    <DataTableTD>
                                        <button
                                            type="button"
                                            class="wcp-expand"
                                            aria-expanded="false"
                                            aria-label={`Expand ${r.number}`}>+</button
                                        >
                                    </DataTableTD>
                                    <DataTableTD>
                                        <span
                                            class="wcp-flag"
                                            data-flag={r.flag}
                                        >
                                            <svg
                                                viewBox="0 0 16 16"
                                                aria-hidden="true"
                                                focusable="false"
                                                width="1rem"
                                                height="1rem"
                                                fill="currentColor"
                                            >
                                                <path d="M8 1.5 15 14H1z" />
                                            </svg>
                                            <span class="wcp-vh">Abnormal</span>
                                        </span>
                                    </DataTableTD>
                                    <DataTableTD>{r.date}</DataTableTD>
                                    <DataTableTD>{r.time}</DataTableTD>
                                    <DataTableTD><a href="#wcp-main">{r.test}</a></DataTableTD>
                                    <DataTableTD>{r.dept}</DataTableTD>
                                    <DataTableTD>{r.number}</DataTableTD>
                                    <DataTableTD>{r.site}</DataTableTD>
                                    <DataTableTD>{r.requestor}</DataTableTD>
                                </DataTableRow>
                            {/each}
                        </DataTableBody>
                    </DataTable>
                </div>

                <footer class="wcp-foot">
                    <ul class="wcp-tools">
                        <li><button type="button" class="wcp-link">Filters</button></li>
                        <li><button type="button" class="wcp-link">Columns</button></li>
                        <li><button type="button" class="wcp-link">Refresh Data</button></li>
                        <li><button type="button" class="wcp-link">Load All Results</button></li>
                        <li><button type="button" class="wcp-link">Advanced Results Search</button></li>
                    </ul>
                    <p class="wcp-count">Test Results 1 - {results.length} of {total}</p>
                </footer>
            {:else}
                <h2>{tabs.find((t) => t.id === tab)?.label}</h2>
                <p>This tab is not part of the example. Choose Tests to see the results table.</p>
            {/if}
        </section>

        <p class="wcp-note">
            An example page: the patient, the numbers and the results are invented, and nothing here is clinical advice.
            Not affiliated with or endorsed by NHS Wales. <a href="/examples/">All examples</a>
        </p>
    </main>
</div>

<style>
    .wcp {
        min-block-size: 100dvh;
        background: var(--color-base-200, Canvas);
        color: var(--color-base-content, CanvasText);
    }
    /* Visually hidden, still read by a screen reader. */
    .wcp-vh {
        position: absolute;
        inline-size: 1px;
        block-size: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
    .wcp-top {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem 1rem;
        padding: 0.375rem 0.75rem;
        background: var(--color-base-100, Canvas);
        border-block-end: 1px solid var(--color-base-300, currentColor);
    }
    .wcp-signoff {
        border: 1px solid var(--color-base-300, currentColor);
        padding: 0.25rem 0.75rem;
        font-size: 0.8125rem;
    }
    .wcp-top-nav {
        display: flex;
        gap: 1rem;
        font-size: 0.8125rem;
        font-weight: 600;
    }
    .wcp-sensitive {
        margin-inline: auto;
        text-align: center;
        font-size: 0.8125rem;
    }
    .wcp-sensitive p,
    .wcp-session {
        margin: 0;
    }
    .wcp-sensitive-text {
        color: var(--lily-error-text, var(--color-error));
        font-weight: 600;
    }
    .wcp-session {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        align-items: center;
    }
    .wcp-help {
        display: inline-grid;
        place-items: center;
        inline-size: 1.25rem;
        block-size: 1.25rem;
        border: 1px solid currentColor;
        border-radius: 50%;
        font-size: 0.75rem;
        text-decoration: none;
    }
    .wcp-selects {
        display: flex;
        gap: 0.5rem;
    }
    .wcp-org {
        margin: 0;
        display: grid;
        font-weight: 700;
        line-height: 1.1;
        color: var(--color-primary);
    }
    .wcp-main {
        padding: 0.5rem 0.75rem 1rem;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 0.5rem;
    }
    .wcp-patient {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) auto;
        gap: 0.75rem;
        align-items: stretch;
        padding: 0.5rem 0.75rem;
        background: var(--color-base-100, Canvas);
        border: 1px solid var(--color-base-300, currentColor);
    }
    .wcp-patient-box {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 0.75rem;
    }
    .wcp-ids,
    .wcp-demog {
        margin: 0;
        display: grid;
        gap: 0.125rem;
        align-content: start;
        font-size: 0.8125rem;
    }
    .wcp-ids > div,
    .wcp-demog > div {
        display: flex;
        gap: 0.5rem;
    }
    .wcp-ids dt,
    .wcp-demog dt {
        min-inline-size: 6rem;
    }
    .wcp-ids dd,
    .wcp-demog dd {
        margin: 0;
    }
    .wcp-name {
        font-size: 1.125rem;
        font-weight: 700;
    }
    .wcp-alert-slot {
        min-inline-size: 0;
    }
    .wcp .wcp-alert-slot :global(.medical-banner.wcp-alert) {
        block-size: 100%;
        box-sizing: border-box;
        border: 2px solid var(--color-error);
        background: var(--color-base-100, Canvas);
        --lily-alert-color: var(--lily-error-text, var(--color-error));
        font-size: 0.8125rem;
    }
    .wcp-alert-text {
        color: var(--lily-error-text, var(--color-error));
    }
    .wcp-close {
        inline-size: 1.5rem;
        block-size: 1.5rem;
        align-self: start;
        border: 2px solid var(--color-error);
        border-radius: 50%;
        background: var(--color-base-100, Canvas);
        color: var(--color-error);
        line-height: 1;
        cursor: pointer;
    }
    .wcp-info {
        font-size: 0.8125rem;
    }
    .wcp-info p {
        margin: 0.125rem 0;
    }
    .wcp-sep {
        margin-inline: 0.375rem;
    }
    .wcp-inline {
        display: inline-flex;
        gap: 0.25rem;
        align-items: center;
    }
    .wcp-tabs-row {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    .wcp-tabs-row :global(.wcp-tabs) {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }
    .wcp-tabs-row :global(.wcp-tabs .tab-bar-button:disabled) {
        opacity: 0.55;
    }
    .wcp-dot {
        display: inline-block;
        inline-size: 0.5rem;
        block-size: 0.5rem;
        margin-inline-start: 0.375rem;
        border-radius: 50%;
        background: var(--color-warning);
        border: 1px solid var(--color-warning-content);
    }
    .wcp-star {
        margin-inline-start: 0.25rem;
        color: var(--color-base-content);
    }
    .wcp-other {
        align-self: center;
        padding-inline: 0.5rem;
        font-size: 0.8125rem;
    }
    .wcp-panel {
        background: var(--color-base-100, Canvas);
        border: 1px solid var(--color-base-300, currentColor);
        padding: 0.5rem;
    }
    .wcp-panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem 1rem;
    }
    .wcp-panel-head h2 {
        margin: 0;
        font-size: 0.875rem;
    }
    .wcp-includes {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 0.8125rem;
    }
    .wcp-includes label {
        display: inline-flex;
        gap: 0.25rem;
        align-items: center;
    }
    /* A wide table scrolls inside its own region, never the page (reflow, WCAG 1.4.10). */
    .wcp-scroll {
        overflow-x: auto;
        margin-block: 0.5rem;
    }
    .wcp-scroll :global(.wcp-table) {
        inline-size: 100%;
        font-size: 0.8125rem;
    }
    .wcp-scroll :global(.wcp-table th) {
        white-space: nowrap;
    }
    .wcp-scroll :global(.wcp-filter-row .text-input) {
        inline-size: 100%;
        min-inline-size: 6rem;
        font-size: 0.75rem;
    }
    .wcp .wcp-scroll :global(tr[data-selected] > td),
    .wcp .wcp-scroll :global(tr[data-selected] > th) {
        background: color-mix(in oklab, var(--color-info) 18%, var(--color-base-100, Canvas));
        color: var(--color-base-content);
    }
    .wcp-expand {
        inline-size: 1.125rem;
        block-size: 1.125rem;
        padding: 0;
        border: 1px solid currentColor;
        border-radius: 50%;
        background: transparent;
        color: inherit;
        line-height: 1;
        cursor: pointer;
    }
    .wcp-flag {
        display: inline-flex;
        color: var(--color-warning);
        filter: drop-shadow(0 0 0 var(--color-warning-content));
    }
    .wcp-foot {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 0.8125rem;
    }
    .wcp-tools {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .wcp-link {
        padding: 0;
        border: 0;
        background: none;
        color: var(--color-secondary);
        text-decoration: underline;
        cursor: pointer;
        font: inherit;
    }
    .wcp-count {
        margin: 0;
    }
    .wcp-note {
        margin: 0;
        font-size: 0.75rem;
    }
    @media (max-width: 48rem) {
        .wcp-patient,
        .wcp-patient-box {
            grid-template-columns: minmax(0, 1fr);
        }
    }
</style>
