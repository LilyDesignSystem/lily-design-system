<script setup lang="ts">

    // ThemeProvider component
    //
    // Applies a theme object to the consumer's content by flattening the
    // object's nested keys into CSS custom properties on a wrapping <div>.
    // The wrapper uses display: contents so it doesn't affect layout —
    // children render in place but inherit the CSS variables.
    //
    // Props:
    //   theme — record, required.
    //   base  — "light" | "dark", default "light". Reflected as data-theme.
    //
    // Slots:
    //   default — themed content.

    import { computed } from "vue";

    const props = withDefaults(defineProps<{
        /** Theme object with nested keys; flattened to CSS custom properties. */
        theme: Record<string, unknown>;
        /** Base theme to merge with. */
        base?: "light" | "dark";
    }>(), {
        base: "light",
    });

    function flatten(obj: Record<string, unknown>, prefix: string = "--theme"): Record<string, string> {
        const out: Record<string, string> = {};
        for (const [key, value] of Object.entries(obj)) {
            const k = `${prefix}-${key}`;
            if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                Object.assign(out, flatten(value as Record<string, unknown>, k));
            } else if (value !== undefined && value !== null) {
                out[k] = String(value);
            }
        }
        return out;
    }

    const style = computed(() => ({
        display: "contents",
        ...flatten(props.theme),
    }));

</script>

<template>
    <!-- ThemeProvider.vue -->
    <div
        class="theme-provider"
        :data-theme="base"
        :style="style"
    >
        <slot />
    </div>
</template>
