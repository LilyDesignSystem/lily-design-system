<script setup lang="ts">
// QuantityInputDiv: a quantity entered as a number and a unit, each unit with its own min, max and step (tasks.md P29-T8). A
// group with a labelled number input and, for more than one unit, a labelled unit <select>; one unit is text linked by
// aria-describedby. Nothing is converted. Props: QuantityInputDiv.md.
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from "vue";
import { warnMissingName, warnMissingProp } from "./dev-warning";

type Unit = { value: string; label: string; min?: number; max?: number; step?: number | "any" };

const props = withDefaults(
    defineProps<{
        /** The group's name. */
        label: string;
        /** The number input's label. */
        magnitudeLabel: string;
        /** The unit select's label; required when there is more than one unit. */
        unitLabel?: string;
        /** The units offered, each with its own limits; the first is the default. */
        units: Unit[];
        name?: string;
        required?: boolean;
        disabled?: boolean;
        id?: string;
    }>(),
    { unitLabel: undefined, name: undefined, required: false, disabled: false, id: undefined },
);

const magnitude = defineModel<string>("magnitude", { default: "" });
const unit = defineModel<string>("unit", { default: "" });
if (!unit.value) unit.value = props.units[0]?.value ?? "";

warnMissingName(
    "QuantityInputDiv",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);
warnMissingProp(
    "QuantityInputDiv",
    "magnitudeLabel",
    props.magnitudeLabel,
    "the number needs a label.",
);
if (props.units.length > 1)
    warnMissingProp(
        "QuantityInputDiv",
        "unitLabel",
        props.unitLabel,
        "the unit choice needs a label.",
    );

const generated = `quantity-input-div-${useId()}`;
const baseId = computed(() => props.id ?? generated);
const chosen = computed(() => props.units.find((u) => u.value === unit.value) ?? props.units[0]);
watch(
    () => props.units,
    (next) => {
        if (!next.some((u) => u.value === unit.value)) unit.value = next[0]?.value ?? "";
    },
);

// A form reset puts the native controls back; put the models back with them.
const root = ref<HTMLDivElement | null>(null);
const initial = { magnitude: magnitude.value, unit: unit.value };
let form: HTMLFormElement | null = null;
function onReset() {
    setTimeout(() => {
        magnitude.value = initial.magnitude;
        unit.value = initial.unit;
    }, 0);
}
onMounted(() => {
    form = root.value?.closest("form") ?? null;
    form?.addEventListener("reset", onReset);
});
onBeforeUnmount(() => form?.removeEventListener("reset", onReset));
</script>

<template>
    <!-- QuantityInputDiv.vue -->
    <div
        ref="root"
        class="quantity-input-div"
        role="group"
        :aria-label="label"
    >
        <label :for="`${baseId}-magnitude`">{{ magnitudeLabel }}</label>
        <input
            :id="`${baseId}-magnitude`"
            v-model="magnitude"
            class="quantity-input-div-magnitude"
            :name="name ? `${name}-magnitude` : undefined"
            type="number"
            inputmode="decimal"
            :min="chosen?.min"
            :max="chosen?.max"
            :step="chosen?.step"
            :aria-describedby="units.length === 1 ? `${baseId}-unit` : undefined"
            :required="required"
            :disabled="disabled"
        />
        <template v-if="units.length > 1">
            <label :for="`${baseId}-unit`">{{ unitLabel }}</label>
            <select
                :id="`${baseId}-unit`"
                v-model="unit"
                class="quantity-input-div-unit"
                :name="name ? `${name}-unit` : undefined"
                :required="required"
                :disabled="disabled"
            >
                <option
                    v-for="option in units"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
        </template>
        <template v-else-if="units.length === 1">
            <span
                :id="`${baseId}-unit`"
                class="quantity-input-div-unit"
                >{{ units[0].label }}</span
            >
            <input
                v-if="name"
                type="hidden"
                :name="`${name}-unit`"
                :value="units[0].value"
            />
        </template>
    </div>
</template>
