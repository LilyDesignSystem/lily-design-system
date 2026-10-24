<script setup lang="ts">
    // ConvertDiv component
    //
    // A headless part of ConvertDiv: a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres.
    // Contract: a plain <div> with the base class and a default slot; role="group" named by `label`.
    //
    // Props:
    //   label -- string, required. Accessible name of the group (aria-label).
    //   default slot -- the content.

    defineProps<{
        /** Accessible name of the group. */
        label: string;
    }>();
</script>

<template>
    <!-- ConvertDiv.vue -->
    <div
        class="convert-div"
        role="group"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
