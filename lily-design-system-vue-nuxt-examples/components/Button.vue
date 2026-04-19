<script setup lang="ts">

    // Button component
    //
    // A headless button for triggering actions, built on the native HTML <button>
    // element for inherent accessibility and keyboard support. Supports action
    // buttons, submit/reset buttons, and toggle buttons via the pressed prop.
    // Commonly used for form submissions, dialogs, menus, and toolbar actions.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   type — "button" | "submit" | "reset", default "button". HTML button type.
    //   disabled — boolean, default false. Whether the button is disabled.
    //   pressed — boolean | undefined, default undefined. Toggle button state; when provided, aria-pressed is rendered.
    //   label — string, optional. Accessible label override via aria-label.
    //   onclick — (event: MouseEvent) => void, optional. Click event handler.
    //   default slot. The button content.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <Button @click="handleClick">Click me</Button>
    //
    // Examples:
    //   <!-- Submit button in a form -->
    //   <Button type="submit" disabled={isSubmitting}>Submit</Button>
    //
    //   <!-- Toggle button with pressed state -->
    //   <Button pressed={isBold} onclick={() => isBold = !isBold}>Bold</Button>
    //
    //   <!-- Button with accessible label override -->
    //   <Button label="Close dialog" onclick={handleClose}>X</Button>
    //
    // Keyboard:
    //   - Tab: Focus the button
    //   - Enter: Activate the button
    //   - Space: Activate the button
    //
    // Accessibility:
    //   - Implicit button role from <button> element
    //   - aria-pressed for toggle button state (only when pressed prop is provided)
    //   - aria-label for screen reader text override
    //   - Native disabled attribute prevents clicks and signals aria-disabled
    //
    // Internationalization:
    //   - Button text comes through default slot; no hardcoded strings
    //   - Label override comes through label prop
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Defaults to type="button" to prevent accidental form submissions
    //   - aria-pressed is only rendered when pressed prop is explicitly provided
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    withDefaults(defineProps<{
        /** HTML button type */
        type?: "button" | "submit" | "reset";
        /** Whether the button is disabled */
        disabled?: boolean;
        /** Toggle button pressed state (undefined = not a toggle button) */
        pressed?: boolean;
        /** Accessible label override */
        label?: string;
    }>(), {
        type: "button",
        disabled: false,
        pressed: undefined,
        label: undefined,
    });

</script>

<template>
    <!-- Button.vue -->
    <button
        class="button"
        :type="type"
        :disabled="disabled"
        :aria-pressed="pressed"
        :aria-label="label"
    >
        <slot />
    </button>
</template>
