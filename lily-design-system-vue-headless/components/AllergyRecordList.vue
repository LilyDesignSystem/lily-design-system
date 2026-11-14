<script setup lang="ts">
// AllergyRecordList: a list of a patient's allergies and intolerances, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: AllergyRecordList.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted";
    /** The consumer's words for the status; names the list. */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
}>();

warnMissingProp(
    "AllergyRecordList",
    "status",
    props.status,
    "A allergy record list must say whether allergies are known, none known, not recorded, unavailable or omitted.",
);
warnMissingProp(
    "AllergyRecordList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);
</script>

<template>
    <!-- AllergyRecordList.vue -->
    <ul
        class="allergy-record-list"
        :data-status="status"
        :aria-label="label ?? statusLabel"
    >
        <li
            v-if="status !== 'known'"
            class="allergy-record-list-status"
        >
            {{ statusLabel }}
        </li>
        <slot />
    </ul>
</template>
