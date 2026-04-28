<script setup lang="ts">

    // MenuGroup component
    //
    // A labeled section of menu items within a menu. Renders a role="group"
    // container with a visible heading; the heading is aria-hidden because the
    // accessible name is conveyed by the group's aria-label.
    //
    // Props:
    //   label        — string, REQUIRED. Section heading text (also aria-label).
    //   default slot — MenuItem children.
    //
    // Syntax:
    //   <MenuGroup label="View">
    //     <MenuItem>Zoom in</MenuItem>
    //     <MenuItem>Zoom out</MenuItem>
    //   </MenuGroup>
    //
    // Accessibility:
    //   - role="group" with aria-label
    //   - Visible heading is aria-hidden="true" to avoid duplicate announcement
    //
    // Internationalization:
    //   - Label is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - label is required

    defineProps<{
        /** Section heading text (REQUIRED). */
        label: string;
    }>();

</script>

<template>
    <!-- MenuGroup.vue -->
    <div
        class="menu-group"
        role="group"
        :aria-label="label"
    >
        <div class="menu-group-heading" aria-hidden="true">{{ label }}</div>
        <slot />
    </div>
</template>
