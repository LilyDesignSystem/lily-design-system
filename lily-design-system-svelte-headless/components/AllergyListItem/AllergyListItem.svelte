<script lang="ts">
    // AllergyListItem component
    //
    // One allergy or intolerance in an AllergyList (spec/healthcare-ui item 2): the substance, the reaction, the severity and
    // when the record was last updated. Every word is the consumer's, and the severity is text as well as data-severity.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   substance — string, required. What the patient reacts to ("Penicillin"). Never truncated.
    //   reaction — string, optional. The manifestation ("Anaphylaxis").
    //   severity — "mild" | "moderate" | "severe", optional (the FHIR AllergyIntolerance reaction severity). data-severity.
    //   severityLabel — string, optional. The consumer's words for the severity ("Severe").
    //   updated — string, optional. When the record was last updated, as a machine-readable date for <time datetime>.
    //   updatedLabel — string, optional. That date as the consumer writes it ("Updated 3 Nov 2026"). Shown only when set.
    //   children — Snippet, optional. Anything else, such as a link to the full record.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <AllergyListItem substance="Penicillin" reaction="Anaphylaxis" severity="severe" severityLabel="Severe"
    //       updated="2026-11-03" updatedLabel="Updated 3 Nov 2026" />
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        substance,
        reaction,
        severity,
        severityLabel,
        updated,
        updatedLabel,
        children,
        ...restProps
    }: {
        substance: string;
        reaction?: string;
        severity?: "mild" | "moderate" | "severe";
        severityLabel?: string;
        updated?: string;
        updatedLabel?: string;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AllergyListItem.svelte -->
<li
    class={`allergy-list-item ${className}`}
    data-severity={severity}
    {...restProps}
>
    <span class="allergy-list-item-substance">{substance}</span>{#if reaction}{" "}<span
            class="allergy-list-item-reaction">{reaction}</span
        >{/if}{#if severityLabel}{" "}<span class="allergy-list-item-severity">{severityLabel}</span
        >{/if}{#if updatedLabel}{" "}<time
            class="allergy-list-item-updated"
            datetime={updated}>{updatedLabel}</time
        >{/if}{@render children?.()}
</li>
