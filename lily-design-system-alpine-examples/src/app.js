// The page script: Alpine, the Lily plugin, the four helper plugins and the theme switcher.
// Built by build.mjs into assets/app.js. A page sets any options its snippet needs (gridOptions, boardOptions,
// calendarOptions, ganttOptions) in a classic inline script, which runs before this module and so before Alpine starts.
import Alpine from "alpinejs";
import lily from "../../lily-design-system-alpine-headless/lily-alpine.js";
import lilyDataGrid from "../../lily-design-system-alpine-data-grid/index.ts";
import lilyKanbanBoard from "../../lily-design-system-alpine-kanban-board/index.ts";
import lilyCalendarView from "../../lily-design-system-alpine-calendar/index.ts";
import lilyGanttChart from "../../lily-design-system-alpine-gantt-chart/index.ts";

Alpine.plugin(lily);
Alpine.plugin(lilyDataGrid);
Alpine.plugin(lilyKanbanBoard);
Alpine.plugin(lilyCalendarView);
Alpine.plugin(lilyGanttChart);

// A plain <select> over the reference themes: swaps the theme <link> and data-theme, and remembers the choice.
// (A real theme-picker helper for Alpine does not exist yet.)
Alpine.data("lilyThemeSelect", () => ({
  themes: window.lilyThemes ?? [],
  value: document.documentElement.getAttribute("data-theme") ?? "",
  choose() {
    document.getElementById("lily-theme-link").href = `/themes/${this.value}.css`;
    document.documentElement.setAttribute("data-theme", this.value);
    try {
      localStorage.setItem("lily-theme", this.value);
    } catch {
      // storage can be blocked; the choice then lasts for this page only
    }
  },
}));

// The components index filter: every term must appear in a component's name or description.
Alpine.data("lilyComponentFilter", () => ({
  query: "",
  matches(text) {
    const terms = this.query.toLowerCase().split(/\s+/).filter(Boolean);
    const folded = text.toLowerCase();
    return terms.every((t) => folded.includes(t));
  },
  count() {
    return [...document.querySelectorAll(".component-index li")].filter((li) => this.matches(li.dataset.text)).length;
  },
}));

window.Alpine = Alpine;
Alpine.start();
