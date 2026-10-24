<script setup lang="ts">
    // ConvertIntoUnitDiv component
    //
    // A headless part of ConvertDiv: the unit to convert into, such as a select box of currencies or lengths.
    // Contract: a plain <div> with the base class and a default slot.
    //
    //   default slot -- the content.
</script>

<template>
    <!-- ConvertIntoUnitDiv.vue -->
    <div
        class="convert-into-unit-div"
    >
        <slot />
    </div>
</template>
