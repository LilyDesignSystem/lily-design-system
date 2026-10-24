<script setup lang="ts">
    // ConvertFromValueDiv component
    //
    // A headless part of ConvertDiv: the value to convert from, such as a text input holding the number of dollars.
    // Contract: a plain <div> with the base class and a default slot.
    //
    //   default slot -- the content.
</script>

<template>
    <!-- ConvertFromValueDiv.vue -->
    <div
        class="convert-from-value-div"
    >
        <slot />
    </div>
</template>
