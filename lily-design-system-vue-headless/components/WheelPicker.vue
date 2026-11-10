<script setup lang="ts">
// WheelPicker component
//
// A single-select listbox, vertical by default, where the selection follows the cursor: moving with the arrow keys, typing, or
// clicking an option chooses it. Use it to pick one of a short list (hours, minutes, months, years) in the manner of a
// scroll wheel. The component owns the roles and the keys; the wheel LOOK (scroll snapping, fading, 3-D) is the
// consumer's CSS.
//
// Props:
//   label — string, required. Accessible name of the listbox.
//   options — { value: string; label: string; disabled?: boolean }[], required.
//   v-model — string. The selected option's value; "" or an unknown value selects nothing.
//   loop — boolean, default false. Arrow keys wrap from the last enabled option to the first and back.
//   pageSize — number, default 5. Enabled options PageUp / PageDown move by.
//   disabled — boolean, default false. Ignores keys and clicks; not focusable.
//   orientation — "vertical" | "horizontal", default "vertical". Horizontal moves with ArrowLeft / ArrowRight, swapped
//     right-to-left (the nearest `dir`).
//   name — string, optional. When set, a hidden input carries the value for a form. It is disabled, so not submitted,
//     while the picker is disabled, and a form reset puts the picker back to the value it was given first.
//   form — string, optional. The id of the form the hidden input belongs to, when the picker sits outside it.
//   ...restProps (attrs) — fall through onto the root <div>, with the consumer class after the base class.
//
// Markup:
//   <div class="wheel-picker">
//     <div class="wheel-picker-list" role="listbox" aria-orientation tabindex="0" aria-activedescendant>
//       <div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>…</div>
//     </div>
//     <input type="hidden" name value form? disabled?>   (only with `name`)
//   </div>
//
// Keyboard (APG listbox, selection follows focus): ArrowDown / ArrowUp (ArrowRight / ArrowLeft when horizontal), Home / End, PageDown / PageUp, type-ahead over
// the labels. Disabled options are skipped.

import { computed, onBeforeUnmount, onMounted, ref, useId, watch, nextTick, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";
import {
    isWheelRtl,
    isWheelTypeaheadKey,
    nextWheelIndex,
    nextWheelPrefix,
    wheelMoveKey,
    wheelTypeaheadIndex,
    type WheelOption,
    type WheelOrientation,
    type WheelTypeahead,
} from "./wheel-picker";

const props = withDefaults(
    defineProps<{
        /** Accessible name. */
        label: string;
        /** The choices. */
        options: WheelOption[];
        /** Arrow keys wrap at the ends. */
        loop?: boolean;
        /** Enabled options PageUp / PageDown move by. */
        pageSize?: number;
        /** Ignores keys and clicks. */
        disabled?: boolean;
        /** The axis the options run along. Default "vertical". */
        orientation?: WheelOrientation;
        /** Form field name for a hidden input. */
        name?: string;
        /** The id of the form the hidden input belongs to, when the picker is outside it. */
        form?: string;
    }>(),
    {
        loop: false,
        pageSize: 5,
        disabled: false,
        orientation: "vertical",
        name: undefined,
        form: undefined,
    },
);

warnMissingName(
    "WheelPicker",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const modelValue = defineModel<string>({ default: "" });

const uid = useId();
const list = ref<HTMLElement | null>(null);
let typeahead: WheelTypeahead = { prefix: "", at: 0 };

const selectedIndex = computed(() => props.options.findIndex((o) => o.value === modelValue.value));

function select(index: number): void {
    if (index < 0) return;
    const next = props.options[index].value;
    if (next === modelValue.value) return; // applying the selection already held is a no-op
    modelValue.value = next;
}

function onKeydown(event: KeyboardEvent): void {
    if (props.disabled) return;
    const move = wheelMoveKey(
        event.key,
        props.orientation,
        list.value ? isWheelRtl(list.value) : false,
    );
    if (move) {
        event.preventDefault();
        select(
            nextWheelIndex(props.options, selectedIndex.value, move, {
                loop: props.loop,
                pageSize: props.pageSize,
            }),
        );
    } else if (isWheelTypeaheadKey(event)) {
        typeahead = nextWheelPrefix(typeahead, event.key, Date.now());
        select(wheelTypeaheadIndex(props.options, selectedIndex.value, typeahead.prefix));
    }
}

function onClick(event: MouseEvent): void {
    if (props.disabled) return;
    const target = (event.target as Element).closest<HTMLElement>('[role="option"]');
    if (!target || target.getAttribute("aria-disabled") === "true") return;
    select(Number(target.getAttribute("data-index")));
    list.value?.focus();
}

// Keep the selected option centred in the list. Only the list scrolls (never the page), and instantly: no animation.
function centre(): void {
    const el = list.value;
    if (!el || selectedIndex.value < 0) return;
    const option = el.querySelector<HTMLElement>(`[data-index="${selectedIndex.value}"]`);
    if (!option) return;
    // Move by the distance between the two middles: it works on either axis and in right-to-left.
    const box = el.getBoundingClientRect();
    const row = option.getBoundingClientRect();
    if (props.orientation === "horizontal")
        el.scrollLeft += row.left + row.width / 2 - (box.left + box.width / 2);
    else el.scrollTop += row.top + row.height / 2 - (box.top + box.height / 2);
}
onMounted(centre);
watch(selectedIndex, () => nextTick(centre));

// Form reset: a hidden input keeps its value through a reset, so put the picker back to the value it was given first, one
// tick after `reset`, and not when the reset was cancelled.
const initialValue = modelValue.value;
let owner: HTMLElement | null | undefined;
let resetTimer: ReturnType<typeof setTimeout> | undefined;
function onReset(event: Event): void {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        if (!event.defaultPrevented) modelValue.value = initialValue;
    }, 0);
}
onMounted(() => {
    owner = props.form ? document.getElementById(props.form) : list.value?.closest("form");
    owner?.addEventListener("reset", onReset);
});
onBeforeUnmount(() => {
    clearTimeout(resetTimer);
    owner?.removeEventListener("reset", onReset);
});
</script>

<template>
    <!-- WheelPicker.vue -->
    <div class="wheel-picker">
        <div
            ref="list"
            class="wheel-picker-list"
            role="listbox"
            :aria-label="label"
            :aria-orientation="orientation"
            :aria-disabled="disabled ? 'true' : undefined"
            :aria-activedescendant="
                selectedIndex >= 0 ? `${uid}-option-${selectedIndex}` : undefined
            "
            :tabindex="disabled ? -1 : 0"
            @keydown="onKeydown"
            @click="onClick"
        >
            <div
                v-for="(option, index) in options"
                :key="option.value"
                class="wheel-picker-option"
                role="option"
                :id="`${uid}-option-${index}`"
                :aria-selected="index === selectedIndex"
                :aria-disabled="option.disabled ? 'true' : undefined"
                :data-value="option.value"
                :data-index="index"
            >
                {{ option.label }}
            </div>
        </div>
        <input
            v-if="name"
            type="hidden"
            :name="name"
            :value="modelValue"
            :form="form"
            :disabled="disabled"
        />
    </div>
</template>
