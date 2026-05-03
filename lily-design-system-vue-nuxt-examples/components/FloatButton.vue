<script setup lang="ts">

    // FloatButton component
    //
    // A floating action button anchored to a viewport corner. Renders a native
    // <button> with `position: fixed` and the appropriate corner offsets. The
    // chosen corner is also exposed via `data-position` so consumers can style
    // or override the anchoring with their own CSS.
    //
    // Props:
    //   label    — string, REQUIRED. aria-label.
    //   position — "top-left" | "top-right" | "bottom-left" | "bottom-right",
    //              default "bottom-right".
    //   disabled — boolean, default false.
    //   type     — "button" | "submit" | "reset", default "button".
    //   default slot — icon content.
    //   emits click(event) — click handler.
    //
    // Syntax:
    //   <FloatButton label="Help" @click="openHelp">?</FloatButton>
    //
    // Examples:
    //   <FloatButton label="Add" position="bottom-right" @click="add">
    //     <svg>…</svg>
    //   </FloatButton>
    //
    // Accessibility:
    //   - Native <button> semantics; aria-label provides the accessible name.
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text.
    //
    // Claude rules:
    //   - Headless: only inline `position: fixed` plus corner offsets are used.
    //   - label is required — non-optional in the interface.
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
    //   - Ant Design FloatButton: https://ant.design/components/float-button

    import { computed } from "vue";

    type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

    const props = withDefaults(defineProps<{
        /** Accessible label (REQUIRED). */
        label: string;
        /** Viewport corner anchor. */
        position?: Position;
        /** Whether disabled. */
        disabled?: boolean;
        /** HTML button type. */
        type?: "button" | "submit" | "reset";
    }>(), {
        position: "bottom-right",
        disabled: false,
        type: "button",
    });

    defineEmits<{
        (e: "click", event: MouseEvent): void;
    }>();

    const fixedStyle = computed<Record<string, string>>(() => {
        const style: Record<string, string> = { position: "fixed" };
        switch (props.position) {
            case "top-left":
                style.top = "1rem";
                style.left = "1rem";
                break;
            case "top-right":
                style.top = "1rem";
                style.right = "1rem";
                break;
            case "bottom-left":
                style.bottom = "1rem";
                style.left = "1rem";
                break;
            case "bottom-right":
            default:
                style.bottom = "1rem";
                style.right = "1rem";
                break;
        }
        return style;
    });

</script>

<template>
    <!-- FloatButton.vue -->
    <button
        class="float-button"
        :type="type"
        :disabled="disabled"
        :aria-label="label"
        :data-position="position"
        :style="fixedStyle"
        @click="$emit('click', $event)"
    >
        <slot />
    </button>
</template>
