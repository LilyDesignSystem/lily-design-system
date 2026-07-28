<!--
  Example 1 — Basic usage.

  The smallest useful call site: a labelled field, a locale, and the six
  required strings. Bind the committed value with `v-model:value`,
  matching `theme-picker` and `locale-picker` elsewhere in this catalog.
-->
<script setup lang="ts">
import { ref } from "vue";
import DateTimePicker from "../DateTimePicker.vue";

const appointment = ref("");

const labels = {
  previousYear: "Previous year",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  nextYear: "Next year",
  confirm: "OK",
  cancel: "Cancel",
};
</script>

<template>
  <h1>Date picker — basic</h1>

  <label for="appointment">Appointment date</label>
  <div id="appointment-hint">For example, 27 Jun 2026</div>

  <DateTimePicker
    input-id="appointment"
    described-by="appointment-hint"
    name="appointment"
    label="Choose an appointment date"
    locale="en-GB"
    placeholder="DD MMM YYYY"
    v-model:value="appointment"
    :labels="labels"
  />

  <p>Value posted to the server: <code>{{ appointment || "(empty)" }}</code></p>
</template>

<style>
/* The package ships no CSS. Without at least this much, the dialog
   renders in normal flow instead of over the page. */
.date-time-picker {
  position: relative;
  display: inline-block;
}
.date-time-picker-dialog {
  position: absolute;
  z-index: 10;
  inset-inline-start: 0;
  background: Canvas;
  border: 1px solid;
  padding: 0.5rem;
}
.date-time-picker-dialog[hidden] {
  display: none;
}
.date-time-picker-day[data-outside] {
  opacity: 0.5;
}
.date-time-picker-day[data-selected] {
  outline: 2px solid;
}
</style>
