# @lilydesignsystem/vue-calendar

A headless, accessible calendar for Vue 3: week, four-week and month views, previous/next/today,
keyboard navigation, a picked day, disabled days and consumer-rendered events. Composes
`@lilydesignsystem/vue-headless`'s `CalendarTable` family and the civil-date arithmetic of
`@lilydesignsystem/vue-date-time-picker`. Ships no CSS.

See [spec/index.md](./spec/index.md) and [AGENTS.md](./AGENTS.md).

## Install

```sh
npm install @lilydesignsystem/vue-calendar @lilydesignsystem/vue-headless @lilydesignsystem/vue-date-time-picker
```

## Quick start

```vue
<script setup lang="ts">
import { ref } from "vue";
import CalendarView from "@lilydesignsystem/vue-calendar";

const view = ref<"week" | "four-week" | "month">("month");
const anchorDate = ref("2026-01-15");
const events = [{ id: "e1", date: "2026-01-06", title: "Check-up" }];
const labels = {
  monthView: "Month",
  weekView: "Week",
  today: "Today",
  previous: (v: string) => `Previous ${v}`,
  next: (v: string) => `Next ${v}`,
  periodAnnouncement: (v: string, s: string, e: string) => `${v}: ${s} to ${e}`,
  weekdayAbbr: (d: number) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d],
};
</script>

<template>
  <CalendarView
    v-model:view="view"
    v-model:anchor-date="anchorDate"
    label="Appointments"
    today="2026-01-08"
    :events="events"
    :labels="labels"
    @day-click="(date) => console.log('picked', date)"
    @event-click="(event) => console.log('open', event.id)"
  >
    <template #day="{ date, events: dayEvents, openEvent }">
      <span>{{ Number(date.slice(8)) }}</span>
      <button v-for="e in dayEvents" :key="e.id" type="button" @click="openEvent(e)">{{ e.title }}</button>
    </template>
  </CalendarView>
</template>
```

## Keyboard

Arrows move the cursor by a day or a week; Home/End go to the row's ends; PageUp/PageDown step by the
view's length; Enter/Space pick the day; `t` goes to today. Disabled days stay focusable but cannot be picked.
