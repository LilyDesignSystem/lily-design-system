<script lang="ts">
    // MedicationRecordList component
    //
    // A list of a patient's medicines, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). "None known", "not recorded",
    // "unavailable", "omitted" and "not applicable" are different facts, and an empty list could be read as any of them, so the status is
    // required and, for any status but "known", shown as the list's one item.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable" (required) — rendered as data-status
    //   statusLabel: string (required) — the status in words; names the list, and is its one item unless status is known
    //   label: string (optional) — the accessible name, when it should differ from statusLabel
    //   conflictLabel: string (optional) — shown instead of statusLabel when the status is "none-known" and the list holds an entry (HC-C17)
    //   children: slot (optional) — medication-record-list-item items
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // References:
    //   - FHIR MedicationStatement: https://hl7.org/fhir/R4/medicationstatement.html
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";
    import { recordListState, watchEntries } from "../record-list-state";

    let {
        class: className = "",
        status,
        statusLabel,
        label,
        conflictLabel = undefined,
        children,
        ...restProps
    }: {
        status:
            "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
        statusLabel: string;
        label?: string;
        /** Your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; it never says both. */
        conflictLabel?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    // "None known" beside an entry is never said (HC-C17): the entries are read from the page, and watched.
    let list: HTMLUListElement;
    let entries = $state(false);
    $effect(() => {
        if (status !== "none-known") {
            entries = false;
            return;
        }
        return watchEntries(list, "medication-record-list", (found) => (entries = found));
    });
    const shown = $derived(recordListState({ status, statusLabel, conflictLabel, label }, entries));
    $effect(() => {
        if (shown.conflict)
            warnMissingProp(
                "MedicationRecordList",
                "conflictLabel",
                conflictLabel,
                "It says none are known and holds an entry: only the entry is shown until you say so in words.",
            );
    });

    $effect(() => {
        warnMissingProp(
            "MedicationRecordList",
            "status",
            status,
            "A medication record list must say whether medicines are known, none known, not recorded, unavailable, omitted or not applicable.",
        );
        warnMissingProp(
            "MedicationRecordList",
            "statusLabel",
            statusLabel,
            "The status needs words a person can read.",
        );
    });
</script>

<!-- MedicationRecordList.svelte -->
<ul
    bind:this={list}
    class={`medication-record-list ${className}`}
    data-status={shown.status}
    aria-label={shown.name}
    {...restProps}
>
    {#if shown.showItem}<li class="medication-record-list-status">{shown.words}</li>{/if}
    {@render children?.()}
</ul>
