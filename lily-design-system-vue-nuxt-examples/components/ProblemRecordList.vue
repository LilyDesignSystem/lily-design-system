<script setup lang="ts">
// ProblemRecordList: a list of a patient's problems and conditions, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: ProblemRecordList.md.
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

const { list, shown } = useRecordList("ProblemRecordList", "problem-record-list", props);
</script>

<template>
    <!-- ProblemRecordList.vue -->
    <ul
        ref="list"
        class="problem-record-list"
        :data-status="shown.status"
        :aria-label="shown.name"
    >
        <li
            v-if="shown.showItem"
            class="problem-record-list-status"
        >
            {{ shown.words }}
        </li>
        <slot />
    </ul>
</template>
