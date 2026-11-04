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

    "task-bar": {
        tag: "div",
        keyboard: "ArrowLeft/ArrowRight move between the controls (wrapping), Home/End jump; one tab stop",
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
