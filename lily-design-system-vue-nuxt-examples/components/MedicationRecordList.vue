<script setup lang="ts">
// MedicationRecordList: a list of a patient's medicines, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: MedicationRecordList.md.
import { warnMissingProp } from "./dev-warning";
import { useRecordList } from "./use-record-list";

const props = defineProps<{
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list. */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    /** Your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; it never says both. */
    conflictLabel?: string;
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

const { list, shown } = useRecordList("MedicationRecordList", "medication-record-list", props);
</script>

<template>
    <!-- MedicationRecordList.vue -->
    <ul
        ref="list"
        class="medication-record-list"
        :data-status="shown.status"
        :aria-label="shown.name"
    >
        <li
            v-if="shown.showItem"
            class="medication-record-list-status"
        >
            {{ shown.words }}
        </li>
        <slot />
    </ul>
</template>
