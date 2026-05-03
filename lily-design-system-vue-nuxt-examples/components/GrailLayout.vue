<script setup lang="ts">

    // GrailLayout component
    //
    // A headless container that provides the classic holy grail web design
    // structure with five sections: top header, left sidebar, center content,
    // right sidebar, bottom footer.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

</script>

<template>
    <!-- GrailLayout.vue -->
    <div class="grail-layout">
        <slot />
    </div>
</template>
