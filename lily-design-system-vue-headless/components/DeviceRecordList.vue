<script setup lang="ts">
// DeviceRecordList: a list of a patient's medical devices, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui). For any status but "known", statusLabel is
// the list's one item. Props and rules: DeviceRecordList.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list. */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
}>();

warnMissingProp(
    "DeviceRecordList",
    "status",
    props.status,
    "A device record list must say whether devices are known, none known, not recorded, unavailable, omitted or not applicable.",
);
warnMissingProp(
    "DeviceRecordList",
    "statusLabel",
    props.statusLabel,
    "The status needs words a person can read.",
);
</script>

<template>
    <!-- DeviceRecordList.vue -->
    <ul
        class="device-record-list"
        :data-status="status"
        :aria-label="label ?? statusLabel"
    >
        <li
            v-if="status !== 'known'"
            class="device-record-list-status"
        >
            {{ statusLabel }}
        </li>
        <slot />
    </ul>
</template>
