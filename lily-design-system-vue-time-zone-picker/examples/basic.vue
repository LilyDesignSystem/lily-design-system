<script setup lang="ts">
import { ref } from "vue";
import TimeZonePicker from "@lilydesignsystem/vue-time-zone-picker";

// Basic usage: a label and the reader's locale. The zones are the built-in list, ordered by offset; the picker
// starts on the reader's own zone (or its listed twin) and sets data-time-zone on <html>.
// Use the zone where you format dates:  new Intl.DateTimeFormat(locale, { timeZone }).format(date)
const zone = ref("");
const now = new Date();
</script>

<template>
  <TimeZonePicker label="Time zone" locale="en-GB" v-model:value="zone" storage-key="lily-time-zone" />
  <p aria-live="polite">
    {{ zone ? new Intl.DateTimeFormat("en-GB", { timeZone: zone, dateStyle: "medium", timeStyle: "short" }).format(now) : "" }}
  </p>
</template>
