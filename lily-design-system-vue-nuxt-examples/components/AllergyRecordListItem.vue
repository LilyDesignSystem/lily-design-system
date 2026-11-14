<script setup lang="ts">
// AllergyRecordListItem: one allergy or intolerance in an AllergyRecordList (spec/healthcare-ui item 2). Props: AllergyRecordListItem.md.
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
    <!-- AllergyRecordListItem.vue -->
    <li
        class="allergy-record-list-item"
        :data-severity="severity"
    >
        <span class="allergy-record-list-item-substance">{{ substance }}</span
        ><template v-if="reaction"
            >{{ " " }}<span class="allergy-record-list-item-reaction">{{ reaction }}</span></template
        ><template v-if="severityLabel"
            >{{ " " }}<span class="allergy-record-list-item-severity">{{ severityLabel }}</span></template
        ><template v-if="updatedLabel"
            >{{ " "
            }}<time
                class="allergy-record-list-item-updated"
                :datetime="updated"
                >{{ updatedLabel }}</time
            ></template
        ><slot />
    </li>
</template>
