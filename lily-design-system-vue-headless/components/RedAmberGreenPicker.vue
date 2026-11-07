<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
// RedAmberGreenPicker component
//
// A picker for a red/amber/green (RAG) status: a <fieldset role="radiogroup"> of native radios, one per status (red, amber, green), as
// five-star-rating-picker is. The radios give the keys, form submission and form reset natively.
//
// Props:
//   label — string, required. Accessible name for the group via aria-label.
//   statusLabel — (status: string) => string, required. Each option's visible text; without it the option shows its
//     value, so a consumer always supplies the words.
//   modelValue — string, default "". The checked status ("" = none); v-model.
//   name — string, default "status". Radio group name for form submission.
//   disabled — boolean, default false.
//
// Keyboard: native radios. Tab focuses the checked radio; the arrows move and check; Space checks.
//
// References:
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

const props = withDefaults(
    defineProps<{
        /** Accessible name for the group via aria-label. */
        label: string;
        /** Radio group name for form submission. */
        name?: string;
        /** Each option's visible text, e.g. (status) => labels[status]. No English default. */
        statusLabel: (status: string) => string;
        /** Whether the entire group is disabled. */
        disabled?: boolean;
    }>(),
    {
        name: "status",
        disabled: false,
    },
);

const attrs = useAttrs();
warnMissingName(
    "RedAmberGreenPicker",
    props.label,
    attrs["aria-label"] as string | undefined,
    attrs["aria-labelledby"] as string | undefined,
);

const modelValue = defineModel<string>({ default: "" });
const initialValue = modelValue.value;

const root = ref<HTMLElement | null>(null);
let resetForm: HTMLFormElement | null = null;
let resetTimer: ReturnType<typeof setTimeout> | undefined;
function onReset(event: Event): void {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        if (event.defaultPrevented || !root.value) return;
        modelValue.value = initialValue;
        for (const input of root.value.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
            input.checked = input.value === initialValue;
        }
    }, 0);
}
onMounted(() => {
    resetForm = root.value?.closest("form") ?? null;
    resetForm?.addEventListener("reset", onReset);
});
onBeforeUnmount(() => {
    clearTimeout(resetTimer);
    resetForm?.removeEventListener("reset", onReset);
});

const statuses = ["red", "amber", "green"];
</script>

<template>
    <!-- RedAmberGreenPicker.vue -->
    <fieldset
        ref="root"
        class="red-amber-green-picker"
        role="radiogroup"
        :aria-label="label"
        :disabled="disabled"
    >
        <label
            v-for="status in statuses"
            :key="status"
        >
            <input
                type="radio"
                :name="name"
                :value="status"
                :checked="modelValue === status"
                @change="modelValue = status"
            />
            {{ statusLabel ? statusLabel(status) : status }}
        </label>
    </fieldset>
</template>
