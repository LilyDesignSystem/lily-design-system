<script setup lang="ts">

    // IconButton component
    //
    // A headless button containing only an icon glyph (no visible text). Because
    // icon-only buttons have no implicit accessible name, the `label` prop is
    // REQUIRED and is rendered as aria-label. Defaults to type="button" to avoid
    // accidental form submissions and supports the optional toggle pattern via
    // the `pressed` prop, which renders aria-pressed.
    //
    // Props:
    //   label     — string, REQUIRED. Accessible name (aria-label).
    //   type      — "button" | "submit" | "reset", default "button".
    //   disabled  — boolean, default false.
    //   pressed   — boolean | undefined, default undefined. Toggle state.
    //   baseClass — string, default "icon-button". The base class token itself
    //     (not appended — replaces "icon-button" outright, since Vue's default
    //     class fallthrough only ever concatenates). A consumer whose own
    //     contract needs an exact class (e.g. a picker's `class="{helper}-button"`)
    //     sets this instead of layering `class` on top of the default.
    //   default slot — the icon content (svg, emoji, glyph).
    //   emits click(event) — click handler.
    //   ...restProps — additional HTML attributes spread onto the <button>
    //     (e.g. aria-haspopup, aria-expanded, aria-controls, @keydown — Vue's
    //     automatic single-root attribute/listener fallthrough).
    //
    // Exposes (defineExpose): `el` — the rendered button element, for a
    // consumer that needs to call .focus() on it.
    //
    // Syntax:
    //   <IconButton label="Close" @click="onClose">×</IconButton>
    //
    // Examples:
    //   <!-- Close icon -->
    //   <IconButton label="Close dialog" @click="closeDialog">
    //     <svg>...</svg>
    //   </IconButton>
    //
    //   <!-- Toggle bold -->
    //   <IconButton label="Bold" :pressed="isBold" @click="toggleBold">B</IconButton>
    //
    // Keyboard:
    //   - Tab: focus the button
    //   - Enter / Space: activate the button
    //
    // Accessibility:
    //   - aria-label is the entire accessible name (REQUIRED)
    //   - aria-pressed when pressed prop is provided
    //   - native <button> semantics; supports disabled
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required — non-optional in the interface
    //   - aria-pressed is rendered only when pressed prop is provided
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    import { ref } from "vue";

    withDefaults(defineProps<{
        /** Accessible label (REQUIRED). */
        label: string;
        /** HTML button type. */
        type?: "button" | "submit" | "reset";
        /** Whether disabled. */
        disabled?: boolean;
        /** Toggle pressed state. */
        pressed?: boolean;
        /** Base class token, replacing "icon-button" outright (not appended). */
        baseClass?: string;
    }>(), {
        type: "button",
        disabled: false,
        pressed: undefined,
        baseClass: "icon-button",
    });

    defineEmits<{
        (e: "click", event: MouseEvent): void;
    }>();

    const buttonRef = ref<HTMLButtonElement | undefined>(undefined);

    defineExpose({ el: buttonRef });

</script>

<template>
    <!-- IconButton.vue -->
    <button
        ref="buttonRef"
        :class="baseClass"
        :type="type"
        :disabled="disabled"
        :aria-label="label"
        :aria-pressed="pressed"
        @click="$emit('click', $event)"
    >
        <slot />
    </button>
</template>
