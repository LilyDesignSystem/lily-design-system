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
        view,
        anchorDate,
        events,
        labels,
    }: {
        view: "week" | "four-week" | "month";
        anchorDate: string;
        events: CalendarEvent[];
        labels?: CalendarViewLabels;
    } = $props();
</script>

<CalendarView label="Appointments" {view} {anchorDate} {events} {labels}>
    {#snippet day(args)}
        <span data-testid={`events-${args.date}`}>{args.events.map((e) => e.id).join(",")}</span>
    {/snippet}
</CalendarView>
