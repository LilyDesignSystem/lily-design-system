<!--
  EMR example: the Summary "Overview", a page of cards: orders needing collection, unresulted labs, the running
  infusion, sticky notes, care partners and medical problems. Built from the shared EmrShell. Invented data.
-->
<script lang="ts">
    import EmrShell from "#lib/emr/EmrShell.svelte";
    import { DataTable, DataTableHead, DataTableBody, DataTableRow, DataTableTH, DataTableTD } from "@lilydesignsystem/svelte-headless";
</script>

<EmrShell
    pageTitle="Patient summary overview"
    chartTab="summary"
    subTab="overview"
>
    <div class="emr-grid">
        <section
            class="emr-card"
            data-tone="orders"
            aria-labelledby="ov-collect"
        >
            <h2 id="ov-collect"><span class="emr-pill">Orders Needing Unit Collect</span></h2>
            <p>None</p>
        </section>

        <section
            class="emr-card"
            data-tone="orders"
            aria-labelledby="ov-labs"
        >
            <h2 id="ov-labs"><span class="emr-pill">All Unresulted Labs</span></h2>
            <p class="ov-range">(24 h ago through 12 h from now)</p>
            <div class="emr-scroll">
                <DataTable
                    label="Unresulted labs"
                    class="emr-table"
                >
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableTH>Start</DataTableTH>
                            <DataTableTH>Order</DataTableTH>
                            <DataTableTH>Ordered</DataTableTH>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        <DataTableRow>
                            <DataTableTD><time datetime="2020-12-06T20:00">12/06/20 2000</time></DataTableTD>
                            <DataTableTD><a href="#emr-main">Haemoglobin and Haematocrit (H&amp;H) every 12 hours</a></DataTableTD>
                            <DataTableTD><time datetime="2020-12-06T10:28">12/06/20 1028</time></DataTableTD>
                        </DataTableRow>
                    </DataTableBody>
                </DataTable>
            </div>
        </section>
    </div>

    <section
        class="emr-card ov-wide"
        data-tone="infusion"
        aria-labelledby="ov-infusing"
    >
        <h2 id="ov-infusing"><span class="emr-pill">Currently Infusing</span></h2>
        <div class="ov-infusion">
            <dl class="emr-kv">
                <div><dt>Order information: </dt><dd><strong>sodium chloride 0.9% (NS) infusion</strong></dd></div>
                <div><dt>Rate: </dt><dd>125 mL/hour</dd></div>
                <div><dt>Dose: </dt><dd>125 mL/hour</dd></div>
                <div><dt>Start: </dt><dd><time datetime="2020-12-05T07:30">12/05/20 0730</time></dd></div>
                <div><dt>Ordering provider: </dt><dd>Kamara, Priya, MD</dd></div>
                <div><dt>Peripheral line: </dt><dd>Peripheral IV 12/05/20, right hand</dd></div>
            </dl>
            <dl class="emr-kv">
                <div><dt>Last new bag</dt></div>
                <div><dt>Rate: </dt><dd>125 mL/hour</dd></div>
                <div><dt>Dose: </dt><dd>125 mL/hour</dd></div>
                <div><dt>Documented: </dt><dd><time datetime="2020-12-06T09:29">12/06/20 0929</time></dd></div>
                <div><dt>User: </dt><dd>Delacroix, Ashley, RN</dd></div>
            </dl>
            <dl class="emr-kv">
                <div><dt>Last action: </dt><dd>Rate/dose verified</dd></div>
                <div><dt>Rate: </dt><dd>125 mL/hour</dd></div>
                <div><dt>Dose: </dt><dd>125 mL/hour</dd></div>
                <div><dt>Documented: </dt><dd><time datetime="2020-12-06T11:00">12/06/20 1100</time></dd></div>
                <div><dt>User: </dt><dd>Delacroix, Ashley, RN</dd></div>
            </dl>
        </div>
        <p><a href="#emr-main">Open MAR</a></p>
    </section>

    <div class="emr-grid">
        <section
            class="emr-card"
            data-tone="notes"
            aria-labelledby="ov-team-notes"
        >
            <h2 id="ov-team-notes"><span class="emr-pill">Treatment Team Sticky Notes</span></h2>
            <p class="emr-sticky">
                12/6: Self-pay. Free community clinic active; referrals sent. Home at discharge. Case manager notified.
            </p>
            <p class="ov-edited">Last edited by Hartley, Janet, RN on <time datetime="2020-12-06T10:49">12/06/20 at 1049</time></p>
            <p><a href="#emr-main">Comment</a></p>
        </section>
        <section
            class="emr-card"
            data-tone="notes"
            aria-labelledby="ov-phys-notes"
        >
            <h2 id="ov-phys-notes"><span class="emr-pill">Sticky Notes to Physicians</span></h2>
            <p class="emr-sticky">
                12/6: Self-pay. Free community clinic active; referrals sent. Home at discharge. Case manager notified.
            </p>
            <p class="ov-edited">Last edited by Hartley, Janet, RN on <time datetime="2020-12-06T10:49">12/06/20 at 1049</time></p>
            <p><a href="#emr-main">Comment</a></p>
        </section>
        <section
            class="emr-card"
            aria-labelledby="ov-partner"
        >
            <h2 id="ov-partner"><span class="emr-pill">Care Partner Information</span></h2>
            <p>No care partner has been recorded.</p>
        </section>
        <section
            class="emr-card"
            data-tone="problems"
            aria-labelledby="ov-problems"
        >
            <h2 id="ov-problems"><span class="emr-pill">Medical Problems</span></h2>
            <ul class="ov-problems">
                <li>Urinary tract infection due to ESBL organism</li>
                <li>Small bowel obstruction</li>
            </ul>
            <p><a href="#emr-main">Comment</a></p>
        </section>
    </div>
</EmrShell>

<style>
    .ov-range,
    .ov-edited {
        margin: 0 0 0.5rem;
        font-size: 0.75rem;
    }
    .ov-infusion {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
        gap: 0.75rem;
    }
    .ov-problems {
        margin: 0;
        padding-inline-start: 1.25rem;
    }
</style>
