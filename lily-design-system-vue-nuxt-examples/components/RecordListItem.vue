<script setup lang="ts">
// RecordListItem: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Props: RecordListItem.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** the record's status, as the consumer's code */
    status?: string;
    statusLabel?: string;
    /** when the record was last updated */
    updated?: string;
    updatedLabel?: string;
}>();

if (props.status)
    warnMissingProp(
        "RecordListItem",
        "statusLabel",
        props.statusLabel,
        "a status needs words a person can read, never a code alone.",
    );
</script>

<template>
    <!-- RecordListItem.vue -->
    <li
        class="record-list-item"
        :data-status="status"
    >
        <template v-if="subjectLabel"
            ><span class="record-list-item-subject">{{ subjectLabel }}</span
            >{{ " " }}</template
        >
        <slot />
        <template v-if="statusLabel"
            >{{ " " }}<span class="record-list-item-status">{{ statusLabel }}</span></template
        >
        <template v-if="updatedLabel"
            >{{ " "
            }}<time
                class="record-list-item-updated"
                :datetime="updated"
                >{{ updatedLabel }}</time
            ></template
        >
    </li>
</template>
