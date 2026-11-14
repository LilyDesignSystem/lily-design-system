<script setup lang="ts">
// AllergyListItem: one allergy or intolerance in an AllergyList (spec/healthcare-ui item 2). Props: AllergyListItem.md.
defineProps<{
    /** What the patient reacts to. Never truncated. */
    substance: string;
    reaction?: string;
    /** FHIR AllergyIntolerance reaction severity, rendered as data-severity. */
    severity?: "mild" | "moderate" | "severe";
    severityLabel?: string;
    /** When the record was last updated, for <time datetime>. */
    updated?: string;
    /** That date as the consumer writes it. */
    updatedLabel?: string;
}>();
</script>

<template>
    <!-- AllergyListItem.vue -->
    <li
        class="allergy-list-item"
        :data-severity="severity"
    >
        <span class="allergy-list-item-substance">{{ substance }}</span
        ><template v-if="reaction"
            >{{ " " }}<span class="allergy-list-item-reaction">{{ reaction }}</span></template
        ><template v-if="severityLabel"
            >{{ " " }}<span class="allergy-list-item-severity">{{ severityLabel }}</span></template
        ><template v-if="updatedLabel"
            >{{ " "
            }}<time
                class="allergy-list-item-updated"
                :datetime="updated"
                >{{ updatedLabel }}</time
            ></template
        ><slot />
    </li>
</template>
