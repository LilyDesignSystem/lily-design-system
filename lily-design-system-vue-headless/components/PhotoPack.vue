<script setup lang="ts">

    // PhotoPack component
    //
    // PhotoPack for the Reuters-graphics-style article layout family.
    // Renders a <div> role='group' that consumers style.

    defineProps<{
        /** Accessible label set on aria-label. */
        label: string;
    }>();

</script>

<template>
    <!-- PhotoPack.vue -->
    <div
        class="photo-pack"
        role="group"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
