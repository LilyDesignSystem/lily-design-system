<script setup lang="ts">
// ProcedureRecordList: a list of a patient's procedures, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: ProcedureRecordList.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list. */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
}>();

warnMissingProp(
    "ProcedureRecordList",
    "status",
    props.status,
    "A procedure record list must say whether procedures are known, none known, not recorded, unavailable, omitted or not applicable.",
);
warnMissingProp(
    "ProcedureRecordList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);
</script>

<template>
    <!-- ProcedureRecordList.vue -->
    <ul
        class="procedure-record-list"
        :data-status="status"
        :aria-label="label ?? statusLabel"
    >
        <li
            v-if="status !== 'known'"
            class="procedure-record-list-status"
        >
            {{ statusLabel }}
        </li>
        <slot />
    </ul>
</template>
