<!--
    Example 3 — localStorage persistence.

    Pass `storageKey` to make the picker remember the user's choice across
    reloads. On a fresh mount the picker reads the stored slug and re-
    applies it before the user interacts. Quota / private-mode errors are
    silently swallowed.
-->
<script setup lang="ts">
import TextSizePicker from "../TextSizePicker.vue";
</script>

<template>
    <TextSizePicker
        label="Text size"
        :sizes="['small', 'medium', 'large', 'x-large']"
        storage-key="my-app:text-size"
    />
</template>
