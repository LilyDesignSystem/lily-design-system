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
  isoWeek,
  monthMatrix,
  parseIsoDate,
  weekdayOf,
} from "@lilydesignsystem/nunjucks-date-time-picker";
import { copyToClipboard, downloadBlob, exportBlob, exportFilename, toClipboardText } from "./export-data";
import { highlightSegments, matchesSearch as wordsMatch } from "./search-text";
import { isRtl, logicalKey } from "./direction";
import { EMPTY_HISTORY, historyKey, recordEdit, redoEdit, undoEdit } from "./edit-history";
import { civilDateToDate } from "./cell-types";
import {
  draftOf,
  editorKind,
  evaluateEdit,
  exportFieldCell,
  exportableFields,
  fieldText,
  isEditableField,
  neighbourField,
  resolveFields,
} from "./typed-fields";

const VIEWS = ["day", "week", "four-week", "month", "agenda"];
const MOVE_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

/** Start of the week containing `isoDate`, for a given first-day-of-week (0 = Sunday). */
export function weekStart(isoDate, firstDayOfWeek) {
  const offset = (weekdayOf(isoDate) - firstDayOfWeek + 7) % 7;
  return addDays(isoDate, -offset);
}

/** The visible days for `view`, anchored around `anchorDate`, as rows of 7. */
export function periodDays(view, anchorDate, firstDayOfWeek) {
  if (view === "agenda") return [];
  if (view === "month") {
    const parsed = parseIsoDate(anchorDate);
    if (!parsed) return [];
    return monthMatrix(parsed.year, parsed.month, firstDayOfWeek);
  }
  if (view === "day") return [[anchorDate]];
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
  if (view === "month" || view === "agenda") {
    const parsed = parseIsoDate(anchorDate);
    if (!parsed) return [anchorDate, anchorDate];
    return [
      formatIsoDate({ ...parsed, day: 1 }),
      formatIsoDate({ ...parsed, day: daysInMonth(parsed.year, parsed.month) }),
    ];
  }
  if (view === "day") return [anchorDate, anchorDate];
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
 *   ranges?: Array<{ start: string, end: string, kind?: string, label?: string }>,
 *   maxEvents?: number,
 *   agendaEmptyDays?: boolean,
 *   renderAgendaDay?: (args: object) => Node,
 *   moveEvents?: boolean,
 *   onEventMove?: (event: object, toDate: string) => void,
 *   onMoreClick?: (isoDate: string) => void,
 *   weekendDays?: number[],
 *   selectedDates?: string[],
 *   selectedRange?: { start: string, end: string },
 *   onRangeSelect?: (start: string, end: string) => void,
 *   onNavigate?: (view: string, start: string, end: string) => void,
 *   onDayClick?: (isoDate: string) => void,
 *   onEventClick?: (event: object) => void,
 *   eventFields?: Array<object>,
 *   onFieldEdit?: (edit: { eventId: string, fieldId: string, value: unknown, previous: unknown }) => void,
 *   eventCompare?: (a: object, b: object) => number,
 *   onCopy?: (copied: { text: string, rowCount: number }) => boolean | void,
 *   exportFilename?: string,
 *   exportScope?: "period" | "all",
 *   onExport?: (file: { format: string, filename: string, eventCount: number, blob: Blob }) => boolean | void,
 *   renderDay?: (args: { date: string, events: object[], isToday: boolean, outsidePeriod: boolean,
 *     selected: boolean, disabled: boolean, inRange: boolean, ranges: object[], openEvent: (event: object) => void }) => Node,
 *   labels?: {
 *     previous?: (view: string) => string, next?: (view: string) => string,
 *     periodAnnouncement?: (view: string, start: string, end: string) => string,
 *     weekday?: (weekday: number) => string, weekdayAbbr?: (weekday: number) => string,
 *     day?: (isoDate: string, weekday: number, outsidePeriod: boolean) => string,
 *     weekNumber?: (week: number) => string,
 *     eventMoveAnnouncement?: (event: object, toDate: string) => string,
 *     editAnnouncement?: (eventTitle: string, fieldHeader: string, text: string) => string,
 *     editInvalid?: (eventTitle: string, fieldHeader: string) => string,
 *     exportAnnouncement?: (format: string, eventCount: number, filename: string) => string,
 *     periodTitle?: (view: string, start: string, end: string, anchorDate: string) => string,
 *     agendaEmpty?: string,
 *     moreEvents?: (hiddenCount: number, isoDate: string) => string,
 *     rangeAnnouncement?: (start: string, end: string) => string,
 *     searchAnnouncement?: (matched: number, total: number) => string,
 *     editRefused?: (eventTitle: string, fieldHeader: string, message: string) => string,
 *     fieldUndoAnnouncement?: (eventTitle: string, fieldHeader: string, text: string) => string, fieldRedoAnnouncement?: same,
 *     copyAnnouncement?: (rowCount: number) => string, copyFailed?: string,
 *   },
 * }=} opts
 * @returns {{ destroy: () => void, setEvents: (events: object[]) => void,
 *   setRanges: (ranges: object[]) => void, setSelectedRange: (range?: { start: string, end: string }) => void }}
 */
export function initCalendarView(root, opts = {}) {
  const noop = { destroy: () => {}, setEvents: () => {}, setRanges: () => {}, setSelectedRange: () => {}, getSelectedDates: () => [], setSelectedDates: () => {} };
  if (typeof document === "undefined" || !root) return noop;

  const table = root.querySelector(".calendar-table");
  const thead = root.querySelector(".calendar-table-head");
  const tbody = root.querySelector(".calendar-table-body");
  const statusEl = root.querySelector("[data-lily-calendar-view-status]");
  if (!table || !thead || !tbody) return noop;

  const labels = opts.labels || {};
  let events = Array.isArray(opts.events) ? opts.events.slice() : [];
  /** The events by id, rebuilt when they change. */
  let eventById = new Map(events.map((e) => [e.id, e]));
  let cursor = null;
  let focusPending = false;
  let ranges = Array.isArray(opts.ranges) ? opts.ranges.slice() : [];
  let selectedRange = opts.selectedRange ? { ...opts.selectedRange } : undefined;
  let rangeAnchor = null;
  let selectedDates = Array.isArray(opts.selectedDates) ? opts.selectedDates.slice() : [];
  let draggingEventId = null;
  const weekendDays = () => {
    if (Array.isArray(opts.weekendDays)) return opts.weekendDays;
    const raw = root.getAttribute("data-lily-calendar-view-weekend-days");
    return raw ? raw.split(",").map(Number) : [];
  };
  const selectionMode = () => (attr("selection-mode") === "multiple" ? "multiple" : "single");
  const agendaEmptyDays = () => !!opts.agendaEmptyDays || root.hasAttribute("data-lily-calendar-view-agenda-empty-days");
  const hideOutsideDays = () => root.hasAttribute("data-lily-calendar-view-hide-outside-days");
  const maxEvents = () => (opts.maxEvents != null ? opts.maxEvents : root.hasAttribute("data-lily-calendar-view-max-events") ? Number(attr("max-events")) : undefined);
  const movable = () => !!opts.moveEvents || typeof opts.onEventMove === "function" || root.hasAttribute("data-lily-calendar-view-move-events");

  const attr = (name) => root.getAttribute(`data-lily-calendar-view-${name}`) || "";
  const setAttr = (name, value) => {
    if (value) root.setAttribute(`data-lily-calendar-view-${name}`, value);
    else root.removeAttribute(`data-lily-calendar-view-${name}`);
  };
  const view = () => (VIEWS.includes(attr("view")) ? attr("view") : "month");
  const today = () => attr("today");
  const anchorDate = () => attr("anchor-date") || today() || "1970-01-01";
  const showWeekNumbers = () => root.hasAttribute("data-lily-calendar-view-show-week-numbers");
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
    if (selectionMode() === "multiple") {
      selectedDates = selectedDates.includes(isoDate)
        ? selectedDates.filter((d) => d !== isoDate)
        : [...selectedDates, isoDate].sort();
    } else {
      setAttr("selected-date", isoDate);
    }
    if (typeof opts.onDayClick === "function") opts.onDayClick(isoDate);
  }

  function setRange(a, b) {
    const [start, end] = a <= b ? [a, b] : [b, a];
    selectedRange = { start, end };
    if (typeof labels.rangeAnnouncement === "function" && statusEl) {
      statusEl.textContent = labels.rangeAnnouncement(start, end);
    }
  }

  function confirmRange() {
    if (!selectedRange) return;
    rangeAnchor = null;
    if (typeof opts.onRangeSelect === "function") opts.onRangeSelect(selectedRange.start, selectedRange.end);
    root.dispatchEvent(new CustomEvent("rangeselect", { detail: { ...selectedRange }, bubbles: true }));
  }

  /** The ISO week number of the week shown in `row` (its Thursday decides, as ISO 8601 says). */
  function weekNumberOf(row) {
    return isoWeek(row.find((d) => weekdayOf(d) === 4) || row[0]);
  }

  function attachEvent(calendarEvent, element) {
    if (!movable()) return;
    element.setAttribute("draggable", "true");
    element.setAttribute("data-event-id", calendarEvent.id);
    element.addEventListener("dragstart", (e) => {
      draggingEventId = calendarEvent.id;
      if (e.dataTransfer) e.dataTransfer.setData("text/plain", calendarEvent.id);
    });
  }

  function moveEventTo(calendarEvent, toDate) {
    if (!movable() || isDisabledDay(toDate)) return;
    if (typeof opts.onEventMove === "function") opts.onEventMove(calendarEvent, toDate);
    root.dispatchEvent(new CustomEvent("eventmove", { detail: { event: calendarEvent, toDate }, bubbles: true }));
    if (typeof labels.eventMoveAnnouncement === "function" && statusEl) {
      statusEl.textContent = labels.eventMoveAnnouncement(calendarEvent, toDate);
    }
  }

  function openEvent(event) {
    if (typeof opts.onEventClick === "function") opts.onEventClick(event);
  }

  // -----------------------------------------------------------------
  // Typed event fields, inline editing (agenda), export
  // -----------------------------------------------------------------

  const attrLocale = () => attr("locale") || undefined;
  let resolvedFields = null;
  /** Type defaults (format, compare, export value), resolved once per `eventFields` / locale, never per event or keystroke. */
  function fieldList() {
    if (!resolvedFields || resolvedFields.locale !== attrLocale()) {
      resolvedFields = { locale: attrLocale(), fields: resolveFields(opts.eventFields, attrLocale()) };
    }
    return resolvedFields.fields;
  }
  const fieldDef = (id) => fieldList().find((f) => f.id === id);
  const eventTitle = (event) => (typeof event.title === "string" ? event.title : event.id);
  const eventFieldText = (event, fieldId) => {
    const f = fieldDef(fieldId);
    return f ? fieldText(f, event.values) : "";
  };
  const searchInput = root.querySelector("[data-lily-calendar-view-search]");
  const searchQuery = () => (searchInput ? searchInput.value : "");
  const eventSearchText = (event) => [eventTitle(event), ...fieldList().map((f) => fieldText(f, event.values))].join(" ");
  const matchesQuery = (event) => searchQuery().trim() === "" || wordsMatch(eventSearchText(event), searchQuery());
  /** The events the search leaves, in `opts.eventCompare` order within a day (stable: the consumer's order breaks ties). */
  const shownEvents = () => events.filter(matchesQuery);
  const sortedDay = (list) => (typeof opts.eventCompare === "function" ? list.slice().sort(opts.eventCompare) : list);
  /** An event title as nodes, the matched words wrapped in `<mark class="mark calendar-view-match">`. */
  function titleNodes(text) {
    const query = searchQuery();
    if (query.trim() === "") return [document.createTextNode(text)];
    return highlightSegments(text, query).map((part) => {
      if (!part.match) return document.createTextNode(part.text);
      const mark = document.createElement("mark");
      mark.className = "mark calendar-view-match";
      mark.textContent = part.text;
      return mark;
    });
  }
  const say = (message) => {
    if (message && statusEl) statusEl.textContent = message;
  };
  const isFieldEditable = (f) => typeof opts.onFieldEdit === "function" && isEditableField(f);

  /** The field being edited, if any: the draft is the editor's text, kept current by the editor's own events (no re-render per keystroke). */
  let editing = null;

  function focusFieldButton(eventId, fieldId) {
    const li = Array.from(root.querySelectorAll("[data-event-key]")).find((el) => el.getAttribute("data-event-key") === eventId);
    const field = li && Array.from(li.querySelectorAll("[data-field]")).find((el) => el.getAttribute("data-field") === fieldId);
    const button = field && field.querySelector(".calendar-view-field-button");
    if (button) button.focus({ preventScroll: true });
  }

  function startFieldEdit(eventId, fieldId) {
    const event = eventById.get(eventId);
    const f = fieldDef(fieldId);
    if (!event || !f || !isFieldEditable(f)) return;
    editing = { eventId, fieldId, draft: draftOf(f, event.values) };
    render();
    const editor = root.querySelector(".calendar-view-field-editor");
    if (editor) {
      editor.focus({ preventScroll: true });
      if (editor.tagName === "INPUT" && editor.type !== "number" && editor.type !== "date" && editor.type !== "time") editor.select();
    }
  }

  /** Accept the edit, or refuse it (keeping the editor open) when the value does not fit the field's type. Returns whether it was accepted or unchanged. */
  function commitFieldEdit(refocus) {
    if (!editing) return true;
    const { eventId, fieldId, draft } = editing;
    const event = eventById.get(eventId);
    const f = fieldDef(fieldId);
    if (!event || !f) {
      editing = null;
      render();
      return true;
    }
    const outcome = evaluateEdit(f, event.values, draft);
    if (outcome.invalid) {
      const editor = root.querySelector(".calendar-view-field-editor");
      if (editor) editor.setAttribute("aria-invalid", "true");
      if (outcome.message && typeof labels.editRefused === "function") say(labels.editRefused(eventTitle(event), f.header, outcome.message));
      else if (typeof labels.editInvalid === "function") say(labels.editInvalid(eventTitle(event), f.header));
      return false;
    }
    editing = null;
    if (outcome.changed) {
      const edit = { eventId, fieldId, value: outcome.value, previous: outcome.previous };
      history = recordEdit(history, { ownerId: eventId, fieldId, value: outcome.value, previous: outcome.previous });
      if (typeof opts.onFieldEdit === "function") opts.onFieldEdit(edit);
      root.dispatchEvent(new CustomEvent("fieldedit", { detail: edit, bubbles: true }));
      if (typeof labels.editAnnouncement === "function" && statusEl) statusEl.textContent = labels.editAnnouncement(eventTitle(event), f.header, outcome.text);
    }
    render();
    if (refocus) focusFieldButton(eventId, fieldId);
    return true;
  }

  /** Accepted field edits, for Ctrl/Cmd+Z. The consumer owns the data, so an undo is reported through `onFieldEdit` / `fieldedit`. */
  let history = EMPTY_HISTORY;

  function stepHistory(direction) {
    const step = direction === "undo" ? undoEdit(history) : redoEdit(history);
    if (!step.record) return;
    history = step.history;
    const { ownerId, fieldId, value, previous } = step.record;
    const event = eventById.get(ownerId);
    const f = fieldDef(fieldId);
    if (!event || !f) return;
    const restored = direction === "undo" ? previous : value;
    event.values = { ...(event.values || {}), [fieldId]: restored };
    const edit = { eventId: ownerId, fieldId, value: restored, previous: direction === "undo" ? value : previous };
    if (typeof opts.onFieldEdit === "function") opts.onFieldEdit(edit);
    root.dispatchEvent(new CustomEvent("fieldedit", { detail: edit, bubbles: true }));
    const text = fieldText(f, event.values);
    const name = direction === "undo" ? "fieldUndoAnnouncement" : "fieldRedoAnnouncement";
    render();
    if (typeof labels[name] === "function") say(labels[name](eventTitle(event), f.header, text));
  }

  function cancelFieldEdit() {
    if (!editing) return;
    const { eventId, fieldId } = editing;
    editing = null;
    render();
    focusFieldButton(eventId, fieldId);
  }

  function onEditorKeydown(event) {
    // The editor owns its keys. While an IME composes, Enter, Escape and Tab belong to the IME: some browsers
    // report the confirming Enter with `isComposing` already false but keyCode 229.
    event.stopPropagation();
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "Enter") {
      event.preventDefault();
      commitFieldEdit(true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelFieldEdit();
    } else if (event.key === "Tab" && editing) {
      // Tab commits and moves to the event's next (Shift+Tab: previous) editable field; past the last, it moves on.
      const { eventId, fieldId } = editing;
      const next = neighbourField(fieldList().filter(isFieldEditable), fieldId, event.shiftKey);
      if (next) {
        event.preventDefault();
        if (commitFieldEdit(false)) startFieldEdit(eventId, next.id);
      } else {
        commitFieldEdit(false);
      }
    }
  }

  /** One field's node: its name and either the value, a button that opens the editor, or the editor itself. */
  function fieldNode(event, f) {
    const text = fieldText(f, event.values);
    const editable = isFieldEditable(f);
    const nameId = `${root.id || "calendar-view"}-fn-${event.id}-${f.id}`;
    const valueId = `${root.id || "calendar-view"}-fv-${event.id}-${f.id}`;
    const isEditing = !!editing && editing.eventId === event.id && editing.fieldId === f.id;
    if (!isEditing && text === "" && !editable) return null;
    const span = document.createElement("span");
    span.className = "calendar-view-event-field";
    span.setAttribute("data-field", f.id);
    const name = document.createElement("span");
    name.className = "calendar-view-event-field-name";
    name.id = nameId;
    name.textContent = f.header;
    span.appendChild(name);
    span.appendChild(document.createTextNode(" "));
    if (isEditing) {
      span.setAttribute("data-editing", "");
      const kind = editorKind(f);
      const state = editing;
      let editor;
      if (kind === "select" || kind === "radio") {
        editor = document.createElement("select");
        const blank = document.createElement("option");
        blank.value = "";
        editor.appendChild(blank);
        for (const option of f.options || []) {
          const o = document.createElement("option");
          o.value = option.id;
          o.disabled = !!option.disabled;
          o.textContent = option.label;
          editor.appendChild(o);
        }
        editor.addEventListener("change", () => {
          state.draft = editor.value;
          commitFieldEdit(true);
        });
      } else {
        editor = document.createElement("input");
        editor.type = kind === "number" ? "number" : kind === "date" ? "date" : kind === "time" ? "time" : "text";
        if (kind === "number") editor.setAttribute("inputmode", "decimal");
        editor.addEventListener("input", () => {
          state.draft = editor.value;
          editor.removeAttribute("aria-invalid");
        });
      }
      editor.className = "calendar-view-field-editor";
      editor.setAttribute("aria-label", f.editLabel || f.header);
      editor.value = String(state.draft == null ? "" : state.draft);
      editor.addEventListener("keydown", onEditorKeydown);
      editor.addEventListener("blur", () => commitFieldEdit(false));
      span.setAttribute("data-type", f.type || "text");
      span.appendChild(editor);
      return span;
    }
    span.setAttribute("data-type", f.type || "text");
    if (editable) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-view-field-button";
      button.id = valueId;
      button.setAttribute("aria-labelledby", `${nameId} ${valueId}`);
      button.textContent = text;
      button.addEventListener("click", () => startFieldEdit(event.id, f.id));
      span.appendChild(button);
    } else {
      const value = document.createElement("span");
      value.className = "calendar-view-event-field-value";
      value.textContent = text;
      span.appendChild(value);
    }
    return span;
  }

  const eventSpan = (event) =>
    event.date ? { start: event.date, end: event.date } : event.start && event.end ? { start: event.start, end: event.end } : null;

  /** The events an export holds: those that touch the shown period (or every one), dated ones only, by start date. */
  function exportEvents() {
    const dated = shownEvents().filter((e) => eventSpan(e) !== null);
    const [pStart, pEnd] = periodRange(view(), anchorDate(), firstDay());
    const kept = opts.exportScope === "all" ? dated : dated.filter((e) => eventSpan(e).start <= pEnd && eventSpan(e).end >= pStart);
    return kept.sort((a, b) => eventSpan(a).start.localeCompare(eventSpan(b).start));
  }

  function syncExport() {
    const disabled = exportEvents().length === 0;
    root.querySelectorAll("[data-calendar-export-format]").forEach((b) => {
      b.disabled = disabled;
    });
  }

  function exportHeaders() {
    if (labels.exportHeaders) return labels.exportHeaders;
    try {
      return JSON.parse(root.getAttribute("data-lily-calendar-view-export-headers") || "null");
    } catch {
      return null;
    }
  }

  async function finishCopy(table) {
    const text = toClipboardText(table);
    const copied = { text, rowCount: table.rows.length };
    root.dispatchEvent(new CustomEvent("copy", { detail: copied, bubbles: true }));
    if (typeof opts.onCopy === "function" && opts.onCopy(copied) === false) return;
    const ok = await copyToClipboard(text);
    if (ok && typeof labels.copyAnnouncement === "function") say(labels.copyAnnouncement(table.rows.length));
    else if (!ok && typeof labels.copyFailed === "string") say(labels.copyFailed);
  }

  function runExport(format) {
    const h = exportHeaders();
    if (!h) return;
    const fields = exportableFields(fieldList());
    const headers = [h.title, h.start, h.end, ...fields.map((f) => f.header)];
    const body = exportEvents().map((event) => {
      const span = eventSpan(event);
      return [eventTitle(event), civilDateToDate(span.start), civilDateToDate(span.end), ...fields.map((f) => exportFieldCell(f, event.values))];
    });
    if (format === "copy") {
      void finishCopy({ headers, rows: body });
      return;
    }
    const base = opts.exportFilename || "calendar";
    const filename = exportFilename(base, format);
    const blob = exportBlob({ headers, rows: body }, format, { sheetName: base });
    const file = { format, filename, eventCount: body.length, blob };
    root.dispatchEvent(new CustomEvent("exportfile", { detail: file, bubbles: true }));
    if (typeof opts.onExport === "function" && opts.onExport(file) === false) return;
    downloadBlob(blob, filename);
    if (typeof labels.exportAnnouncement === "function" && statusEl) statusEl.textContent = labels.exportAnnouncement(format, body.length, filename);
  }

  function defaultRenderDay(args) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(String((parseIsoDate(args.date) || {}).day || "")));
    args.visibleEvents.forEach((event) => {
      if (typeof event.title !== "string") return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-view-event";
      button.replaceChildren(...titleNodes(event.title));
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        args.openEvent(event);
      });
      args.attachEvent(event, button);
      fragment.appendChild(button);
    });
    if (args.hiddenCount > 0 && typeof labels.moreEvents === "function") {
      const more = document.createElement("button");
      more.type = "button";
      more.className = "calendar-view-more-button";
      more.textContent = labels.moreEvents(args.hiddenCount, args.date);
      more.addEventListener("click", (e) => {
        e.stopPropagation();
        if (typeof opts.onMoreClick === "function") opts.onMoreClick(args.date);
        root.dispatchEvent(new CustomEvent("moreclick", { detail: args.date, bubbles: true }));
      });
      fragment.appendChild(more);
    }
    return fragment;
  }

  /** The agenda: a plain list of the month's days that have events, in place of the grid. */
  function renderAgenda(anchor, eventMap) {
    root.querySelectorAll("[data-lily-calendar-view-agenda]").forEach((el) => el.remove());
    table.hidden = true;
    const holder = document.createElement("div");
    holder.setAttribute("data-lily-calendar-view-agenda", "");
    const list = document.createElement("ol");
    list.className = "calendar-view-agenda";
    list.setAttribute("aria-label", root.getAttribute("data-lily-calendar-view-label") || table.getAttribute("aria-label") || "");
    const [start, end] = periodRange("agenda", anchor, firstDay());
    const cap = maxEvents();
    const todayIso = today();
    const weekend = weekendDays();
    let count = 0;
    for (let d = start; d <= end; d = addDays(d, 1)) {
      const dayEvents = eventMap.get(d) || [];
      if (!agendaEmptyDays() && dayEvents.length === 0) continue;
      count += 1;
      const weekday = weekdayOf(d);
      const isToday = !!todayIso && d === todayIso;
      const dayRanges = ranges.filter((r) => d >= r.start && d <= r.end);
      const li = document.createElement("li");
      li.className = "calendar-view-agenda-day";
      li.setAttribute("data-date", d);
      if (isToday) {
        li.setAttribute("data-today", "");
        li.setAttribute("aria-current", "date");
      }
      if (weekend.includes(weekday)) li.setAttribute("data-weekend", "");
      if (dayRanges.length) li.setAttribute("data-range", dayRanges.map((r) => r.kind || "range").join(" "));
      const time = document.createElement("time");
      time.className = "calendar-view-agenda-date";
      time.setAttribute("datetime", d);
      time.textContent = (typeof labels.day === "function" && labels.day(d, weekday, false)) || d;
      li.appendChild(time);
      if (dayEvents.length > 0) {
        const args = {
          date: d,
          events: dayEvents,
          visibleEvents: cap == null ? dayEvents : dayEvents.slice(0, Math.max(0, cap)),
          hiddenCount: cap == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, cap)),
          isToday,
          outsidePeriod: false,
          selected: false,
          disabled: isDisabledDay(d),
          inRange: false,
          ranges: dayRanges,
          openEvent,
          attachEvent: () => {},
          fieldText: eventFieldText,
        };
        if (typeof opts.renderAgendaDay === "function") li.appendChild(opts.renderAgendaDay(args));
        else {
          const ul = document.createElement("ul");
          ul.className = "calendar-view-agenda-events";
          dayEvents.forEach((event) => {
            const item = document.createElement("li");
            item.setAttribute("data-event-key", event.id);
            const button = document.createElement("button");
            button.type = "button";
            button.className = "calendar-view-event";
            button.replaceChildren(...titleNodes(eventTitle(event)));
            button.addEventListener("click", () => openEvent(event));
            item.appendChild(button);
            const list = fieldList();
            if (list.length > 0) {
              const fieldsEl = document.createElement("span");
              fieldsEl.className = "calendar-view-event-fields";
              for (const f of list) {
                const node = fieldNode(event, f);
                if (node) fieldsEl.appendChild(node);
              }
              item.appendChild(fieldsEl);
            }
            ul.appendChild(item);
          });
          li.appendChild(ul);
        }
      }
      list.appendChild(li);
    }
    holder.appendChild(list);
    if (count === 0 && typeof labels.agendaEmpty === "string" && labels.agendaEmpty) {
      const empty = document.createElement("p");
      empty.className = "calendar-view-agenda-empty";
      empty.textContent = labels.agendaEmpty;
      holder.appendChild(empty);
    }
    table.before(holder);
  }

  function render() {
    syncExport();
    const v = view();
    const anchor = anchorDate();
    const days = periodDays(v, anchor, firstDay());
    const flat = days.flat();
    cursor = effectiveCursor(flat);
    const eventMap = eventsByDay(shownEvents());
    for (const [day, list] of eventMap) eventMap.set(day, sortedDay(list));
    const selected = attr("selected-date");
    const todayIso = today();

    if (v !== "agenda") {
      table.hidden = false;
      root.querySelectorAll("[data-lily-calendar-view-agenda]").forEach((el) => el.remove());
    }

    // Switcher state and the arrows' names (a function of the current view).
    root.querySelectorAll("[data-lily-calendar-view-switch]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lily-calendar-view-switch") === v));
    });
    const previous = root.querySelector("[data-lily-calendar-view-previous]");
    const next = root.querySelector("[data-lily-calendar-view-next]");
    if (previous && typeof labels.previous === "function") previous.setAttribute("aria-label", labels.previous(v));
    if (next && typeof labels.next === "function") next.setAttribute("aria-label", labels.next(v));

    if (v === "agenda") {
      const titleAgenda = root.querySelector("[data-lily-calendar-view-title]");
      if (titleAgenda && typeof labels.periodTitle === "function") {
        const [a, b] = periodRange(v, anchor, firstDay());
        titleAgenda.textContent = labels.periodTitle(v, a, b, anchor);
      }
      renderAgenda(anchor, eventMap);
      return;
    }

    thead.replaceChildren();
    const headRow = document.createElement("tr");
    headRow.className = "calendar-table-row";
    if (showWeekNumbers()) {
      const th = document.createElement("th");
      th.className = "calendar-table-th";
      th.setAttribute("scope", "col");
      th.setAttribute("data-week-number-header", "");
      th.textContent = root.getAttribute("data-lily-calendar-view-week-number-header") || "";
      headRow.appendChild(th);
    }
    // Period title (the macro renders the placeholder when `showPeriodTitle` is set).
    const titleEl = root.querySelector("[data-lily-calendar-view-title]");
    if (titleEl && typeof labels.periodTitle === "function") {
      const [titleStart, titleEnd] = periodRange(v, anchor, firstDay());
      titleEl.textContent = labels.periodTitle(v, titleStart, titleEnd, anchor);
    }
    for (let i = 0; i < (v === "day" ? 1 : 7); i++) {
      const weekday = v === "day" ? weekdayOf(anchor) : (firstDay() + i) % 7;
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
      if (showWeekNumbers()) {
        const weekNo = weekNumberOf(week);
        const th = document.createElement("th");
        th.className = "calendar-table-th";
        th.setAttribute("scope", "row");
        th.setAttribute("data-week-number", String(weekNo));
        if (typeof labels.weekNumber === "function") th.setAttribute("aria-label", labels.weekNumber(weekNo));
        th.textContent = String(weekNo);
        tr.appendChild(th);
      }
      week.forEach((d) => {
        const outside = isOutsidePeriod(v, d, anchor);
        const isToday = !!todayIso && d === todayIso;
        const disabled = isDisabledDay(d);
        const picked = selectionMode() === "multiple" ? selectedDates.includes(d) : selected === d;
        const inRange = !!selectedRange && d >= selectedRange.start && d <= selectedRange.end;
        const dayRanges = ranges.filter((r) => d >= r.start && d <= r.end);
        const td = document.createElement("td");
        td.className = "calendar-table-td";
        td.setAttribute("role", "gridcell");
        td.setAttribute("tabindex", d === cursor ? "0" : "-1");
        if (d === cursor) td.setAttribute("aria-selected", "true");
        if (isToday) td.setAttribute("aria-current", "date");
        td.setAttribute("data-date", d);
        if (outside) td.setAttribute("data-outside-period", "");
        if (weekendDays().includes(weekdayOf(d))) td.setAttribute("data-weekend", "");
        if (picked) td.setAttribute("data-selected", "");
        if (inRange) td.setAttribute("data-in-range", "");
        if (selectedRange && selectedRange.start === d) td.setAttribute("data-range-start", "");
        if (selectedRange && selectedRange.end === d) td.setAttribute("data-range-end", "");
        if (dayRanges.length) td.setAttribute("data-range", dayRanges.map((r) => r.kind || "range").join(" "));
        if (disabled) {
          td.setAttribute("data-disabled", "");
          td.setAttribute("aria-disabled", "true");
        }
        if (typeof labels.day === "function") td.setAttribute("aria-label", labels.day(d, weekdayOf(d), outside));
        td.addEventListener("dragover", (e) => {
          if (draggingEventId && movable()) e.preventDefault();
        });
        td.addEventListener("drop", (e) => {
          e.preventDefault();
          const id = draggingEventId || (e.dataTransfer ? e.dataTransfer.getData("text/plain") : "");
          draggingEventId = null;
          const calendarEvent = events.find((ev) => ev.id === id);
          if (calendarEvent) moveEventTo(calendarEvent, d);
        });
        if (hideOutsideDays() && outside) {
          tr.appendChild(td);
          return;
        }
        const dayEvents = eventMap.get(d) || [];
        const cap = maxEvents();
        const args = {
          date: d,
          events: dayEvents,
          visibleEvents: cap == null ? dayEvents : dayEvents.slice(0, Math.max(0, cap)),
          hiddenCount: cap == null ? 0 : Math.max(0, dayEvents.length - Math.max(0, cap)),
          isToday,
          outsidePeriod: outside,
          selected: picked,
          disabled,
          inRange,
          ranges: dayRanges,
          openEvent,
          attachEvent,
          fieldText: eventFieldText,
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
    if (view() === "day") navigateTo(addDays(anchor, delta));
    else if (view() === "week") navigateTo(addDays(anchor, delta * 7));
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
    } else if (v === "day") {
      if (next !== anchor) {
        setAttr("anchor-date", next);
        emitNavigate(v, next);
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
    if (view() === "day") moveCursor(addDays(c, delta));
    else if (view() === "week") moveCursor(addDays(c, delta * 7));
    else if (view() === "four-week") moveCursor(addDays(c, delta * 28));
    else moveCursor(addMonths(c, delta));
  }

  function onGridKeydown(event) {
    if (event.target && event.target.closest && event.target.closest(".calendar-view-field-editor")) return;
    // The horizontal arrows are visual: in a right-to-left layout ArrowLeft goes to the next day.
    const key = logicalKey(event.key, isRtl(table));
    const historyAction = typeof opts.onFieldEdit === "function" ? historyKey(event) : null;
    if (historyAction) {
      event.preventDefault();
      stepHistory(historyAction);
      return;
    }
    if (movable() && event.altKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)) {
      const el = event.target.closest ? event.target.closest("[data-event-id]") : null;
      const fromCell = el && el.closest("[data-date]");
      const calendarEvent = el ? events.find((e) => e.id === el.getAttribute("data-event-id")) : undefined;
      if (el && fromCell && calendarEvent) {
        event.preventDefault();
        const week = view() === "day" ? 1 : 7;
        const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -week, ArrowDown: week }[key];
        moveEventTo(calendarEvent, addDays(fromCell.getAttribute("data-date"), delta));
        return;
      }
    }
    const c = effectiveCursor(visibleDays());
    const offset = view() === "day" ? 0 : (weekdayOf(c) - firstDay() + 7) % 7;
    const extending = event.shiftKey && MOVE_KEYS.has(event.key);
    if (extending && rangeAnchor === null) {
      rangeAnchor = attr("selected-date") && !selectedRange ? attr("selected-date") : c;
    }
    if (!extending && MOVE_KEYS.has(event.key)) rangeAnchor = null;
    switch (key) {
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
        moveCursor(addDays(c, view() === "day" ? -1 : -7));
        break;
      case "ArrowDown":
        event.preventDefault();
        moveCursor(addDays(c, view() === "day" ? 1 : 7));
        break;
      case "Home":
        event.preventDefault();
        moveCursor(addDays(c, -offset));
        break;
      case "End":
        event.preventDefault();
        moveCursor(addDays(c, view() === "day" ? 0 : 6 - offset));
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
        if (rangeAnchor !== null && selectedRange) confirmRange();
        else pick(c);
        focusPending = true;
        render();
        break;
      case "Escape":
        if (selectedRange || rangeAnchor !== null) {
          event.preventDefault();
          rangeAnchor = null;
          selectedRange = undefined;
          focusPending = true;
          render();
        }
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
    if (extending && rangeAnchor !== null && cursor !== null) {
      setRange(rangeAnchor, cursor);
      focusPending = true;
      render();
    }
  }

  function onRootClick(event) {
    const target = event.target;
    if (!target || !target.closest) return;
    const exportButton = target.closest("[data-calendar-export-format]");
    if (exportButton) return runExport(exportButton.getAttribute("data-calendar-export-format"));
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
      const d = cell.getAttribute("data-date");
      if (event.shiftKey && !isDisabledDay(d)) {
        // Shift+click picks a range from the picked day (or the cursor) to here, and confirms it.
        const from = attr("selected-date") && !selectedRange ? attr("selected-date") : effectiveCursor(visibleDays());
        cursor = d;
        setRange(from, d);
        confirmRange();
        render();
        return;
      }
      cursor = d;
      rangeAnchor = null;
      pick(cursor);
      render();
    }
  }

  function onSearchInput() {
    render();
    const matched = events.filter(matchesQuery).length;
    if (typeof labels.searchAnnouncement === "function") say(labels.searchAnnouncement(matched, events.length));
  }
  function onSearchKeydown(event) {
    if (event.key !== "Escape" || !searchInput || searchInput.value === "") return;
    event.preventDefault();
    searchInput.value = "";
    onSearchInput();
  }
  if (searchInput) {
    searchInput.addEventListener("input", onSearchInput);
    searchInput.addEventListener("keydown", onSearchKeydown);
  }
  /** Undo/redo from the agenda, where focus sits in the list rather than the grid. */
  function onRootKeydown(event) {
    if (table.contains(event.target) || (event.target.closest && event.target.closest(".calendar-view-field-editor"))) return;
    const action = typeof opts.onFieldEdit === "function" && !(event.target instanceof HTMLInputElement) ? historyKey(event) : null;
    if (!action) return;
    event.preventDefault();
    stepHistory(action);
  }
  root.addEventListener("keydown", onRootKeydown);
  table.addEventListener("keydown", onGridKeydown);
  root.addEventListener("click", onRootClick);
  render();

  return {
    destroy: () => {
      table.removeEventListener("keydown", onGridKeydown);
      root.removeEventListener("click", onRootClick);
      root.removeEventListener("keydown", onRootKeydown);
      if (searchInput) {
        searchInput.removeEventListener("input", onSearchInput);
        searchInput.removeEventListener("keydown", onSearchKeydown);
      }
    },
    setEvents: (next) => {
      events = Array.isArray(next) ? next.slice() : [];
      eventById = new Map(events.map((e) => [e.id, e]));
      render();
    },
    setRanges: (next) => {
      ranges = Array.isArray(next) ? next.slice() : [];
      render();
    },
    getSelectedDates: () => selectedDates.slice(),
    setSelectedDates: (next) => {
      selectedDates = Array.isArray(next) ? next.slice() : [];
      render();
    },
    setSelectedRange: (next) => {
      selectedRange = next ? { ...next } : undefined;
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
