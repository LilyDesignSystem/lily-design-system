<script setup lang="ts">
// AllergyList: a patient's allergies and intolerances, whose status is never blank (spec/healthcare-ui item 2). For any
// status but "known", statusLabel is the list's one item. Props and rules: AllergyList.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    status: "known" | "none-known" | "not-recorded" | "unavailable";
    /** The consumer's words for the status; names the list. */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
}>();

warnMissingProp(
    "AllergyList",
    "status",
    props.status,
    "An allergy list must say whether allergies are known, none known, not recorded or unavailable.",
);
warnMissingProp(
    "AllergyList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);
</script>

<template>
    <!-- AllergyList.vue -->
    <ul
        class="allergy-list"
        :data-status="status"
        :aria-label="label ?? statusLabel"
    >
        <li
            v-if="status !== 'known'"
            class="allergy-list-status"
        >
            {{ statusLabel }}
        </li>
        <slot />
    </ul>
</template>
