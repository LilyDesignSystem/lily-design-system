<!--
    Example 3 — localStorage persistence.

    Pass `storageKey` to make the picker remember the user's choice across
    reloads. On a fresh mount the picker reads the stored slug and re-
    applies it before the user interacts. Quota / private-mode errors are
    silently swallowed.
-->
<script setup lang="ts">
import ThemePicker from "../ThemePicker.vue";
</script>

<template>
    <ThemePicker
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
        storage-key="my-app:theme"
    />
</template>
