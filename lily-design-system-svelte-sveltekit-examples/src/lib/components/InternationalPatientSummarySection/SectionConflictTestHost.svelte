<script lang="ts">
    // Test host (tasks.md P50-T29): an IPS section that says none are known, around an allergy list that may hold an entry.
    import AllergyRecordList from "../AllergyRecordList/AllergyRecordList.svelte";
    import AllergyRecordListItem from "../AllergyRecordListItem/AllergyRecordListItem.svelte";
    import InternationalPatientSummarySection from "./InternationalPatientSummarySection.svelte";

    let { entry = true }: { entry?: boolean } = $props();
</script>

<InternationalPatientSummarySection
    section="allergies"
    heading="Allergies and intolerances"
    status="none-known"
    statusLabel="No known allergies"
>
    <AllergyRecordList
        status="none-known"
        statusLabel="No known allergies"
        conflictLabel="This record says none are known and lists one: check the source"
    >
        {#if entry}
            <AllergyRecordListItem substance="Penicillin" />
        {/if}
    </AllergyRecordList>
</InternationalPatientSummarySection>
