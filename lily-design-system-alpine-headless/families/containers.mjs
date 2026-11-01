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

    "task-bar": {
        tag: "div",
        keyboard: "None (passive element); Tab moves between the consumer's controls",
        aria: "aria-label for accessible name",
        markup: `<div
  class="task-bar"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`,
        sel: "div.task-bar",
        test: usesTag("task-bar", "div"),
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
