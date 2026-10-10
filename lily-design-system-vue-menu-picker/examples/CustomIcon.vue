<!--
  The `icon` slot replaces the hamburger inside the button, never the panel's content. The
  accessible name still comes from `label`, so keep the icon decorative.
-->
<script setup lang="ts">
import MenuPicker from "../MenuPicker.vue";
</script>

<template>
    <MenuPicker label="More">
        <template #icon="{ open }"><span aria-hidden="true">{{ open ? "×" : "⋯" }}</span></template>
        <a href="/help/">Help</a>
    </MenuPicker>
</template>
