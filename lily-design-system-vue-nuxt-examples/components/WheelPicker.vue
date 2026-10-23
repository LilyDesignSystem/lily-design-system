<script setup lang="ts">

    // WheelPicker component
    //
    // A vertical single-select listbox where the selection follows the cursor: moving with the arrow keys, typing, or
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
    //   name — string, optional. When set, a hidden input carries the value for a form.
    //   ...restProps (attrs) — fall through onto the root <div>, with the consumer class after the base class.
    //
    // Markup:
    //   <div class="wheel-picker">
    //     <div class="wheel-picker-list" role="listbox" aria-orientation="vertical" tabindex="0" aria-activedescendant>
    //       <div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>…</div>
    //     </div>
    //     <input type="hidden" name value>   (only with `name`)
    //   </div>
    //
    // Keyboard (APG listbox, selection follows focus): ArrowDown / ArrowUp, Home / End, PageDown / PageUp, type-ahead over
    // the labels. Disabled options are skipped.

    import { computed, onMounted, ref, useId, watch, nextTick } from "vue";
    import {
        isWheelTypeaheadKey,
        nextWheelIndex,
        nextWheelPrefix,
        WHEEL_MOVE_KEYS,
        wheelTypeaheadIndex,
        type WheelMoveKey,
        type WheelOption,
        type WheelTypeahead,
    } from "./wheel-picker";

    const props = withDefaults(defineProps<{
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
        /** Form field name for a hidden input. */
        name?: string;
    }>(), {
        loop: false,
        pageSize: 5,
        disabled: false,
        name: undefined,
    });

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
        if (WHEEL_MOVE_KEYS.includes(event.key)) {
            event.preventDefault();
            select(nextWheelIndex(props.options, selectedIndex.value, event.key as WheelMoveKey, { loop: props.loop, pageSize: props.pageSize }));
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
        el.scrollTop = option.offsetTop - (el.clientHeight - option.offsetHeight) / 2;
    }
    onMounted(centre);
    watch(selectedIndex, () => nextTick(centre));
</script>

<template>
    <!-- WheelPicker.vue -->
    <div class="wheel-picker">
        <div
            ref="list"
            class="wheel-picker-list"
            role="listbox"
            :aria-label="label"
            aria-orientation="vertical"
            :aria-disabled="disabled ? 'true' : undefined"
            :aria-activedescendant="selectedIndex >= 0 ? `${uid}-option-${selectedIndex}` : undefined"
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
            >{{ option.label }}</div>
        </div>
        <input v-if="name" type="hidden" :name="name" :value="modelValue" />
    </div>
</template>
