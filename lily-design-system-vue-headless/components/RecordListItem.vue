<script setup lang="ts">
// RecordListItem: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Props: RecordListItem.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** withheld: content not shown, only the words; entered-in-error: content kept in a <del>, with the words. data-entry-state */
    entryState?: "withheld" | "entered-in-error";
    /** That state in the consumer's words; required with entryState. */
    entryStateLabel?: string;
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
if (props.entryState)
    warnMissingProp(
        "RecordListItem",
        "entryStateLabel",
        props.entryStateLabel,
        "a withheld or in-error entry must say so in words.",
    );
</script>

<template>
    <!-- RecordListItem.vue -->
    <li
        class="record-list-item"
        :data-status="status"
        :data-entry-state="entryState"
    >
        <template v-if="subjectLabel"
            ><span class="record-list-item-subject">{{ subjectLabel }}</span
            >{{ " " }}</template
        >
        <span
            v-if="entryState === 'withheld'"
            class="record-list-item-entry-state"
            >{{ entryStateLabel }}</span
        >
        <template v-else-if="entryState === 'entered-in-error'"
            ><del class="record-list-item-entry"><slot /></del>{{ " "
            }}<span class="record-list-item-entry-state">{{ entryStateLabel }}</span></template
        >
        <slot v-else />
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
