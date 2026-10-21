// The four helper demo pages: each is a classic inline script that sets the options its snippet reads
// (the script runs before the Alpine module, so the options exist when Alpine starts). Concrete English strings live
// here, in the example layer, and flow through the same `labels.*` names a consumer would translate.

const iso = (offset) => `new Date(Date.now() + ${offset} * 864e5).toISOString().slice(0, 10)`;

export const HELPERS = {
  "data-grid": {
    title: "Data grid",
    package: "lily-design-system-alpine-data-grid",
    description: "Sort, filter, select, paginate, show or hide columns, move with the keyboard and export.",
    script: `
window.gridOptions = {
  columns: [
    { id: "name", header: "Name", sortable: true },
    { id: "role", header: "Role", sortable: true, hidable: true },
    { id: "team", header: "Team", sortable: true, hidable: true },
    { id: "years", header: "Years", sortable: true, hidable: true },
  ],
  rows: [
    { id: "1", name: "Alice Nguyen", role: "Designer", team: "Platform", years: 6 },
    { id: "2", name: "Bob Okafor", role: "Engineer", team: "Platform", years: 3 },
    { id: "3", name: "Carol Silva", role: "Engineer", team: "Care", years: 9 },
    { id: "4", name: "Dave Müller", role: "Researcher", team: "Care", years: null },
    { id: "5", name: "Éve Laurent", role: "Designer", team: "Care", years: 2 },
    { id: "6", name: "Farid Haddad", role: "Engineer", team: "Data", years: 5 },
    { id: "7", name: "Grace Kim", role: "Manager", team: "Platform", years: 11 },
    { id: "8", name: "Hugo Rossi", role: "Engineer", team: "Data", years: 1 },
  ],
  rowId: "id",
  rowNameColumn: "name",
  selectionMode: "multiple",
  pageSize: 5,
  exportFilename: "people",
  labels: {
    grid: "People",
    caption: "People in the team",
    search: "Search people",
    pagination: "Pages",
    columns: "Columns",
    toggleColumn: (header) => "Show " + header,
    selectAll: "Select all people on this page",
    selectRow: (name) => "Select " + name,
    sortButton: (header) => "Sort by " + header,
    previousPage: "Previous",
    nextPage: "Next",
    pageStatus: (page, count) => "Page " + page + " of " + count,
    empty: "No people match",
    exportCsv: "Download CSV",
    exportTsv: "Download TSV",
    copy: "Copy",
    copyAnnouncement: (n) => "Copied " + n + " rows",
    copyFailed: "Could not copy",
    sortAnnouncement: (header, dir) => header + (dir === "none" ? " sort off" : dir === "asc" ? " sorted ascending" : " sorted descending"),
    filterAnnouncement: (n) => n + " people shown",
  },
};`,
  },

  "kanban-board": {
    title: "Kanban board",
    package: "lily-design-system-alpine-kanban-board",
    description: "Move cards by dragging, by the Move menu, or with Alt and the arrow keys; the Doing column warns at two cards.",
    script: `
window.boardOptions = {
  columns: [
    { id: "todo", title: "To do" },
    { id: "doing", title: "Doing", wipLimit: 2 },
    { id: "done", title: "Done" },
  ],
  cards: [
    { id: "c1", columnId: "todo", title: "Write the spec" },
    { id: "c2", columnId: "todo", title: "Draft the tests" },
    { id: "c3", columnId: "doing", title: "Build the component" },
    { id: "c4", columnId: "doing", title: "Review the markup" },
    { id: "c5", columnId: "done", title: "Choose the name" },
  ],
  labels: {
    grid: "Work board",
    caption: "Work board",
    cardCount: (n) => n + (n === 1 ? " card" : " cards"),
    overLimit: (n, limit) => n + " cards, limit " + limit,
    moveButton: (title) => "Move " + title,
    moveMenu: "Move to",
    moveAnnouncement: (card, column) => card + " moved to " + column,
    moveBlocked: (card, column) => card + " cannot move to " + column,
  },
};`,
  },

  calendar: {
    title: "Calendar",
    package: "lily-design-system-alpine-calendar",
    description: "Month and week views with a picked day, events, bounds and the date-grid keys.",
    script: `
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthName = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "UTC" });
const today = ${iso(0)};
window.calendarOptions = {
  today,
  weekStart: 1,
  events: [
    { id: "e1", date: ${iso(2)}, title: "Check-up" },
    { id: "e2", date: ${iso(2)}, title: "Team review" },
    { id: "e3", date: ${iso(9)}, title: "Release" },
  ],
  labels: {
    grid: "Appointments",
    monthView: "Month",
    weekView: "Week",
    today: "Today",
    previous: (view) => "Previous " + view,
    next: (view) => "Next " + view,
    weekdayAbbr: (d) => weekdays[d].slice(0, 3),
    weekdayName: (d) => weekdays[d],
    periodTitle: (start) => monthName.format(new Date(start + "T00:00:00Z")),
    periodAnnouncement: (start, end, view) => view + ": " + monthName.format(new Date(start + "T00:00:00Z")),
    dayLabel: (d) => longDate.format(new Date(d + "T00:00:00Z")),
  },
};`,
  },

  "gantt-chart": {
    title: "Gantt chart",
    package: "lily-design-system-alpine-gantt-chart",
    description: "Tasks on a day timeline with a collapsible phase, a milestone, dependencies and the critical path.",
    script: `
const today = ${iso(0)};
const day = (n) => ${iso("n")};
window.ganttOptions = {
  range: { start: day(-2), end: day(21) },
  today,
  weekends: [0, 6],
  criticalPath: true,
  tasks: [
    { id: "phase", label: "Phase one" },
    { id: "design", label: "Design", start: day(0), end: day(3), parentId: "phase", percentComplete: 100 },
    { id: "build", label: "Build", start: day(4), end: day(12), parentId: "phase", dependsOn: ["design"], percentComplete: 40 },
    { id: "docs", label: "Write docs", start: day(2), end: day(6), percentComplete: 20 },
    { id: "launch", label: "Launch", start: day(13), end: day(13), dependsOn: ["build"] },
  ],
  labels: {
    grid: "Project plan",
    caption: "Project plan",
    taskColumn: "Task",
    columnLabel: (d) => d.slice(5),
    collapseButton: (task, collapsed) => (collapsed ? "Expand " : "Collapse ") + task.label,
    dependencySummary: (predecessors) => "Depends on: " + predecessors.join(", "),
    criticalLabel: "Critical",
    milestoneLabel: "Milestone",
  },
};`.replace("${iso(\"n\")}", "new Date(Date.now() + n * 864e5).toISOString().slice(0, 10)"),
  },
};
