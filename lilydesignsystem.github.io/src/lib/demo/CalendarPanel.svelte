<script lang="ts">
  import CalendarView from '@lilydesignsystem/svelte-calendar';
  import type { CalendarEvent } from '@lilydesignsystem/svelte-calendar';
  import { intlLabelsFor, type LabelPack } from '@lilydesignsystem/svelte-locale-translations';
  import { addDays, type DemoStrings } from './strings.js';

  let { s, pack, locale, today }: { s: DemoStrings; pack: LabelPack; locale: string; today: string } = $props();

  let view = $state<'week' | 'four-week' | 'month'>('month');
  let anchorDate = $state('');
  $effect.pre(() => {
    if (!anchorDate) anchorDate = today;
  });

  const events = $derived<CalendarEvent[]>([
    { id: 'e1', date: addDays(today, -2), title: s.calendar.events[0] },
    { id: 'e2', date: addDays(today, 3), title: s.calendar.events[1] },
    { id: 'e3', date: addDays(today, 3), title: s.calendar.events[0] },
    { id: 'e4', date: addDays(today, 9), title: s.calendar.events[2] }
  ]);

  // Weekday and day names depend on how the locale writes dates, so they come from Intl, not from a pack.
  const labels = $derived(intlLabelsFor('calendar', pack, locale) as never);
</script>

{#if anchorDate}
  <CalendarView label={s.calendar.label} bind:view bind:anchorDate {events} {today} {labels}>
    {#snippet day({ events: onDay })}
      {#each onDay as event (event.id)}
        <span class="demo-event">{event.title}</span>
      {/each}
    {/snippet}
  </CalendarView>
{/if}
