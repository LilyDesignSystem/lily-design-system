<!--
  The `icon` slot replaces the cog inside the button, never the panel's content. The
  accessible name still comes from `label`, so keep the icon decorative.
-->
<script setup lang="ts">
import SettingsPicker from "../SettingsPicker.vue";
</script>

<template>
    <SettingsPicker label="More">
        <template #icon="{ open }"><span aria-hidden="true">{{ open ? "×" : "⋯" }}</span></template>
        <a href="/help/">Help</a>
    </SettingsPicker>
</template>
