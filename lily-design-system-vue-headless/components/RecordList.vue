<script setup lang="ts">
// RecordList: a list of records from one section of a patient's record, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: RecordList.md.
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
    /** What this list is a view of, in the consumer's words: its window and order, what it leaves out and why, and which sources did not answer. Rendered first, as an item of its own (spec/lessons/zoblocks). */
    coverageLabel?: string;
}>();

warnMissingProp(
    "RecordList",
    "status",
    props.status,
    "A record list must say whether records are known, none known, not recorded, unavailable, omitted or not applicable.",
);
warnMissingProp(
    "RecordList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);

const { list, shown } = useRecordList("RecordList", "record-list", props);
</script>

<template>
    <!-- RecordList.vue -->
    <ul
        ref="list"
        class="record-list"
        :data-status="shown.status"
        :aria-label="shown.name"
    >
        <li
            v-if="coverageLabel"
            class="record-list-coverage"
        >
            {{ coverageLabel }}
        </li>
        <li
            v-if="shown.showItem"
            class="record-list-status"
        >
            {{ shown.words }}
        </li>
        <slot />
    </ul>
</template>
