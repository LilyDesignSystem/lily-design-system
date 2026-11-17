<script setup lang="ts">
// MedicationRecordListItem: one medicine in a medication record list, with its status and when it applies (tasks.md P28-T3, spec/healthcare-ui). Props: MedicationRecordListItem.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** FHIR MedicationStatement status */
    status?:
        | "active"
        | "completed"
        | "entered-in-error"
        | "intended"
        | "stopped"
        | "on-hold"
        | "unknown"
        | "not-taken";
    statusLabel?: string;
    /** when the medicine applies, for <time datetime> */
    effective?: string;
    effectiveLabel?: string;
}>();

if (props.status)
    warnMissingProp(
        "MedicationRecordListItem",
        "statusLabel",
        props.statusLabel,
        "a status needs words a person can read, never a code alone.",
    );
</script>

<template>
    <!-- MedicationRecordListItem.vue -->
    <li
        class="medication-record-list-item"
        :data-status="status"
    >
        <template v-if="subjectLabel"
            ><span class="medication-record-list-item-subject">{{ subjectLabel }}</span
            >{{ " " }}</template
        >
        <slot />
        <template v-if="statusLabel"
            >{{ " "
            }}<span class="medication-record-list-item-status">{{ statusLabel }}</span></template
        >
        <template v-if="effectiveLabel"
            >{{ " "
            }}<time
                class="medication-record-list-item-effective"
                :datetime="effective"
                >{{ effectiveLabel }}</time
            ></template
        >
    </li>
</template>
