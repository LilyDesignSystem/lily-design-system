<script setup lang="ts">
    // ConvertIntoValueDiv component
    //
    // A headless part of ConvertDiv: the converted value, such as a text input showing the number of euros.
    // Contract: a plain <div> with the base class and a default slot.
    //
    //   default slot -- the content.
</script>

<template>
    <!-- ConvertIntoValueDiv.vue -->
    <div
        class="convert-into-value-div"
    >
        <slot />
    </div>
</template>
