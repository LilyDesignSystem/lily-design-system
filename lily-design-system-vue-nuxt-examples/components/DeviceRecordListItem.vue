<script setup lang="ts">
// DeviceRecordListItem: one medical device in a device record list, with its status and when it was used (tasks.md P28-T3, spec/healthcare-ui). Props: DeviceRecordListItem.md.
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** the device; never truncated */
    device: string;
    /** FHIR DeviceUseStatement status */
    status?: "active" | "completed" | "entered-in-error" | "intended" | "stopped" | "on-hold";
    statusLabel?: string;
    /** when it was used, for <time datetime> */
    timing?: string;
    timingLabel?: string;
}>();

if (props.status)
    warnMissingProp(
        "DeviceRecordListItem",
        "statusLabel",
        props.statusLabel,
        "a status needs words a person can read, never a code alone.",
    );
</script>

<template>
    <!-- DeviceRecordListItem.vue -->
    <li
        class="device-record-list-item"
        :data-status="status"
    >
        <span class="device-record-list-item-device">{{ device }}</span>
        <template v-if="statusLabel"
            >{{ " "
            }}<span class="device-record-list-item-status">{{ statusLabel }}</span></template
        >
        <template v-if="timingLabel"
            >{{ " "
            }}<time
                class="device-record-list-item-timing"
                :datetime="timing"
                >{{ timingLabel }}</time
            ></template
        >
        <slot />
    </li>
</template>
