// Family: containers whose HTML snippet carries a script that the Alpine snippet does without, because the contract's
// keys are the browser's own: horizontal-scroller (a focusable region the arrow keys scroll), task-bar (Tab between the
// consumer's controls) and icon-button (a native button). The HTML scripts only add extras (smooth scrolling by a step,
// arrow-key focus, toggling aria-pressed the consumer owns), so these snippets are markup.

const usesTag = (slug, tag) => `
  it("uses the ${tag} element", async () => {
    await mount("${slug}");
    expect(el().tagName.toLowerCase()).toBe("${tag}");
  });`;

export default {
    "horizontal-scroller": {
        tag: "div",
        keyboard:
            "the browser's: once focused (tabindex 0), ArrowLeft/ArrowRight scroll it; Tab moves to focusable children",
        aria: 'role="region", aria-label for accessible name',
        markup: `<div
  class="horizontal-scroller"
  role="region"
  aria-label=""
  tabindex="0"
>
  <!-- Consumer provides content -->
</div>`,
        sel: "div.horizontal-scroller",
        test: usesTag("horizontal-scroller", "div"),
    },

    "kanban-table": {
        tag: 'table with role="grid"',
        keyboard:
            "arrows, Home, End, Ctrl+Home, Ctrl+End, PageUp and PageDown move between cells; one tab stop; Enter or F2 goes to the first control in a cell and Escape comes back",
        aria: 'role="grid" with required aria-label; set data-consumer-keys on the root to run your own keys',
        markup: `<table
  class="kanban-table"
  role="grid"
  aria-label=""
  x-lily-grid
>
  <!-- Consumer provides thead, tbody, tfoot -->
</table>`,
        sel: "table.kanban-table",
        test: usesTag("kanban-table", "table"),
    },

    "action-bar": {
        tag: 'div with role="toolbar"',
        keyboard:
            "ArrowLeft/ArrowRight move between the controls (wrapping), Home/End jump; one tab stop; Escape presses the clear button",
        aria: 'role="toolbar" with required aria-label; the count is announced by the consumer; data-selected-count for CSS',
        markup: `<div
  class="action-bar"
  role="toolbar"
  aria-label=""
  data-selected-count="0"
  x-lily-toolbar=".action-bar-clear"
>
  <span class="action-bar-count"></span>
  <!-- Consumer inserts action-bar-button children here -->
  <button
    class="action-bar-clear"
    type="button"
    aria-label=""
  >
    ×
  </button>
</div>`,
        sel: "div.action-bar",
        test: usesTag("action-bar", "div"),
    },

    "split-view": {
        tag: "div",
        keyboard:
            "on the divider: the arrows for its orientation, Shift for ten steps, Home/End for the bounds, Enter to collapse and restore",
        aria: 'aria-label on the container; the divider is role="separator" with aria-orientation and the aria-value attributes',
        markup: `<div
  class="split-view"
  aria-label=""
  data-orientation="horizontal"
  data-split-percent="50"
  x-lily-split-view
>
  <section class="split-view-primary">
    <!-- Consumer provides primary panel content -->
  </section>

  <div
    class="split-view-divider"
    role="separator"
    aria-orientation="horizontal"
    aria-valuenow="50"
    aria-valuemin="0"
    aria-valuemax="100"
    tabindex="0"
  ></div>

  <section class="split-view-secondary">
    <!-- Consumer provides secondary panel content -->
  </section>
</div>`,
        sel: "div.split-view",
        test: usesTag("split-view", "div"),
    },

    "task-bar": {
        tag: "div",
        keyboard:
            "ArrowLeft/ArrowRight move between the controls (wrapping), Home/End jump; one tab stop",
        aria: 'role="toolbar" with aria-label',
        markup: `<div
  class="task-bar"
  role="toolbar"
  aria-label=""
  x-lily-toolbar
>
  <!-- Consumer provides content -->
</div>`,
        sel: "div.task-bar",
        test:
            usesTag("task-bar", "div") +
            `
  it("arrows move between the controls", async () => {
    await mount("task-bar");
    const root = document.querySelector(".task-bar");
    root.innerHTML = "<button>One</button><button>Two</button>";
    const [one, two] = root.querySelectorAll("button");
    one.focus();
    one.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    await tick();
    expect(document.activeElement).toBe(two);
  });`,
    },

    "icon-button": {
        tag: "button",
        keyboard: "Tab to focus, Enter or Space to activate (native <button> behavior)",
        aria: "aria-label is REQUIRED — provides the entire accessible name for an icon-only button. aria-pressed is set when the button is a toggle.",
        markup: `<button
  class="icon-button"
  type="button"
  aria-label=""
>
  <!-- Consumer provides icon content (SVG, emoji, or glyph) -->
</button>`,
        sel: "button.icon-button",
        test: usesTag("icon-button", "button"),
    },
};
