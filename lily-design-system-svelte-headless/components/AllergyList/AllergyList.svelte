<script lang="ts">
    // AllergyList component
    //
    // A headless list of a patient's allergies and intolerances whose status is never blank (spec/healthcare-ui item 2).
    // "No known allergies", "allergies not recorded" and "allergies unavailable" are different facts, and an empty list
    // could be read as any of them, so the status is required and, when there are no items, shown as the only item.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   status — "known" | "none-known" | "not-recorded" | "unavailable", required. Rendered as data-status.
    //   statusLabel — string, required. The consumer's words for the status ("Known allergies", "No known allergies").
    //     For any status but "known" it is the list's one visible item; it always names the list.
    //   label — string, optional. The list's accessible name, when it should differ from statusLabel.
    //   children — Snippet, optional. AllergyListItem items, for status "known".
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // Syntax:
    //   <AllergyList status="known" statusLabel="Known allergies">
    //       <AllergyListItem substance="Penicillin" reaction="Anaphylaxis" severity="severe" severityLabel="Severe" />
    //   </AllergyList>
    //   <AllergyList status="none-known" statusLabel="No known allergies" />
    //
    // Accessibility:
    //   - A <ul> named by aria-label; the status is text, never an icon or a colour alone.
    //
    // References:
    //   - FHIR AllergyIntolerance: https://hl7.org/fhir/allergyintolerance.html
    //   - NHS Common User Interface, patient banner allergies section (withdrawn 2019)
    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        status,
        statusLabel,
        label,
        children,
        ...restProps
    }: {
        status: "known" | "none-known" | "not-recorded" | "unavailable";
        statusLabel: string;
        label?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => {
        warnMissingProp(
            "AllergyList",
            "status",
            status,
            "An allergy list must say whether allergies are known, none known, not recorded or unavailable.",
        );
        warnMissingProp(
            "AllergyList",
            "statusLabel",
            statusLabel,
            "The status needs words a person can read.",
        );
    });
</script>

<!-- AllergyList.svelte -->
<ul
    class={`allergy-list ${className}`}
    data-status={status}
    aria-label={label ?? statusLabel}
    {...restProps}
>
    {#if status !== "known"}<li class="allergy-list-status">{statusLabel}</li>{/if}
    {@render children?.()}
</ul>
