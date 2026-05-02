<script setup lang="ts">

    // DialGroup component
    //
    // A labelled group container for one or more Dial components. Rendered
    // as a <div role="group"> with the kebab class so screen readers
    // announce the dials as a related set.
    //
    // Props:
    //   label — string, required. Accessible label for the group.
    //   default slot — Dial components.
    //
    // Accessibility:
    //   - role="group" + aria-label labels the dial group
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

    defineProps<{
        /** Accessible label for the dial group. */
        label: string;
    }>();

</script>

<template>
    <!-- DialGroup.vue -->
    <div
        class="dial-group"
        role="group"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
