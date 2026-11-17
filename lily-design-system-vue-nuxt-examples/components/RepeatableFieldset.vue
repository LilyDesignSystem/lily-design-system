<script setup lang="ts" generic="T">
// RepeatableFieldset: the "add another" pattern (tasks.md P29-T10): a <fieldset> holding one <fieldset> per item, each with a
// legend and a remove button, and an add button. The items are the consumer's; legends and labels come from functions of the
// item's number. Focus moves to the new item's first field on add, to the add button on remove. Props: RepeatableFieldset.md.
import { nextTick, ref, watch } from "vue";
import { warnMissingProp } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        legend: string;
        newItem: () => T;
        itemLegend: (number: number) => string;
        addLabel: string;
        removeLabel: (number: number) => string;
        min?: number;
        max?: number;
        addedLabel?: (number: number) => string;
        removedLabel?: (number: number) => string;
    }>(),
    { min: 0, max: undefined, addedLabel: undefined, removedLabel: undefined },
);
const items = defineModel<T[]>("items", { default: () => [] });
defineSlots<{ item(props: { item: T; index: number }): unknown }>();

warnMissingProp("RepeatableFieldset", "legend", props.legend, "the group needs a name.");
warnMissingProp("RepeatableFieldset", "addLabel", props.addLabel, "the add button needs words.");

const root = ref<HTMLFieldSetElement | null>(null);
const addButton = ref<HTMLButtonElement | null>(null);
const status = ref("");
const canAdd = () => props.max === undefined || items.value.length < props.max;
const canRemove = () => items.value.length > props.min;

// Focus waits for the parent to pass the new items back, so it runs after they render.
let pendingFocus: number | null = null;
watch(
    () => items.value.length,
    () => {
        if (pendingFocus === null) return;
        const index = pendingFocus;
        pendingFocus = null;
        root.value
            ?.querySelectorAll<HTMLFieldSetElement>(":scope > .repeatable-fieldset-item")
            [index]?.querySelector<HTMLElement>(
                "input, select, textarea, button, [tabindex]:not([tabindex='-1'])",
            )
            ?.focus();
    },
    { flush: "post" },
);

function add() {
    if (!canAdd()) return;
    const index = items.value.length;
    pendingFocus = index;
    items.value = [...items.value, props.newItem()];
    status.value = props.addedLabel?.(index + 1) ?? "";
}

async function remove(index: number) {
    if (!canRemove()) return;
    items.value = items.value.filter((_, i) => i !== index);
    status.value = props.removedLabel?.(index + 1) ?? "";
    await nextTick();
    addButton.value?.focus();
}
</script>

<template>
    <!-- RepeatableFieldset.vue -->
    <fieldset
        ref="root"
        class="repeatable-fieldset"
        :data-count="items.length"
    >
        <legend>{{ legend }}</legend>
        <fieldset
            v-for="(entry, index) in items"
            :key="index"
            class="repeatable-fieldset-item"
            :data-index="index"
        >
            <legend class="repeatable-fieldset-item-legend">{{ itemLegend(index + 1) }}</legend>
            <slot
                name="item"
                :item="entry"
                :index="index"
            />
            <button
                v-if="canRemove()"
                type="button"
                class="repeatable-fieldset-remove"
                @click="remove(index)"
            >
                {{ removeLabel(index + 1) }}
            </button>
        </fieldset>
        <button
            ref="addButton"
            type="button"
            class="repeatable-fieldset-add"
            :disabled="!canAdd()"
            @click="add"
        >
            {{ addLabel }}
        </button>
        <p
            v-if="addedLabel || removedLabel"
            class="repeatable-fieldset-status"
            role="status"
        >
            {{ status }}
        </p>
    </fieldset>
</template>
