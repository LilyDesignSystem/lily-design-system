# Accessibility — `<gantt-chart>`

## Why dependency arrows are a documented non-goal

Rendering a visible line/arrow connecting a predecessor task's bar to a
dependent task's bar is common in commercial Gantt libraries, but every
accessibility source consulted while writing the Svelte canonical this
package ports treats it as an unsolved problem industry-wide, not
something uniquely skipped here: a drawn arrow has no reliable
assistive-technology mapping once bars wrap across rows or columns
collapse. `<gantt-chart>` instead exposes `task.dependsOn` as **data**:
every cell in a dependent task's row carries `aria-describedby` pointing
at a generated, `hidden` text summary (`labels.dependencySummary`) — a
screen-reader user gets the same information a sighted user would infer
from a drawn line, without an unreliable visual dependency.

## Why editing is never drag-only

Resizing or rescheduling a task's bar by dragging its edges is the
conventional Gantt interaction, but it fails WCAG 2.5.7 (Dragging
Movements) on its own. `<gantt-chart>` treats the inline edit region
(Enter/Space opens two composed `<date-time-picker>` instances) as the
primary, always-present path; native HTML5 drag-and-drop reschedule is
supplementary.

## Roving tabindex and `data-in-range` are independent

Unlike every other framework catalog's own gantt-chart port, this
catalog's `gantt-table-td.html` markup contract has no `active` prop to
overload between "the roving-tabindex cursor" and "this cell is within
the task's span" — it documents only `aria-label`. `tabindex`/
`aria-selected` (the cursor) and `data-in-range` (span membership) are
therefore two independent attributes set directly by `<gantt-chart>`,
with nothing to disambiguate. See
[spec/index.md §10.4](../spec/index.md#10-deviations-from-the-svelte-canonical).

## The targeted-insert edit region

Opening a task's edit region inserts one `<tr>` after the task's row
without rebuilding the grid — so the roving-tabindex cursor's own DOM
node, and therefore the user's keyboard focus context, survives opening
and closing the edit region undisturbed. See
[spec/index.md §10.3](../spec/index.md#10-deviations-from-the-svelte-canonical)
for the regression test that proves this.

## Live region

A single `.gantt-chart-status[aria-live="polite"]` element announces
every successful edit, gated on `labels.dateAnnouncement` being
supplied.
