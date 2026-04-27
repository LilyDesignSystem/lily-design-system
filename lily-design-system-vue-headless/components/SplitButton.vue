<script setup lang="ts">

    // SplitButton component
    //
    // A headless split button: a primary action paired with a dropdown trigger
    // that opens a related-actions menu. Renders <div role="group"> with two
    // buttons (primary, menu trigger) and a hideable menu container that holds
    // consumer-supplied menu content via the default slot.
    //
    // Props:
    //   label        — string, REQUIRED. aria-label for the group.
    //   primaryLabel — string, REQUIRED. Text rendered in the primary button.
    //   menuLabel    — string, REQUIRED. aria-label for the dropdown trigger.
    //   menuOpen     — boolean, default false.
    //   disabled     — boolean, default false. Disables both buttons.
    //   default slot — menu content (e.g., a Menu component).
    //   emits primaryClick(event), menuToggle(event)
    //   ...restProps — additional HTML attributes spread onto the wrapper <div>.
    //
    // Syntax:
    //   <SplitButton
    //     label="Save options"
    //     primary-label="Save"
    //     menu-label="More save actions"
    //     :menu-open="open"
    //     @primary-click="onSave"
    //     @menu-toggle="onToggle"
    //   >
    //     <Menu>...</Menu>
    //   </SplitButton>
    //
    // Keyboard:
    //   - Tab moves focus between the primary button and the menu trigger
    //   - Enter / Space activates each button
    //   - Menu interactions are handled by the consumer's menu content
    //
    // Accessibility:
    //   - role="group" with aria-label clusters the two buttons
    //   - aria-haspopup="menu" and aria-expanded on the menu trigger
    //   - The menu container is hidden when menuOpen is false
    //   - data-menu-open exposes the open state for CSS hooks
    //
    // Internationalization:
    //   - All labels are consumer-supplied
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Trigger renders no inner glyph; consumer can style via the
    //     split-button-menu-trigger class
    //
    // References:
    //   - WAI-ARIA Menu Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

    withDefaults(defineProps<{
        /** Group aria-label (REQUIRED). */
        label: string;
        /** Primary button label (REQUIRED). */
        primaryLabel: string;
        /** Menu trigger aria-label (REQUIRED). */
        menuLabel: string;
        /** Whether the dropdown menu is open. */
        menuOpen?: boolean;
        /** Whether both buttons are disabled. */
        disabled?: boolean;
    }>(), {
        menuOpen: false,
        disabled: false,
    });

    defineEmits<{
        (e: "primaryClick", event: MouseEvent): void;
        (e: "menuToggle", event: MouseEvent): void;
    }>();

</script>

<template>
    <!-- SplitButton.vue -->
    <div
        class="split-button"
        role="group"
        :aria-label="label"
        :data-menu-open="menuOpen"
    >
        <button
            class="split-button-primary"
            type="button"
            :disabled="disabled"
            @click="$emit('primaryClick', $event)"
        >{{ primaryLabel }}</button>
        <button
            class="split-button-menu-trigger"
            type="button"
            :disabled="disabled"
            :aria-haspopup="'menu'"
            :aria-expanded="menuOpen"
            :aria-label="menuLabel"
            @click="$emit('menuToggle', $event)"
        ></button>
        <div
            class="split-button-menu"
            :hidden="!menuOpen"
        >
            <slot />
        </div>
    </div>
</template>
