<!--
  EmrShell — the frame shared by the four "EMR" example pages: an application bar with the picker bar, a row of
  shortcuts, a patient sidebar, the chart tabs and the sub-tabs of the Summary tab. A page supplies its content as the
  children.

  The layout follows a common commercial EMR screen, written from scratch with headless Lily components and the
  selected theme's tokens. It ships no vendor logo, name or icon: the brand slot holds plain text, an adopter's own mark
  would go there. The patient, staff and every number are invented. Not affiliated with or endorsed by any EMR vendor.
-->
<script lang="ts">
    import type { Snippet } from "svelte";
    import PickerBar from "@lilydesignsystem/svelte-picker-bar";
    import { THEMES, THEME_LABELS } from "#lib/themes.js";

    let {
        pageTitle,
        chartTab = "summary",
        subTab = "overview",
        children,
    }: {
        pageTitle: string;
        chartTab?: string;
        subTab?: string;
        children: Snippet;
    } = $props();

    const BASE = "/examples/";
    const PAGES: Record<string, string> = {
        "summary:overview": `${BASE}epic-emr-patient-summary-overview/`,
        "summary:index": `${BASE}epic-emr-patient-lists-patient-lookup/`,
        "lists": `${BASE}epic-emr-patient-surgical-specialty/`,
    };

    const shortcuts = ["Patient Lookup", "OR Cases", "House Census", "Reference", "Transfer Center", "Staffed Beds", "Anywhere RN", "Reports"];
    const chartTabs = [
        { id: "summary", label: "Summary", href: PAGES["summary:overview"] },
        { id: "chart-review", label: "Chart Review" },
        { id: "results", label: "Results" },
        { id: "work-list", label: "Work List" },
        { id: "mar", label: "MAR" },
        { id: "flowsheets", label: "Flowsheets" },
        { id: "intake", label: "Intake/Output" },
        { id: "notes", label: "Notes" },
        { id: "education", label: "Education" },
        { id: "care-plan", label: "Care Plan" },
        { id: "orders", label: "Orders" },
        { id: "navigators", label: "Navigators" },
    ];
    const subTabs = [
        { id: "overview", label: "Overview", href: PAGES["summary:overview"] },
        { id: "index", label: "Index", href: PAGES["summary:index"] },
        { id: "sbar", label: "SBAR Handoff" },
        { id: "flowsheet", label: "Comp Flowsheet" },
        { id: "cosign", label: "Cosign" },
        { id: "active-orders", label: "Active Orders" },
    ];
</script>

<svelte:head>
    <title>{pageTitle} — Lily Design System™ example</title>
</svelte:head>

<a
    class="skip-link"
    href="#emr-main">Skip to main content</a
>

<div class="emr">
    <header class="emr-bar">
        <p class="emr-brand">Example EMR</p>
        <nav
            class="emr-shortcuts"
            aria-label="Shortcuts"
        >
            <ul>
                {#each shortcuts as s (s)}
                    <li>
                        {#if s === "Patient Lookup"}
                            <a href={PAGES["summary:index"]}>{s}</a>
                        {:else}
                            <span aria-disabled="true">{s}</span>
                        {/if}
                    </li>
                {/each}
                <li><a href={PAGES["lists"]}>Patient Lists</a></li>
            </ul>
        </nav>
        <p class="emr-user">CINDY W.</p>
        <PickerBar
            class="emr-pickers"
            labels={{ theme: "Theme", locale: "Language", textSize: "Text size", share: "Share" }}
            themesUrl="/assets/themes/"
            themes={THEMES}
            themeProps={{ value: "corporate", storageKey: "lily-emr-theme", themeLabels: THEME_LABELS }}
            locales={["en-gb", "cy-gb"]}
            localeProps={{ localeLabels: { "en-gb": "English", "cy-gb": "Cymraeg" }, storageKey: "lily-emr-locale" }}
            textSizeProps={{ storageKey: "lily-emr-text-size" }}
        />
    </header>

    <div
        class="emr-body"
        data-lists={chartTab === "lists" ? "" : undefined}
    >
        {#if chartTab !== "lists"}
        <aside
            class="emr-side"
            aria-label="Patient"
        >
            <p class="emr-side-name">TEST, PATIENT</p>
            <p class="emr-side-sub">Room 4B-12 · 58 y · Female</p>
            <dl>
                <div>
                    <dt>Precautions</dt>
                    <dd>Fall precautions</dd>
                </div>
                <div>
                    <dt>Organism</dt>
                    <dd>None</dd>
                </div>
                <div>
                    <dt>Attending</dt>
                    <dd>Okoro, Samuel, MD</dd>
                </div>
                <div>
                    <dt>Allergies</dt>
                    <dd class="emr-allergy">Codeine, Penicillins</dd>
                </div>
                <div>
                    <dt>Pharmacy</dt>
                    <dd>Yes</dd>
                </div>
            </dl>
        </aside>
        {/if}

        <div class="emr-work">
            {#if chartTab !== "lists"}
            <nav
                class="emr-tabs"
                aria-label="Patient record"
            >
                <ul>
                    {#each chartTabs as t (t.id)}
                        <li>
                            {#if t.href}
                                <a
                                    href={t.href}
                                    aria-current={chartTab === t.id ? "page" : undefined}>{t.label}</a
                                >
                            {:else}
                                <span aria-disabled="true">{t.label}</span>
                            {/if}
                        </li>
                    {/each}
                </ul>
            </nav>
            {/if}

            <main
                id="emr-main"
                class="emr-main"
            >
                <h1 class="emr-h1">{chartTab === "lists" ? "Patient Lists" : "Summary"}</h1>
                {#if chartTab !== "lists"}
                    <nav
                        class="emr-subtabs"
                        aria-label="Summary views"
                    >
                        <ul>
                            {#each subTabs as t (t.id)}
                                <li>
                                    {#if t.href}
                                        <a
                                            href={t.href}
                                            aria-current={subTab === t.id ? "page" : undefined}>{t.label}</a
                                        >
                                    {:else}
                                        <span aria-disabled="true">{t.label}</span>
                                    {/if}
                                </li>
                            {/each}
                        </ul>
                    </nav>
                {/if}
                {@render children()}
                <p class="emr-note">
                    An example page: the patient, staff and numbers are invented, and nothing here is clinical advice. Not
                    affiliated with or endorsed by any EMR vendor. <a href="/examples/">All examples</a>
                </p>
            </main>
        </div>
    </div>
</div>

<style>
    .emr {
        min-block-size: 100dvh;
        background: var(--color-base-200, Canvas);
        color: var(--color-base-content, CanvasText);
        font-size: 0.8125rem;
    }
    .emr-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.25rem 1rem;
        padding: 0.25rem 0.75rem;
        background: var(--color-primary);
        color: var(--color-primary-content);
    }
    .emr-bar :global(a),
    .emr-bar :global(span) {
        color: inherit;
    }
    .emr-brand {
        margin: 0;
        font-weight: 700;
        font-size: 1rem;
    }
    .emr-shortcuts ul,
    .emr-tabs ul,
    .emr-subtabs ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem 0.75rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .emr-shortcuts [aria-disabled="true"] {
        opacity: 0.75;
    }
    .emr-user {
        margin: 0 0 0 auto;
        font-weight: 600;
    }
    .emr-body {
        display: grid;
        grid-template-columns: 13rem minmax(0, 1fr);
        align-items: start;
    }
    .emr-side {
        padding: 0.75rem;
        background: var(--color-base-100, Canvas);
        border-inline-end: 1px solid var(--color-base-300, currentColor);
        min-block-size: 100%;
    }
    .emr-side p {
        margin: 0;
    }
    .emr-side-name {
        font-weight: 700;
    }
    .emr-side dl {
        margin: 0.75rem 0 0;
        display: grid;
        gap: 0.5rem;
    }
    .emr-side dt {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        color: var(--color-primary);
    }
    .emr-side dd {
        margin: 0;
    }
    .emr-allergy {
        color: var(--lily-error-text, var(--color-error));
        font-weight: 600;
    }
    .emr-work {
        min-inline-size: 0;
    }
    .emr-tabs {
        padding: 0.25rem 0.5rem 0;
        background: var(--color-base-100, Canvas);
        border-block-end: 1px solid var(--color-base-300, currentColor);
    }
    .emr-tabs a,
    .emr-tabs span {
        display: block;
        padding: 0.375rem 0.5rem;
        border: 1px solid var(--color-base-300, currentColor);
        border-block-end: 0;
        background: var(--color-base-200, Canvas);
        text-decoration: none;
    }
    .emr-tabs a[aria-current="page"] {
        background: var(--color-base-100, Canvas);
        border-block-start: 3px solid var(--color-primary);
        font-weight: 600;
    }
    .emr-tabs [aria-disabled="true"] {
        color: color-mix(in oklab, var(--color-base-content) 70%, var(--color-base-100, Canvas));
    }
    .emr-main {
        padding: 0.5rem 0.75rem 1rem;
        min-inline-size: 0;
    }
    .emr-h1 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
        color: var(--color-primary);
    }
    .emr-subtabs {
        margin-block-end: 0.75rem;
        border-block-end: 1px solid var(--color-base-300, currentColor);
    }
    .emr-subtabs a,
    .emr-subtabs span {
        display: block;
        padding: 0.375rem 0.5rem;
        text-decoration: none;
    }
    .emr-subtabs a[aria-current="page"] {
        border-block-end: 3px solid var(--color-primary);
        font-weight: 600;
    }
    .emr-subtabs [aria-disabled="true"] {
        color: color-mix(in oklab, var(--color-base-content) 70%, var(--color-base-100, Canvas));
    }
    /* The summary cards: a tone on the inline-start rail, a coloured heading, no meaning carried by colour alone. */
    .emr :global(.emr-card) {
        background: var(--color-base-100, Canvas);
        border: 1px solid var(--color-base-300, currentColor);
        border-inline-start: 4px solid var(--emr-tone, var(--color-primary));
        padding: 0.5rem 0.75rem;
        min-inline-size: 0;
    }
    .emr :global(.emr-card[data-tone="orders"]) {
        --emr-tone: var(--color-warning);
    }
    .emr :global(.emr-card[data-tone="infusion"]) {
        --emr-tone: var(--color-secondary);
    }
    .emr :global(.emr-card[data-tone="notes"]) {
        --emr-tone: var(--color-success);
    }
    .emr :global(.emr-card[data-tone="problems"]) {
        --emr-tone: var(--color-error);
    }
    .emr :global(.emr-card h2) {
        margin: 0 0 0.5rem;
        font-size: 1rem;
    }
    .emr :global(.emr-pill) {
        display: inline-block;
        padding: 0.125rem 0.75rem;
        border-radius: 999px;
        background: color-mix(in oklab, var(--emr-tone, var(--color-primary)) 22%, var(--color-base-100, Canvas));
    }
    .emr :global(.emr-grid) {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
        gap: 0.75rem;
        margin-block-end: 0.75rem;
    }
    .emr :global(.emr-kv) {
        margin: 0;
        display: grid;
        gap: 0.125rem;
    }
    .emr :global(.emr-kv dt) {
        display: inline;
        color: color-mix(in oklab, var(--color-base-content) 75%, var(--color-base-100, Canvas));
    }
    .emr :global(.emr-kv dd) {
        display: inline;
        margin: 0;
    }
    .emr :global(.emr-kv > div) {
        display: block;
    }
    .emr :global(.emr-sticky) {
        background: color-mix(in oklab, var(--color-warning) 25%, var(--color-base-100, Canvas));
        padding: 0.5rem;
        margin: 0 0 0.5rem;
    }
    /* position: relative makes the scroll region the containing block of the visually hidden text inside it, so that
       text cannot sit outside the clipped table and widen the page. */
    .emr :global(.emr-scroll) {
        overflow-x: auto;
        position: relative;
    }
    .emr :global(.emr-table) {
        inline-size: 100%;
    }
    .emr :global(.emr-vh) {
        position: absolute;
        inline-size: 1px;
        block-size: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
    .emr-note {
        margin-block: 1rem 0;
        font-size: 0.75rem;
    }
    .emr-body[data-lists] {
        grid-template-columns: minmax(0, 1fr);
    }
    @media (max-width: 48rem) {
        .emr-body {
            grid-template-columns: minmax(0, 1fr);
        }
        .emr-side {
            border-inline-end: 0;
            border-block-end: 1px solid var(--color-base-300, currentColor);
        }
    }
</style>
