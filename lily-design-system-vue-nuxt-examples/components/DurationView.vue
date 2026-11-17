<script setup lang="ts">
// DurationView: a length of time in the consumer's words, in a <time> whose datetime is the ISO 8601 duration (tasks.md P29-T6). A negative
// duration renders its length as datetime and data-negative; years and months are no datetime. Props: DurationView.md.
import { computed } from "vue";
import { htmlDuration } from "./clinical-format";
import { warnMissingProp } from "./dev-warning";

const props = defineProps<{
    /** The length of time as the consumer writes it. */
    value: string;
    /** The same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative. */
    duration: string;
    /** Hidden text naming the value. */
    label?: string;
}>();

const parsed = computed(() => htmlDuration(props.duration));
warnMissingProp(
    "DurationView",
    "value",
    props.value,
    "a length of time needs words a person can read, never an ISO code alone.",
);
warnMissingProp(
    "DurationView",
    "duration",
    parsed.value?.datetime,
    "datetime takes an ISO 8601 duration of days, hours, minutes and seconds; use age-view or plain text for years and months.",
);
</script>

<template>
    <!-- DurationView.vue -->
    <time
        class="duration-view"
        :datetime="parsed?.datetime"
        :data-negative="parsed?.negative ? '' : undefined"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        >{{ value }}</time
    >
</template>
