<script lang="ts">
    // InternationalPatientSummarySection component
    //
    // One section of an International Patient Summary (HL7 FHIR IPS, ISO 27269): a <section> named by its heading, carrying the
    // section's key, LOINC code, status and whether the IPS requires it, as data. Its entries are the consumer's (a record list,
    // a data table); its status is never blank, and for any status but "known" the consumer's words are shown under the heading.
    // The author's narrative, when given, sits in a <details> after the entries.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   section — string (required). The IPS section key, such as "allergies" (see ips-sections.ts); data-section.
    //   heading — string (required). The section's heading, the consumer's words.
    //   headingLevel — 2 to 6, default 2.
    //   status — "known" | "none-known" | "not-recorded" | "unavailable" | "omitted", default "known"; data-status.
    //   statusLabel — string. The status in words; required for any status but "known".
    //   code — string, optional. The LOINC code; default the IPS code for the key; data-code.
    //   required — boolean, optional. Default whether the IPS requires the section; data-required.
    //   level — "required" | "recommended" | "optional", optional. Default the section's level in the IPS; data-level.
    //   meta — Snippet, optional. What a viewer shows beside the heading (the level in words, the document's own title, a
    //     revealable code), after the heading and status and before the entries. Nothing is rendered without it.
    //   warning — Snippet, optional. A notice about the entries, such as "entries not found", after meta. Nothing is rendered without it.
    //   id — string, optional. Default {idPrefix}-{section}, which the contents links use.
    //   idPrefix — string, default "international-patient-summary"; the same as its summary's.
    //   narrative — Snippet, optional. The author's narrative (sanitised by the consumer), in a <details>.
    //   narrativeLabel — string. The <details> summary; required with narrative.
    //   narrativeOpen — boolean, default false. Open it when the section has no structured entries.
    //   children — Snippet, optional. The section's entries.
    //   ...restProps — additional HTML attributes spread onto the <section>.
    //
    // References:
    //   - IPS Composition sections: https://hl7.org/fhir/uv/ips/Structure-of-the-International-Patient-Summary.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";
    import { watchConflict } from "../record-list-state";
    import {
        ipsSectionCode,
        ipsSectionId,
        ipsSectionIsRequired,
        ipsSectionLevel,
    } from "../ips-sections";
    import type { IpsSectionStatus } from "../ips-sections";

    let {
        class: className = "",
        section,
        heading,
        headingLevel = 2,
        status = "known",
        statusLabel = undefined,
        statusPlacement = "heading",
        code = undefined,
        required = undefined,
        level = undefined,
        meta = undefined,
        warning = undefined,
        id = undefined,
        idPrefix = undefined,
        narrative = undefined,
        narrativeLabel = undefined,
        narrativeOpen = false,
        children,
        ...restProps
    }: {
        section: string;
        heading: string;
        headingLevel?: 2 | 3 | 4 | 5 | 6;
        status?: IpsSectionStatus;
        statusLabel?: string;
        /** Where a status other than "known" is said in words: "heading" (default) prints `statusLabel` under the heading; "list" leaves the words to the record list inside, whose own status item says them, so they are not shown twice. */
        statusPlacement?: "heading" | "list";
        code?: string;
        required?: boolean;
        /** The section's level in the IPS: "required", "recommended" or "optional". Default the registry's level for the key; data-level. */
        level?: "required" | "recommended" | "optional";
        /** What a viewer shows beside the heading, after the heading and status and before the entries. */
        meta?: Snippet;
        /** A notice about the entries, after `meta` and before them. */
        warning?: Snippet;
        id?: string;
        idPrefix?: string;
        narrative?: Snippet;
        narrativeLabel?: string;
        narrativeOpen?: boolean;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const sectionId = $derived(ipsSectionId(section, id, idPrefix));
    const headingId = $derived(`${sectionId}-heading`);
    const sectionCode = $derived(code ?? ipsSectionCode(section));
    const sectionLevel = $derived(level ?? ipsSectionLevel(section));
    const isRequired = $derived(required ?? ipsSectionIsRequired(section));

    $effect(() => {
        warnMissingProp(
            "InternationalPatientSummarySection",
            "heading",
            heading,
            "A section needs a heading.",
        );
        if (status !== "known" && statusPlacement !== "list")
            warnMissingProp(
                "InternationalPatientSummarySection",
                "statusLabel",
                statusLabel,
                "A section that is not known must say why, in words.",
            );
        if (narrative)
            warnMissingProp(
                "InternationalPatientSummarySection",
                "narrativeLabel",
                narrativeLabel,
                "The narrative's disclosure needs a summary.",
            );
    });

    // "None known" is never printed above a record list that holds an entry (HC-C17, tasks.md P50-T29): the list says the
    // conflict in the app's words, so the section's own line steps aside while one inside is in conflict.
    let root: HTMLElement;
    let listInConflict = $state(false);
    $effect(() => {
        if (status !== "none-known") {
            listInConflict = false;
            return;
        }
        return watchConflict(root, (found) => (listInConflict = found));
    });
</script>

<!-- InternationalPatientSummarySection.svelte -->
<section
    bind:this={root}
    class={`international-patient-summary-section ${className}`}
    id={sectionId}
    aria-labelledby={headingId}
    data-section={section}
    data-code={sectionCode}
    data-status={status}
    data-required={isRequired ? "true" : undefined}
    data-level={sectionLevel}
    {...restProps}
>
    <svelte:element
        this={`h${headingLevel}`}
        id={headingId}
        class="international-patient-summary-section-heading">{heading}</svelte:element
    >
    {#if status !== "known" && statusLabel && statusPlacement !== "list" && !listInConflict}
        <p class="international-patient-summary-section-status">{statusLabel}</p>
    {/if}
    {#if meta}
        <div class="international-patient-summary-section-meta">{@render meta()}</div>
    {/if}
    {#if warning}
        <div class="international-patient-summary-section-warning">{@render warning()}</div>
    {/if}
    {@render children?.()}
    {#if narrative}
        <details
            class="international-patient-summary-section-narrative"
            open={narrativeOpen}
        >
            <summary>{narrativeLabel}</summary>
            {@render narrative()}
        </details>
    {/if}
</section>
