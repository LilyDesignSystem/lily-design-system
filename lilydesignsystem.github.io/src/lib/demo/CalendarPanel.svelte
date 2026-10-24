<script lang="ts">
  import CalendarView from '@lilydesignsystem/svelte-calendar';
  import type { CalendarEvent } from '@lilydesignsystem/svelte-calendar';
  import { labelsFor, type LabelPack } from '@lilydesignsystem/svelte-locale-translations';
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
  const names = $derived(new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }));
  const abbr = $derived(new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }));
  const full = $derived(new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }));
  const sunday = (wd: number) => new Date(Date.UTC(2023, 0, 1 + wd));
  const labels = $derived({
    ...(labelsFor('calendar', pack) as object),
    weekday: (wd: number) => names.format(sunday(wd)),
    weekdayAbbr: (wd: number) => abbr.format(sunday(wd)),
    day: (iso: string) => full.format(new Date(`${iso}T00:00:00Z`)),
    periodAnnouncement: (_view: string, start: string, end: string) => `${full.format(new Date(`${start}T00:00:00Z`))} – ${full.format(new Date(`${end}T00:00:00Z`))}`
  } as never);
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
