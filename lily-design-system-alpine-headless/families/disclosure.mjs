// Family: disclosure and dismissal. Reuses lilyCollapsible / lilyPopover and
// adds lilyDismissible, lilyAccordion, lilyCheckboxAccordion, lilyHoverCard.
export default {
  details: {
    tag: "details", keyboard: "Tab to the summary, Enter or Space to open and close",
    aria: "native disclosure semantics; no ARIA added",
    markup: `<details class="details">
  <summary class="details-summary"><!-- Consumer provides summary --></summary>
  <!-- Consumer provides content -->
</details>`,
    test: `
  it("is a native disclosure, closed by default", async () => {
    await mount("details");
    expect(el().open).toBe(false);
    el().open = true;
    expect(el().hasAttribute("open")).toBe(true);
  });`, sel: "details.details",
  },
  expander: {
    tag: "div", keyboard: "Tab to the trigger, Enter or Space to expand and collapse",
    aria: "aria-expanded on the [data-trigger]; the [data-content] is hidden while collapsed",
    markup: `<div class="expander" x-data="lilyCollapsible(false)" x-bind="root" role="group" aria-label="">
  <button data-trigger x-bind="trigger" aria-controls="expander-content-1"><!-- Consumer provides trigger label --></button>
  <div data-content id="expander-content-1" x-bind="content"><!-- Consumer provides content --></div>
</div>`,
    test: `
  it("expands and collapses", async () => {
    await mount("expander");
    const t = document.querySelector("[data-trigger]"), c = document.querySelector("[data-content]");
    expect(t.getAttribute("aria-expanded")).toBe("false");
    expect(c.hidden).toBe(true);
    t.click(); await tick();
    expect(t.getAttribute("aria-expanded")).toBe("true");
    expect(c.hidden).toBe(false);
    expect(el().getAttribute("data-expanded")).toBe("true");
  });`, sel: "div.expander",
  },
  "government-banner": {
    tag: "aside", keyboard: "Tab to the toggle, Enter or Space to show and hide the details",
    aria: "aria-expanded and aria-controls on the toggle; details hidden while collapsed",
    markup: `<aside class="government-banner" x-data="lilyCollapsible(false)" x-bind="root" aria-label="">
  <header class="government-banner-header">
    <span class="government-banner-text"><!-- Consumer provides header text --></span>
    <button class="government-banner-toggle" x-bind="trigger" aria-controls="government-banner-panel-1">
      <!-- Consumer provides the toggle label -->
    </button>
  </header>
  <div class="government-banner-details" id="government-banner-panel-1" x-bind="content">
    <!-- Consumer provides details panel content -->
  </div>
</aside>`,
    test: `
  it("shows the details only when the toggle is expanded", async () => {
    await mount("government-banner");
    const t = document.querySelector(".government-banner-toggle"), d = document.querySelector(".government-banner-details");
    expect(t.getAttribute("aria-controls")).toBe(d.id);
    expect(d.hidden).toBe(true);
    t.click(); await tick();
    expect(t.getAttribute("aria-expanded")).toBe("true");
    expect(d.hidden).toBe(false);
  });`, sel: "aside.government-banner",
  },
  "contextual-help": {
    tag: "div", keyboard: "Tab to the trigger, Enter or Space to open, Escape to close",
    aria: 'aria-haspopup="dialog", aria-expanded and aria-controls on the trigger; the panel is role="dialog"',
    markup: `<div class="contextual-help" x-data="lilyPopover(false)" x-bind="root">
  <button class="contextual-help-trigger" x-bind="trigger" aria-label="" aria-controls="contextual-help-panel-1">?</button>
  <div class="contextual-help-panel" id="contextual-help-panel-1" role="dialog" aria-label="" x-bind="panel">
    <!-- Consumer provides popover content -->
  </div>
</div>`,
    test: `
  it("opens, and Escape closes it and returns focus", async () => {
    await mount("contextual-help");
    const t = document.querySelector(".contextual-help-trigger"), p = document.querySelector(".contextual-help-panel");
    expect(p.hidden).toBe(true);
    t.click(); await tick();
    expect(t.getAttribute("aria-expanded")).toBe("true");
    expect(p.hidden).toBe(false);
    p.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(p.hidden).toBe(true);
    expect(document.activeElement).toBe(t);
  });`, sel: "div.contextual-help",
  },
  "medical-banner": {
    tag: "div", keyboard: "Tab to the dismiss button, Enter or Space to dismiss",
    aria: 'role="region" with aria-live="polite" and aria-label; data-type and data-context are for CSS',
    markup: `<div class="medical-banner" role="region" aria-live="polite" aria-label="" data-type="info" data-context="medical"
     x-data="lilyDismissible(true)" x-bind="root">
  <!-- Consumer provides content -->
  <button data-dismiss x-bind="dismiss" aria-label=""><!-- Consumer provides label --></button>
</div>`,
    test: `
  it("hides itself and emits close when dismissed", async () => {
    await mount("medical-banner");
    const closed = vi.fn();
    el().addEventListener("close", closed);
    expect(el().hidden).toBe(false);
    document.querySelector("[data-dismiss]").click(); await tick();
    expect(el().hidden).toBe(true);
    expect(closed).toHaveBeenCalledTimes(1);
  });`, sel: "div.medical-banner",
  },
  "sticky-promo-banner": {
    tag: "aside", keyboard: "Tab to the dismiss button, Enter or Space to dismiss",
    aria: 'role="complementary" with aria-label; position (fixed) is consumer CSS driven by data-position',
    markup: `<aside class="sticky-promo-banner" role="complementary" aria-label="" data-position="bottom"
       x-data="lilyDismissible(true)" x-bind="root">
  <div class="sticky-promo-banner-content">
    <!-- Consumer provides banner content -->
  </div>
  <button class="sticky-promo-banner-dismiss" x-bind="dismiss" aria-label=""><!-- Consumer provides label --></button>
</aside>`,
    test: `
  it("carries no inline style (position is consumer CSS)", async () => {
    await mount("sticky-promo-banner");
    expect(el().hasAttribute("style")).toBe(false);
    expect(el().getAttribute("data-position")).toBe("bottom");
  });
  it("hides when dismissed", async () => {
    await mount("sticky-promo-banner");
    document.querySelector(".sticky-promo-banner-dismiss").click(); await tick();
    expect(el().hidden).toBe(true);
  });`, sel: "aside.sticky-promo-banner",
  },
  "hover-card": {
    tag: "div", keyboard: "Focus the trigger to show, Escape to dismiss",
    aria: 'role="group" with aria-label; opens on pointer hover or focus within, stays open while hovered (WCAG 1.4.13)',
    markup: `<div class="hover-card" role="group" aria-label="" x-data="lilyHoverCard()" x-bind="root">
  <a class="hover-card-trigger" href=""><!-- Consumer provides trigger --></a>
  <div class="hover-card-content" x-bind="card"><!-- Consumer provides content --></div>
</div>`,
    test: `
  it("opens on hover and closes on leave", async () => {
    await mount("hover-card");
    const c = document.querySelector(".hover-card-content");
    expect(c.hidden).toBe(true);
    el().dispatchEvent(new MouseEvent("mouseenter")); await tick();
    expect(c.hidden).toBe(false);
    expect(el().getAttribute("data-open")).toBe("true");
    el().dispatchEvent(new MouseEvent("mouseleave")); await tick();
    expect(c.hidden).toBe(true);
  });
  it("opens on focus within and Escape dismisses", async () => {
    await mount("hover-card");
    const c = document.querySelector(".hover-card-content");
    el().dispatchEvent(new FocusEvent("focusin", { bubbles: true })); await tick();
    expect(c.hidden).toBe(false);
    el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); await tick();
    expect(c.hidden).toBe(true);
  });`, sel: "div.hover-card",
  },
  "accordion-checkbox": {
    tag: "div", keyboard: "Tab to the checkbox, Space to expand and collapse",
    aria: "a real checkbox with aria-expanded and aria-controls; the panel is a labelled region",
    markup: `<div class="accordion-checkbox" x-data="lilyCheckboxAccordion(false)">
  <input class="accordion-checkbox-input" type="checkbox" id="accordion-checkbox-1" x-bind="input" aria-controls="accordion-checkbox-1-panel">
  <label class="accordion-checkbox-label" for="accordion-checkbox-1"><!-- Consumer provides label --></label>
  <div class="accordion-checkbox-panel" id="accordion-checkbox-1-panel" role="region" aria-labelledby="accordion-checkbox-1" x-bind="panel">
    <!-- Consumer provides revealable panel content -->
  </div>
</div>`,
    test: `
  it("is a real checkbox controlling a hidden region", async () => {
    await mount("accordion-checkbox");
    const i = document.querySelector(".accordion-checkbox-input"), p = document.querySelector(".accordion-checkbox-panel");
    expect(i.type).toBe("checkbox");
    expect(i.getAttribute("aria-expanded")).toBe("false");
    expect(p.hidden).toBe(true);
    i.click(); await tick();
    expect(i.checked).toBe(true);
    expect(i.getAttribute("aria-expanded")).toBe("true");
    expect(p.hidden).toBe(false);
    i.click(); await tick();
    expect(p.hidden).toBe(true);
  });`, sel: "div.accordion-checkbox",
  },
  "accordion-nav": {
    tag: "nav", keyboard: "Tab between triggers, Enter or Space to expand and collapse",
    aria: "each trigger has aria-expanded and aria-controls; each panel is a region labelled by its trigger",
    markup: `<nav class="accordion-nav" aria-label="" x-data="lilyAccordion(false)">
  <ol class="accordion-list">
    <li class="accordion-list-item">
      <button class="accordion-trigger" x-bind="trigger('one')"><!-- Consumer provides heading --></button>
      <div class="accordion-panel" x-bind="panel('one')"><!-- Consumer provides content --></div>
    </li>
    <li class="accordion-list-item">
      <button class="accordion-trigger" x-bind="trigger('two')"><!-- Consumer provides heading --></button>
      <div class="accordion-panel" x-bind="panel('two')"><!-- Consumer provides content --></div>
    </li>
  </ol>
</nav>`,
    test: `
  const triggers = () => [...document.querySelectorAll(".accordion-trigger")];
  const panels = () => [...document.querySelectorAll(".accordion-panel")];
  it("starts with every panel collapsed, linked both ways", async () => {
    await mount("accordion-nav");
    expect(panels().map((p) => p.hidden)).toEqual([true, true]);
    expect(triggers()[0].getAttribute("aria-controls")).toBe(panels()[0].id);
    expect(panels()[0].getAttribute("aria-labelledby")).toBe(triggers()[0].id);
  });
  it("opens one panel at a time", async () => {
    await mount("accordion-nav");
    triggers()[0].click(); await tick();
    expect(panels().map((p) => p.hidden)).toEqual([false, true]);
    triggers()[1].click(); await tick();
    expect(panels().map((p) => p.hidden)).toEqual([true, false]);
    triggers()[1].click(); await tick();
    expect(panels().map((p) => p.hidden)).toEqual([true, true]);
  });`, sel: "nav.accordion-nav",
  },
};
