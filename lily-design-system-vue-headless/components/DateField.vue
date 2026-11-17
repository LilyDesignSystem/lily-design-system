<script setup lang="ts">
// DateField component
//
// A date asked for as three parts, day, month and year, in a <fieldset> named by its
// <legend>, with optional helper text and an error message, all linked by generated
// ids. It suits dates people know by heart, such as a date of birth. The order of the
// parts and every label are the consumer's: there is no regional or English default.
//
// Props:
//   label — string, required. The legend, naming the whole date.
//   dayLabel, monthLabel, yearLabel — string. The parts' labels; each is required when its part is shown.
//   order — "ymd" | "dmy" | "mdy", default "ymd" (ISO 8601). The order of the parts.
//   precision — "day" | "month" | "year", default "day". A month asks for month and year, a year for the year alone;
//     the value is YYYY-MM or YYYY, never padded with an invented day or month (openEHR DV_DATE, FHIR partial dates).
//   v-model — string, default "". YYYY-MM-DD once all three parts are filled, else "".
//     A new value fills the parts.
//   name — string, optional. Base name: the parts are {name}-day, -month, -year.
//   autocomplete — "bday", optional. A date of birth: the parts autocomplete as bday-day, -month, -year.
//   description — string, optional. Helper text, linked from the fieldset.
//   error — string, optional. Error message, linked from the fieldset and announced.
//   required — boolean, default false. Every part is required.
//   disabled — boolean, default false. The fieldset and its parts are disabled.
//   id — string, optional. Base id: the parts are {id}-day, -month, -year.
//
// Syntax:
//   <DateField label="Date of birth" day-label="Day" month-label="Month" year-label="Year" v-model="dob" />
//
// Keyboard:
//   - Tab moves between the parts; each is a native text field
//
// Accessibility:
//   - <fieldset> + <legend> name the group, announced with each part
//   - <label for> names each part
//   - aria-describedby on the fieldset links the description and the error
//   - aria-invalid="true" on each part while an error is shown
//   - role="alert" on the error paragraph announces it
//
// Internationalization:
//   - Every label is a prop, and the order is a prop: no English, no regional default
//
// References:
//   - WAI Forms Tutorial, grouping controls: https://www.w3.org/WAI/tutorials/forms/grouping/

import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from "vue";
import { warnMissingName, warnMissingProp } from "./dev-warning";

type Part = "day" | "month" | "year";
type Parts = Record<Part, string>;

const props = withDefaults(
    defineProps<{
        /** The legend, naming the whole date. */
        label: string;
        /** The day part's label; required when precision is "day". */
        dayLabel?: string;
        /** The month part's label; required unless precision is "year". */
        monthLabel?: string;
        /** The year part's label. */
        yearLabel: string;
        /** The order of the parts. Default "ymd" (ISO 8601). */
        order?: "ymd" | "dmy" | "mdy";
        /** How much of the date is asked for. Default "day". */
        precision?: "day" | "month" | "year";
        /** Base name: the parts are {name}-day, {name}-month, {name}-year. */
        name?: string;
        /** "bday" for a date of birth. */
        autocomplete?: "bday";
        /** Helper text, linked from the fieldset. */
        description?: string;
        /** Error message, linked from the fieldset and announced. */
        error?: string;
        /** Every part is required. */
        required?: boolean;
        /** The fieldset and its parts are disabled. */
        disabled?: boolean;
        /** Base id for the parts; auto-generated if omitted. */
        id?: string;
    }>(),
    {
        dayLabel: undefined,
        monthLabel: undefined,
        order: "ymd",
        precision: "day",
        name: undefined,
        autocomplete: undefined,
        description: undefined,
        error: undefined,
        required: false,
        disabled: false,
        id: undefined,
    },
);

const modelValue = defineModel<string>({ default: "" });
warnMissingName("DateField", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const SEQUENCES: Record<"ymd" | "dmy" | "mdy", Part[]> = {
    ymd: ["year", "month", "day"],
    dmy: ["day", "month", "year"],
    mdy: ["month", "day", "year"],
};

type Precision = "day" | "month" | "year";

/** The parts shown at each precision, in ISO order. */
const PARTS: Record<Precision, Part[]> = {
    day: ["year", "month", "day"],
    month: ["year", "month"],
    year: ["year"],
};

/** The parts of a value of this precision (YYYY-MM-DD, YYYY-MM or YYYY), or empty parts for anything else. */
function split(v: string | null | undefined, shown: Part[]): Parts {
    const m = /^(\d{1,4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/.exec(v ?? "");
    const filled = m ? [m[1], m[2], m[3]].filter((x) => x !== undefined).length : 0;
    if (!m || filled !== shown.length) return { year: "", month: "", day: "" };
    return { year: m[1], month: m[2] ?? "", day: m[3] ?? "" };
}

/** The value when every shown part is a number, else "". The calendar check is the consumer's. */
function join(p: Parts, shown: Part[]): string {
    if (!shown.every((part) => /^\d+$/.test(p[part]))) return "";
    const iso = [p.year.padStart(4, "0"), p.month.padStart(2, "0"), p.day.padStart(2, "0")];
    return iso.slice(0, shown.length).join("-");
}

const shownParts = computed(() => PARTS[props.precision] ?? PARTS.day);
if (shownParts.value.includes("day"))
    warnMissingProp("DateField", "dayLabel", props.dayLabel, "the day part needs a label.");
if (shownParts.value.includes("month"))
    warnMissingProp("DateField", "monthLabel", props.monthLabel, "the month part needs a label.");

const generatedId = `date-field-${useId()}`;
const baseId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() => `${baseId.value}-desc`);
const errorId = computed(() => `${baseId.value}-error`);
const describedBy = computed(
    () =>
        [props.description ? descriptionId.value : "", props.error ? errorId.value : ""]
            .filter(Boolean)
            .join(" ") || undefined,
);
const labels = computed<Parts>(() => ({
    day: props.dayLabel ?? "",
    month: props.monthLabel ?? "",
    year: props.yearLabel,
}));
const sequence = computed(() =>
    (SEQUENCES[props.order] ?? SEQUENCES.ymd).filter((part) => shownParts.value.includes(part)),
);

const parts = ref<Parts>(split(modelValue.value, shownParts.value));
watch(modelValue, (value) => {
    // A value set from outside fills the parts; one the parts produced leaves them as typed.
    if (value !== join(parts.value, shownParts.value)) parts.value = split(value, shownParts.value);
});

function update(part: Part, text: string) {
    parts.value = { ...parts.value, [part]: text };
    modelValue.value = join(parts.value, shownParts.value);
}

// A form reset blanks the parts in the DOM; put the model and the parts back to the first value.
const root = ref<HTMLFieldSetElement | null>(null);
const initial = modelValue.value;
let form: HTMLFormElement | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
function onReset(event: Event) {
    clearTimeout(timer);
    timer = setTimeout(() => {
        if (event.defaultPrevented) return;
        modelValue.value = initial;
        parts.value = split(initial, shownParts.value);
    }, 0);
}
onMounted(() => {
    form = root.value?.closest("form") ?? null;
    form?.addEventListener("reset", onReset);
});
onBeforeUnmount(() => {
    clearTimeout(timer);
    form?.removeEventListener("reset", onReset);
});
</script>

<template>
    <!-- DateField.vue -->
    <fieldset
        ref="root"
        class="date-field"
        :data-precision="precision === 'day' ? undefined : precision"
        :aria-describedby="describedBy"
        :disabled="disabled"
    >
        <legend>{{ label }}</legend>
        <template
            v-for="part in sequence"
            :key="part"
        >
            <label :for="`${baseId}-${part}`">{{ labels[part] }}</label>
            <input
                :class="`date-field-${part}`"
                :id="`${baseId}-${part}`"
                :name="name ? `${name}-${part}` : undefined"
                type="text"
                inputmode="numeric"
                :autocomplete="autocomplete === 'bday' ? `bday-${part}` : undefined"
                :maxlength="part === 'year' ? 4 : 2"
                :value="parts[part]"
                :required="required"
                :aria-invalid="error ? true : undefined"
                @input="update(part, ($event.target as HTMLInputElement).value)"
            />
        </template>
        <p
            v-if="description"
            :id="descriptionId"
        >
            {{ description }}
        </p>
        <p
            v-if="error"
            :id="errorId"
            role="alert"
        >
            {{ error }}
        </p>
    </fieldset>
</template>
