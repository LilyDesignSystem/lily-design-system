<script setup lang="ts">
// ImmunizationRecordList: a list of a patient's immunizations, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: ImmunizationRecordList.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted";
    /** The consumer's words for the status; names the list. */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
}>();

warnMissingProp(
    "ImmunizationRecordList",
    "status",
    props.status,
    "A immunization record list must say whether immunizations are known, none known, not recorded, unavailable or omitted.",
);
warnMissingProp(
    "ImmunizationRecordList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);
</script>

<template>
    <!-- ImmunizationRecordList.vue -->
    <ul
        class="immunization-record-list"
        :data-status="status"
        :aria-label="label ?? statusLabel"
    >
        <li
            v-if="status !== 'known'"
            class="immunization-record-list-status"
        >
            {{ statusLabel }}
        </li>
        <slot />
    </ul>
</template>
