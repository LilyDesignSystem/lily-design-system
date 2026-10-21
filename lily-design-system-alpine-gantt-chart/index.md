# GanttChart (Alpine.js helper)

A headless **Gantt chart** for [Alpine.js](https://alpinejs.dev/): a plugin (`Alpine.data("lilyGanttChart", …)`) plus
`snippet.html`, the `role="grid"` / `treegrid` table markup that uses it. Task bars are column-spanning grid cells carrying data
attributes (`data-in-range`, `data-bar-start`, `data-bar-end`, `data-milestone`, `data-percent-complete`) — never
pixel-positioned boxes; your CSS draws the bar. Row hierarchy with collapse, parents' dates derived from their children, weekend
and today marks, dependencies described in text, the optional critical path, and the WAI-ARIA APG grid keys. Ships no CSS and no
text: every string is a `labels.*` value, and a label's absence removes the control or text it names.

It is a subset of the canonical [`@lilydesignsystem/svelte-gantt-chart`](../lily-design-system-svelte-gantt-chart/), whose
[spec](../lily-design-system-svelte-gantt-chart/spec/index.md) is the contract. The subset and the gaps are in
[spec/index.md](spec/index.md).

## Usage

```html
<script type="module">
  import Alpine from "alpinejs";
  import lilyGanttChart from "@lilydesignsystem/alpine-gantt-chart";
  Alpine.plugin(lilyGanttChart);
  window.ganttOptions = {
    range: { start: "2026-10-01", end: "2026-10-31" },
    today: "2026-10-10",
    weekends: [0, 6],
    criticalPath: true,
    tasks: [
      { id: "design", label: "Design", start: "2026-10-01", end: "2026-10-05" },
      { id: "build", label: "Build", start: "2026-10-06", end: "2026-10-20", dependsOn: ["design"], percentComplete: 30 },
      { id: "launch", label: "Launch", start: "2026-10-21", end: "2026-10-21", dependsOn: ["build"] }, // a milestone
    ],
    labels: {
      grid: "Q4 plan",
      taskColumn: "Task",
      columnLabel: (date) => date.slice(8),
      dependencySummary: (predecessors) => `Blocked by: ${predecessors.join(", ")}`,
      criticalLabel: "Critical",
    },
  };
  Alpine.start();
</script>
<!-- then paste snippet.html (importable as @lilydesignsystem/alpine-gantt-chart/snippet.html) -->
```

Options: `range`, `tasks` (`id`, `label`, `start`, `end`, `percentComplete`, `parentId`, `dependsOn`), `today` (never read from the
clock), `weekends` (never defaulted), `criticalPath` (`true` or the shared helper's options: working-day lag, holidays),
`collapsed`, `taskLabel`, `labels`. `createGanttChart(options)` returns the same state without Alpine; `criticalPath` and
`applyCriticalPath` are re-exported.

## Events

`lily:activate` (`{ taskId, date }`; `date` is `null` on the task cell), bubbling from the chart, on Enter or Space.

## Keyboard

APG grid: arrows move (clamped), Home / End go along the row, Ctrl+Home / Ctrl+End to the corners, PageUp / PageDown ten rows,
right-to-left swaps the horizontal arrows. Enter or Space on a parent's task cell collapses or expands it; elsewhere it announces
the task and date.

## Install

```sh
npm install @lilydesignsystem/alpine-gantt-chart alpinejs
```

Lily™ and Lily Design System™ are trademarks.
