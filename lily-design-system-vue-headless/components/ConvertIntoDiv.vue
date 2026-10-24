<script setup lang="ts">
    // ConvertIntoDiv component
    //
    // A headless part of ConvertDiv: the target side of a conversion, holding the value and unit to convert into.
    // Contract: a plain <div> with the base class and a default slot.
    //
    //   default slot -- the content.
</script>

<template>
    <!-- ConvertIntoDiv.vue -->
    <div
        class="convert-into-div"
    >
        <slot />
    </div>
</template>
