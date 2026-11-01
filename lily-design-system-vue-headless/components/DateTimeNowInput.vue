<script setup lang="ts">
// DateTimeNowInput component
//
// A headless component that wraps a native <input type="date">, <input type="time">,
// and <button type="button"> inside a <div>. The "Now" button sets both inputs to the
// current local date and time when clicked. Useful for event logging, timestamping,
// incident reporting, and any scenario where users need to quickly capture the current
// date and time or manually enter a specific date and time.
//
// Props:
//   label — string, required. Accessible name for the wrapper group via aria-label.
//   dateLabel — string, required. Accessible name for the date input via aria-label.
//   timeLabel — string, required. Accessible name for the time input via aria-label.
//   nowLabel — string, required. Accessible label and text for the "Now" button.
//   The three come from the locale-translations packs: dateTimeNowInputLabels(pack).
//   required — boolean, default false. Whether the inputs are required.
//   disabled — boolean, default false. Whether the inputs and button are disabled.
//
// Models:
//   dateValue — string, default "". Bindable date string (format: YYYY-MM-DD).
//   timeValue — string, default "". Bindable time string (format: HH:mm).
//
// Syntax:
//   <DateTimeNowInput label="Event time" v-bind="dateTimeNowInputLabels(en)" v-model:dateValue="date" v-model:timeValue="time" />
//
// Examples:
//   <!-- Basic usage -->
//   <DateTimeNowInput label="Event time" v-bind="dateTimeNowInputLabels(en)" v-model:dateValue="date" v-model:timeValue="time" />
//
//   <!-- Custom labels for internationalization -->
//   <DateTimeNowInput label="Heure" dateLabel="Date" timeLabel="Heure" nowLabel="Maintenant" v-model:dateValue="date" v-model:timeValue="time" />
//
// Keyboard:
//   - Tab: Moves focus between the date input, time input, and "Now" button
//   - Enter/Space on the "Now" button: Sets both inputs to the current date and time
//   - Arrow keys: Navigate within the date and time picker fields (native browser behavior)
//
// Accessibility:
//   - role="group" on the wrapper with aria-label for grouping
//   - aria-label on the date input provides the accessible name
//   - aria-label on the time input provides the accessible name
//   - aria-label on the "Now" button describes its purpose
//
// Internationalization:
//   - The label, dateLabel, timeLabel, and nowLabel props are the only user-facing strings
//   - No default labels: a missing one leaves its control unnamed rather than in English.
//     dateTimeNowInputLabels(pack) from the locale-translations package gives all three in 64 locales.
//   - No other hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//
// References:
//   - MDN date input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
//   - MDN time input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time

import { ref } from "vue";
import { useFormReset } from "./form-reset";

withDefaults(
    defineProps<{
        label: string;
        dateLabel: string;
        timeLabel: string;
        nowLabel: string;
        required?: boolean;
        disabled?: boolean;
    }>(),
    {
        required: false,
        disabled: false,
    },
);

const dateValue = defineModel<string>("dateValue", { default: "" });
const dateValueField = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(dateValue, dateValueField);
const timeValue = defineModel<string>("timeValue", { default: "" });
const timeValueField = ref<HTMLInputElement | HTMLTextAreaElement | null>(null);
useFormReset(timeValue, timeValueField);

function handleNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    dateValue.value = `${year}-${month}-${day}`;
    timeValue.value = `${hours}:${minutes}`;
}
</script>

<template>
    <!-- DateTimeNowInput.vue -->
    <div
        class="date-time-now-input"
        role="group"
        :aria-label="label"
    >
        <input
            type="date"
            :aria-label="dateLabel"
            ref="dateValueField"
            v-model="dateValue"
            :required="required"
            :disabled="disabled"
        />
        <input
            type="time"
            :aria-label="timeLabel"
            ref="timeValueField"
            v-model="timeValue"
            :required="required"
            :disabled="disabled"
        />
        <button
            type="button"
            :aria-label="nowLabel"
            @click="handleNow"
            :disabled="disabled"
        >
            {{ nowLabel }}
        </button>
    </div>
</template>
