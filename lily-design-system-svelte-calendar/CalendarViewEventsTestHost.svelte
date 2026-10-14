<!--
  Test-only host: exercises the `day` snippet prop with real Svelte
  template syntax rather than hand-constructing Svelte's internal
  snippet-calling convention (fragile, undocumented, and unnecessary
  once a real .svelte host does the same job). Used only by
  CalendarView.test.ts §8.12.
-->
<script lang="ts">
    import CalendarView from "./CalendarView.svelte";
    import type { CalendarEvent, CalendarViewLabels } from "./CalendarView.svelte";

    let {
        view = "week",
        anchorDate = "2026-01-06",
        events,
        labels,
        onEventClick,
        selectedDate,
        minDate,
    }: {
        view?: "week" | "four-week" | "month";
        anchorDate?: string;
        events: CalendarEvent[];
        labels?: CalendarViewLabels;
        onEventClick?: (e: CalendarEvent) => void;
        selectedDate?: string;
        minDate?: string;
    } = $props();
</script>

<CalendarView label="Appointments" {view} {anchorDate} {events} {labels} {onEventClick} {selectedDate} {minDate}>
    {#snippet day(args)}
        <span data-testid={`events-${args.date}`}>{args.events.map((e) => e.id).join(",")}</span>
        {#if args.selected}<i data-snippet-selected></i>{/if}
        {#if args.disabled}<i data-snippet-disabled></i>{/if}
        {#each args.events as ev (ev.id)}
            <button type="button" data-event-open onclick={() => args.openEvent(ev)}>{ev.id}</button>
        {/each}
    {/snippet}
</CalendarView>
