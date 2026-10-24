<script setup lang="ts">
    // ConvertFromDiv component
    //
    // A headless part of ConvertDiv: the source side of a conversion, holding the value and unit to convert from.
    // Contract: a plain <div> with the base class and a default slot.
    //
    //   default slot -- the content.
</script>

<template>
    <!-- ConvertFromDiv.vue -->
    <div
        class="convert-from-div"
    >
        <slot />
    </div>
</template>
