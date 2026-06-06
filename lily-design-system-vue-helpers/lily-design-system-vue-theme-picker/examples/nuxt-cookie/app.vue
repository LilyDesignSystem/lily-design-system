<!--
    app.vue — Nuxt 3 root component (or layout).

    Reads the server-resolved initial theme via the plugin, binds it to
    the picker via v-model:value, and writes <html data-theme="…"> via
    useHead so the first paint already shows the user's chosen theme.
-->
<script setup lang="ts">
import { ref } from "vue";
import ThemePicker from "../../ThemePicker.vue";

// `useNuxtApp` and `useHead` are auto-imported in Nuxt 3.
// In a non-Nuxt context, replace with your own state and head plumbing.
const { $initialTheme } = useNuxtApp() as unknown as { $initialTheme: string };
const theme = ref<string>($initialTheme ?? "light");

useHead({ htmlAttrs: { "data-theme": theme } });

async function persistThemeCookie(slug: string) {
    await fetch("/api/theme", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ theme: slug }),
    });
}
</script>

<template>
    <div>
        <header>
            <ThemePicker
                label="Theme"
                themes-url="/assets/themes/"
                :themes="['light', 'dark', 'abyss']"
                v-model:value="theme"
                @change="persistThemeCookie"
            />
        </header>

        <main>
            <NuxtPage />
        </main>
    </div>
</template>
