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

withDefaults(
    defineProps<{
        /** Key names, in order. */
        keys: string[];
        /** Decorative separator between keys. */
        separator?: string;
        /** Spoken form, read instead of the visible keys. */
        label?: string;
    }>(),
    {
        separator: "+",
        label: undefined,
    },
);
</script>

<template>
    <!-- KbdShortcut.vue -->
    <kbd class="kbd-shortcut">
        <span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        ><template
            v-for="(key, i) in keys"
            :key="i"
        >
            <span
                v-if="i > 0"
                class="kbd-shortcut-separator"
                aria-hidden="true"
                >{{ separator }}</span
            ><kbd
                class="kbd-shortcut-key"
                :aria-hidden="label ? 'true' : undefined"
                >{{ key }}</kbd
            >
        </template>
    </kbd>
</template>
