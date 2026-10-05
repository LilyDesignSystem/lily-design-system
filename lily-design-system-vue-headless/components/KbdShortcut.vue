<script setup lang="ts">

    // KbdShortcut component
    //
    // A keyboard shortcut: an outer <kbd> holding one inner <kbd> per key,
    // with aria-hidden separators between them.
    //
    // Props:
    //   keys -- string[], required. Key names, in order.
    //   separator -- string, default "+". Decorative, aria-hidden.
    //   label -- string, optional. Spoken form (aria-label on the root).
    //   ...attrs -- fall through onto the root <kbd>.

    withDefaults(defineProps<{
        /** Key names, in order. */
        keys: string[];
        /** Decorative separator between keys. */
        separator?: string;
        /** Optional spoken form (aria-label). */
        label?: string;
    }>(), {
        separator: "+",
        label: undefined,
    });

</script>

<template>
    <!-- KbdShortcut.vue -->
    <kbd
        class="kbd-shortcut"
        :aria-label="label"
    >
        <template v-for="(key, i) in keys" :key="i">
            <span v-if="i > 0" class="kbd-shortcut-separator" aria-hidden="true">{{ separator }}</span><kbd class="kbd-shortcut-key">{{ key }}</kbd>
        </template>
    </kbd>
</template>
