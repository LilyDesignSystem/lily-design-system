<script setup lang="ts">
// ProblemRecordList: a list of a patient's problems and conditions, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: ProblemRecordList.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list. */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
}>();

warnMissingProp(
    "ProblemRecordList",
    "status",
    props.status,
    "A problem record list must say whether problems are known, none known, not recorded, unavailable, omitted or not applicable.",
);
warnMissingProp(
    "ProblemRecordList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);
</script>

<template>
    <!-- ProblemRecordList.vue -->
    <ul
        class="problem-record-list"
        :data-status="status"
        :aria-label="label ?? statusLabel"
    >
        <li
            v-if="status !== 'known'"
            class="problem-record-list-status"
        >
            {{ statusLabel }}
        </li>
        <slot />
    </ul>
</template>
