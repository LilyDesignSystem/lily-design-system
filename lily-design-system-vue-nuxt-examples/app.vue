<script setup lang="ts">
import { ThemePicker } from "lily-design-system-vue-theme-picker";
import SkipLink from "~/components/SkipLink.vue";
import { themes, themeLabels, defaultTheme } from "~/theme-config";
</script>

<template>
  <SkipLink href="#content" label="Skip to main content" />
  <div class="site-header">
    <span>Lily Design System — Nuxt examples</span>
    <ClientOnly>
      <ThemePicker
        label="Choose a theme"
        themes-url="/themes/"
        :themes="themes"
        :theme-labels="themeLabels"
        :default-value="defaultTheme"
        storage-key="lily-theme"
      />
    </ClientOnly>
  </div>
  <div id="content">
    <NuxtPage />
  </div>
  <footer class="site-footer">
    <p>Lily™ and Lily Design System™ are trademarks.</p>
  </footer>
</template>
