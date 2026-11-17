<script setup lang="ts">
// MedicationRecordList: a list of a patient's medicines, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: MedicationRecordList.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list. */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
}>();

warnMissingProp(
    "MedicationRecordList",
    "status",
    props.status,
    "A medication record list must say whether medicines are known, none known, not recorded, unavailable, omitted or not applicable.",
);
warnMissingProp(
    "MedicationRecordList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);
</script>

<template>
    <!-- MedicationRecordList.vue -->
    <ul
        class="medication-record-list"
        :data-status="status"
        :aria-label="label ?? statusLabel"
    >
        <li
            v-if="status !== 'known'"
            class="medication-record-list-status"
        >
            {{ statusLabel }}
        </li>
        <slot />
    </ul>
</template>
