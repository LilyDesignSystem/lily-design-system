<!--
  Example 2 — NHS Wales appointment booking.

  The shape this component was built for: bilingual, with a clinic that
  is shut at weekends and a booking window that only runs twelve weeks
  out.
-->
<script setup lang="ts">
import { computed, ref } from "vue";
import DateTimePicker, { addDays, weekdayOf } from "../DateTimePicker.vue";

const welsh = ref(false);
const appointment = ref("");

// A real service would take these from its translation bundle. They are
// inline here so the example is self-contained.
const EN = {
  previousYear: "Previous year",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  nextYear: "Next year",
  confirm: "Confirm",
  cancel: "Cancel",
  hour: "Hour",
  minute: "Minute",
  clear: "Clear",
};

const CY = {
  previousYear: "Blwyddyn flaenorol",
  previousMonth: "Mis blaenorol",
  nextMonth: "Mis nesaf",
  nextYear: "Blwyddyn nesaf",
  confirm: "Cadarnhau",
  cancel: "Canslo",
  hour: "Awr",
  minute: "Munud",
  clear: "Clirio",
};

// Today is resolved once, at module scope, so the window does not shift
// under the user mid-session.
const today = new Date();
const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

// Bookable from tomorrow to twelve weeks out.
const min = addDays(iso, 1);
const max = addDays(iso, 7 * 12);

// Weekends closed. A real service would also fold in bank holidays and
// the clinic's own closures — which is exactly why this is a predicate
// and not a list of props.
const closed = (date: string) => weekdayOf(date) === 0 || weekdayOf(date) === 6;

const shortcuts = computed(() =>
  welsh.value
    ? [
        { id: "1w", label: "Ymhen wythnos", days: 7 },
        { id: "2w", label: "Ymhen pythefnos", days: 14 },
        { id: "1m", label: "Ymhen mis", months: 1 },
      ]
    : [
        { id: "1w", label: "In 1 week", days: 7 },
        { id: "2w", label: "In 2 weeks", days: 14 },
        { id: "1m", label: "In 1 month", months: 1 },
      ],
);
</script>

<template>
  <h1>{{ welsh ? "Trefnu apwyntiad" : "Book an appointment" }}</h1>

  <button type="button" @click="welsh = !welsh">
    {{ welsh ? "English" : "Cymraeg" }}
  </button>

  <label for="booking">
    {{ welsh ? "Dyddiad ac amser yr apwyntiad" : "Appointment date and time" }}
  </label>
  <div id="booking-hint">
    {{
      welsh
        ? "Ar gael o ddydd Llun i ddydd Gwener, hyd at 12 wythnos ymlaen llaw."
        : "Available Monday to Friday, up to 12 weeks ahead."
    }}
  </div>

  <!-- `locale` drives the month names, the first day of the week and the
       numeric field order — so switching to Welsh switches the calendar
       itself, not just the buttons around it. -->
  <DateTimePicker
    mode="datetime"
    input-id="booking"
    described-by="booking-hint"
    name="appointment"
    :label="welsh ? 'Dewiswch ddyddiad ac amser' : 'Choose a date and time'"
    :locale="welsh ? 'cy-GB' : 'en-GB'"
    :labels="welsh ? CY : EN"
    :min="min"
    :max="max"
    :is-date-disabled="closed"
    :minute-step="15"
    :shortcuts="shortcuts"
    v-model:value="appointment"
  />

  <p>
    {{ welsh ? "Gwerth" : "Value" }}: <code>{{ appointment || "—" }}</code>
  </p>
</template>
