<script setup lang="ts">
import { ref } from "vue";
import { ThemePicker } from "lily-design-system-vue-theme-picker";
import { LocalePicker, isRtlLocale } from "lily-design-system-vue-locale-picker";
import { TextSizePicker } from "lily-design-system-vue-text-size-picker";
import SkipLink from "~/components/SkipLink.vue";
import { themes, themeLabels, defaultTheme } from "~/theme-config";

// Explicit endonym labels: Intl.DisplayNames is only as good as the
// browser's ICU data (headless Chromium lacks Welsh, for example).
const locales = ["en-GB", "cy-GB", "fr-FR", "ar"];
const localeLabels: Record<string, string> = {
  "en-GB": "English (UK)",
  "cy-GB": "Cymraeg",
  "fr-FR": "Français",
  ar: "العربية",
};
const sizes = ["small", "medium", "large"];
const sizeLabels: Record<string, string> = { small: "Small", medium: "Medium", large: "Large" };

// Nuxt's head manager owns <html> attributes and re-asserts whatever the
// config declares, silently clobbering any direct DOM write (the picker's
// lang was overwritten while its dir survived, purely because dir wasn't
// declared). So in Nuxt the picker's value drives useHead, and unhead is
// the single writer of record for lang + dir.
const currentLocale = ref("en-GB");
useHead({
  htmlAttrs: {
    lang: currentLocale,
    dir: computed(() => (isRtlLocale(currentLocale.value) ? "rtl" : "ltr")),
  },
});
</script>

<template>
  <SkipLink href="#content" label="Skip to main content" />
  <div class="site-header">
    <span>Lily Design System — Nuxt examples</span>
    <div class="site-header-pickers">
      <ClientOnly>
        <ThemePicker
          label="Choose a theme"
          themes-url="/themes/"
          :themes="themes"
          :theme-labels="themeLabels"
          :default-value="defaultTheme"
          storage-key="lily-theme"
        />
        <LocalePicker
          v-model:value="currentLocale"
          label="Choose a language"
          :locales="locales"
          :locale-labels="localeLabels"
          default-value="en-GB"
          storage-key="lily-locale"
        />
        <TextSizePicker
          label="Text size"
          :sizes="sizes"
          :size-labels="sizeLabels"
          default-value="medium"
          storage-key="lily-text-size"
        />
      </ClientOnly>
    </div>
  </div>
  <div id="content">
    <NuxtPage />
  </div>
  <footer class="site-footer">
    <p>Lily™ and Lily Design System™ are trademarks.</p>
  </footer>
</template>
