// CalendarView client-side runtime.
//
// Pairs with calendar-view.njk. The macro renders the toolbar, an empty
// grid and the status region; this module owns everything that needs
// civil-date arithmetic or callbacks:
//
// A. The period: a week, a rolling four weeks, or a padded month, built
//    from the arithmetic @lilydesignsystem/nunjucks-date-time-picker
//    exports (reused, not re-derived).
// B. Previous / next / today and the view switcher; every change fires
//    `onNavigate(view, start, end)` and announces the new period.
// C. WAI-ARIA APG grid roving-tabindex keyboard navigation (arrows,
//    Home/End, PageUp/PageDown, Enter/Space to pick, `t` for today),
//    re-paging when the cursor leaves the visible days.
// D. A picked day (data-selected), disabled days (min/max/isDisabled:
//    aria-disabled, focusable but not pickable) and events per day.
//
// State lives in data attributes on the root, so the SSR markup and the
// hydrated element always agree. See spec/index.md.

import {
  addDays,
  addMonths,
  daysInMonth,
  firstDayOfWeekFor,
  formatIsoDate,
  monthMatrix,
  parseIsoDate,
  weekdayOf,
} from "@lilydesignsystem/nunjucks-date-time-picker";

const VIEWS = ["week", "four-week", "month"];

/** Start of the week containing `isoDate`, for a given first-day-of-week (0 = Sunday). */
export function weekStart(isoDate, firstDayOfWeek) {
  const offset = (weekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
  return addDays(isoDate, -offset);
}

/** The visible days for `view`, anchored around `anchorDate`, as rows of 7. */
export function periodDays(view, anchorDate, firstDayOfWeek) {
  if (view === "month") {
    const parsed = parseIsoDate(anchorDate);
    if (!parsed) return [];
    return monthMatrix(parsed.year, parsed.month, firstDayOfWeek);
  }
  const start = weekStart(anchorDate, firstDayOfWeek);
  const rows = view === "week" ? 1 : 4;
  const weeks = [];
  for (let row = 0; row < rows; row++) {
    const week = [];
    for (let col = 0; col < 7; col++) week.push(addDays(start, row * 7 + col));
    weeks.push(week);
  }
  return weeks;
}

/** The inclusive [start, end] ISO range `view` covers. */
export function periodRange(view, anchorDate, firstDayOfWeek) {
  if (view === "month") {
    const parsed = parseIsoDate(anchorDate);
    if (!parsed) return [anchorDate, anchorDate];
    return [
      formatIsoDate({ ...parsed, day: 1 }),
      formatIsoDate({ ...parsed, day: daysInMonth(parsed.year, parsed.month) }),
    ];
  }
  const start = weekStart(anchorDate, firstDayOfWeek);
  const len = view === "week" ? 7 : 28;
  return [start, addDays(start, len - 1)];
}

/** Whether `isoDate` falls outside `anchorDate`'s own calendar month. Always false for week/four-week. */
export function isOutsidePeriod(view, isoDate, anchorDate) {
  if (view !== "month") return false;
  const d = parseIsoDate(isoDate);
  const anchor = parseIsoDate(anchorDate);
  if (!d || !anchor) return false;
  return d.year !== anchor.year || d.month !== anchor.month;
}

/** Map each event to every ISO date it covers. */
export function eventsByDay(events) {
  const map = new Map();
  const add = (isoDate, event) => {
    const list = map.get(isoDate);
    if (list) list.push(event);
    else map.set(isoDate, [event]);
  };
  for (const event of events) {
    if (event.date) {
      add(event.date, event);
    } else if (event.start && event.end) {
      let cursor = event.start;
      while (cursor <= event.end) {
        add(cursor, event);
        cursor = addDays(cursor, 1);
      }
    }
  }
  return map;
}

/**
 * Wire one rendered CalendarView root.
 *
 * @param {HTMLElement} root - The `[data-lily-calendar-view-root]`.
 * @param {{
 *   events?: Array<{ id: string, date?: string, start?: string, end?: string, [k: string]: unknown }>,
 *   isDisabled?: (isoDate: string) => boolean,
 *   onNavigate?: (view: string, start: string, end: string) => void,
 *   onDayClick?: (isoDate: string) => void,
 *   onEventClick?: (event: object) => void,
 *   renderDay?: (args: { date: string, events: object[], isToday: boolean, outsidePeriod: boolean,
 *     selected: boolean, disabled: boolean, openEvent: (event: object) => void }) => Node,
 *   labels?: {
 *     previous?: (view: string) => string, next?: (view: string) => string,
 *     periodAnnouncement?: (view: string, start: string, end: string) => string,
 *     weekday?: (weekday: number) => string, weekdayAbbr?: (weekday: number) => string,
 *     day?: (isoDate: string, weekday: number, outsidePeriod: boolean) => string,
 *   },
 * }=} opts
 * @returns {{ destroy: () => void, setEvents: (events: object[]) => void }}
 */
export function initCalendarView(root, opts = {}) {
  const noop = { destroy: () => {}, setEvents: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const table = root.querySelector(".calendar-table");
  const thead = root.querySelector(".calendar-table-head");
  const tbody = root.querySelector(".calendar-table-body");
  const statusEl = root.querySelector("[data-lily-calendar-view-status]");
  if (!table || !thead || !tbody) return noop;

  const labels = opts.labels || {};
  let events = Array.isArray(opts.events) ? opts.events.slice() : [];
  let cursor = null;
  let focusPending = false;

  const attr = (name) => root.getAttribute(`data-lily-calendar-view-${name}`) || "";
  const setAttr = (name, value) => {
    if (value) root.setAttribute(`data-lily-calendar-view-${name}`, value);
    else root.removeAttribute(`data-lily-calendar-view-${name}`);
  };
  const view = () => (VIEWS.includes(attr("view")) ? attr("view") : "month");
  const today = () => attr("today");
  const anchorDate = () => attr("anchor-date") || today() || "1970-01-01";
  const firstDay = () => firstDayOfWeekFor(attr("locale") || undefined);

  function isDisabledDay(isoDate) {
    const min = attr("min-date");
    const max = attr("max-date");
    if (min && isoDate < min) return true;
    if (max && isoDate > max) return true;
    return typeof opts.isDisabled === "function" ? !!opts.isDisabled(isoDate) : false;
  }

  function visibleDays() {
    return periodDays(view(), anchorDate(), firstDay()).flat();
  }

  function effectiveCursor(flat) {
    const c = cursor || anchorDate();
    if (flat.includes(c)) return c;
    return flat.includes(anchorDate()) ? anchorDate() : flat[0];
  }

  function announce(v, anchor) {
    if (typeof labels.periodAnnouncement !== "function" || !statusEl) return;
    const [start, end] = periodRange(v, anchor, firstDay());
    statusEl.textContent = labels.periodAnnouncement(v, start, end);
  }

  function emitNavigate(v, anchor) {
    const [start, end] = periodRange(v, anchor, firstDay());
    announce(v, anchor);
    if (typeof opts.onNavigate === "function") opts.onNavigate(v, start, end);
  }

  function pick(isoDate) {
    if (isDisabledDay(isoDate)) return;
    cursor = isoDate;
    setAttr("selected-date", isoDate);
    if (typeof opts.onDayClick === "function") opts.onDayClick(isoDate);
  }

  function openEvent(event) {
    if (typeof opts.onEventClick === "function") opts.onEventClick(event);
  }

  function defaultRenderDay(args) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(String((parseIsoDate(args.date) || {}).day || "")));
    args.events.forEach((event) => {
      if (typeof event.title !== "string") return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-view-event";
      button.textContent = event.title;
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        args.openEvent(event);
      });
      fragment.appendChild(button);
    });
    return fragment;
  }

  function render() {
    const v = view();
    const anchor = anchorDate();
    const days = periodDays(v, anchor, firstDay());
    const flat = days.flat();
    cursor = effectiveCursor(flat);
    const eventMap = eventsByDay(events);
    const selected = attr("selected-date");
    const todayIso = today();

    // Switcher state and the arrows' names (a function of the current view).
    root.querySelectorAll("[data-lily-calendar-view-switch]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lily-calendar-view-switch") === v));
    });
    const previous = root.querySelector("[data-lily-calendar-view-previous]");
    const next = root.querySelector("[data-lily-calendar-view-next]");
    if (previous && typeof labels.previous === "function") previous.setAttribute("aria-label", labels.previous(v));
    if (next && typeof labels.next === "function") next.setAttribute("aria-label", labels.next(v));

    thead.replaceChildren();
    const headRow = document.createElement("tr");
    headRow.className = "calendar-table-row";
    for (let i = 0; i < 7; i++) {
      const weekday = (firstDay() + i) % 7;
      const th = document.createElement("th");
      th.className = "calendar-table-th";
      th.setAttribute("scope", "col");
      if (typeof labels.weekdayAbbr === "function") {
        const abbr = document.createElement("abbr");
        abbr.setAttribute("title", typeof labels.weekday === "function" ? labels.weekday(weekday) : labels.weekdayAbbr(weekday));
        abbr.textContent = labels.weekdayAbbr(weekday);
        th.appendChild(abbr);
      } else if (typeof labels.weekday === "function") {
        th.textContent = labels.weekday(weekday);
      }
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);

    tbody.replaceChildren();
    days.forEach((week) => {
      const tr = document.createElement("tr");
      tr.className = "calendar-table-row";
      week.forEach((d) => {
        const outside = isOutsidePeriod(v, d, anchor);
        const isToday = !!todayIso && d === todayIso;
        const disabled = isDisabledDay(d);
        const picked = selected === d;
        const td = document.createElement("td");
        td.className = "calendar-table-td";
        td.setAttribute("role", "gridcell");
        td.setAttribute("tabindex", d === cursor ? "0" : "-1");
        if (d === cursor) td.setAttribute("aria-selected", "true");
        if (isToday) td.setAttribute("aria-current", "date");
        td.setAttribute("data-date", d);
        if (outside) td.setAttribute("data-outside-period", "");
        if (picked) td.setAttribute("data-selected", "");
        if (disabled) {
          td.setAttribute("data-disabled", "");
          td.setAttribute("aria-disabled", "true");
        }
        if (typeof labels.day === "function") td.setAttribute("aria-label", labels.day(d, weekdayOf(d), outside));
        const args = {
          date: d,
          events: eventMap.get(d) || [],
          isToday,
          outsidePeriod: outside,
          selected: picked,
          disabled,
          openEvent,
        };
        td.appendChild(typeof opts.renderDay === "function" ? opts.renderDay(args) : defaultRenderDay(args));
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    if (focusPending) {
      focusPending = false;
      const cell = tbody.querySelector('.calendar-table-td[tabindex="0"]');
      if (cell) cell.focus({ preventScroll: true });
    }
  }

  function navigateTo(nextAnchor) {
    setAttr("anchor-date", nextAnchor);
    emitNavigate(view(), nextAnchor);
    render();
  }

  function stepView(delta) {
    const anchor = anchorDate();
    if (view() === "week") navigateTo(addDays(anchor, delta * 7));
    else if (view() === "four-week") navigateTo(addDays(anchor, delta * 28));
    else navigateTo(addMonths(anchor, delta));
  }

  function setView(next) {
    setAttr("view", next);
    emitNavigate(next, anchorDate());
    render();
  }

  /** Move the cursor, re-paging the visible period when it leaves it. */
  function moveCursor(next) {
    cursor = next;
    const v = view();
    const anchor = anchorDate();
    if (v === "month") {
      const cp = parseIsoDate(next);
      const a = parseIsoDate(anchor);
      if (cp && a && (cp.year !== a.year || cp.month !== a.month)) {
        const first = formatIsoDate({ year: cp.year, month: cp.month, day: 1 });
        setAttr("anchor-date", first);
        emitNavigate(v, first);
      }
    } else {
      const len = v === "week" ? 7 : 28;
      let start = weekStart(anchor, firstDay());
      let moved = false;
      if (next < start) {
        while (next < start) start = addDays(start, -7);
        moved = true;
      } else {
        let end = addDays(start, len - 1);
        if (next > end) {
          while (next > end) {
            start = addDays(start, 7);
            end = addDays(start, len - 1);
          }
          moved = true;
        }
      }
      if (moved) {
        setAttr("anchor-date", start);
        emitNavigate(v, start);
      }
    }
    focusPending = true;
    render();
  }

  function pageCursor(delta, c) {
    if (view() === "week") moveCursor(addDays(c, delta * 7));
    else if (view() === "four-week") moveCursor(addDays(c, delta * 28));
    else moveCursor(addMonths(c, delta));
  }

  function onGridKeydown(event) {
    const c = effectiveCursor(visibleDays());
    const offset = (weekdayOf(c) - firstDay() + 7) % 7;
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        moveCursor(addDays(c, -1));
        break;
      case "ArrowRight":
        event.preventDefault();
        moveCursor(addDays(c, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        moveCursor(addDays(c, -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        moveCursor(addDays(c, 7));
        break;
      case "Home":
        event.preventDefault();
        moveCursor(addDays(c, -offset));
        break;
      case "End":
        event.preventDefault();
        moveCursor(addDays(c, 6 - offset));
        break;
      case "PageUp":
        event.preventDefault();
        pageCursor(-1, c);
        break;
      case "PageDown":
        event.preventDefault();
        pageCursor(1, c);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        pick(c);
        focusPending = true;
        render();
        break;
      case "t":
      case "T": {
        if (!today() || event.ctrlKey || event.metaKey || event.altKey) break;
        event.preventDefault();
        setAttr("anchor-date", today());
        emitNavigate(view(), today());
        moveCursor(today());
        break;
      }
      default:
        break;
    }
  }

  function onRootClick(event) {
    const target = event.target;
    if (!target || !target.closest) return;
    const switcher = target.closest("[data-lily-calendar-view-switch]");
    if (switcher) return setView(switcher.getAttribute("data-lily-calendar-view-switch"));
    if (target.closest("[data-lily-calendar-view-previous]")) return stepView(-1);
    if (target.closest("[data-lily-calendar-view-next]")) return stepView(1);
    if (target.closest("[data-lily-calendar-view-today-button]")) {
      if (today()) navigateTo(today());
      return;
    }
    const cell = target.closest(".calendar-table-td[data-date]");
    if (cell) {
      cursor = cell.getAttribute("data-date");
      pick(cursor);
      render();
    }
  }

  table.addEventListener("keydown", onGridKeydown);
  root.addEventListener("click", onRootClick);
  render();

  return {
    destroy: () => {
      table.removeEventListener("keydown", onGridKeydown);
      root.removeEventListener("click", onRootClick);
    },
    setEvents: (next) => {
      events = Array.isArray(next) ? next.slice() : [];
      render();
    },
  };
}

/**
 * Find every `[data-lily-calendar-view-root]` and wire it.
 *
 * @param {Parameters<typeof initCalendarView>[1]=} opts
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  return Array.from(document.querySelectorAll("[data-lily-calendar-view-root]")).map((root) =>
    initCalendarView(root, opts),
  );
}
