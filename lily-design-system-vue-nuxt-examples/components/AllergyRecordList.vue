<script setup lang="ts">
// AllergyRecordList: a list of a patient's allergies and intolerances, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: AllergyRecordList.md.
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
    "AllergyRecordList",
    "status",
    props.status,
    "A allergy record list must say whether allergies are known, none known, not recorded, unavailable, omitted or not applicable.",
);
warnMissingProp(
    "AllergyRecordList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);

const { list, shown } = useRecordList("AllergyRecordList", "allergy-record-list", props);
</script>

<template>
    <!-- AllergyRecordList.vue -->
    <ul
        ref="list"
        class="allergy-record-list"
        :data-status="shown.status"
        :aria-label="shown.name"
    >
        <li
            v-if="shown.showItem"
            class="allergy-record-list-status"
        >
            {{ shown.words }}
        </li>
        <slot />
    </ul>
</template>
