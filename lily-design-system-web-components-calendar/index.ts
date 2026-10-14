/**
 * Barrel re-export for `<lily-calendar-view>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-calendar-view"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./calendar-view` and call
 * `customElements.define(...)` themselves.
 */

import {
    CalendarView,
    eventsByDay,
    isOutsidePeriod,
    periodDays,
    periodRange,
    weekStart,
} from "./calendar-view.js";
export { CalendarView, eventsByDay, isOutsidePeriod, periodDays, periodRange, weekStart };
export type {
    CalendarEvent,
    CalendarViewDayArgs,
    CalendarViewLabels,
    CalendarViewMode,
    CalendarViewNavigateDetail,
    CalendarViewProps,
} from "./calendar-view.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-calendar-view")) {
    customElements.define("lily-calendar-view", CalendarView);
}
