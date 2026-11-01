// The Popover API parts shared by popover, popup and contextual-help (tasks.md P18-T8): the panel is
// popover="auto" and the trigger names it with command/commandfor and popovertarget. Lives under
// families/shared/ so the family loader in generate-components.mjs does not take it for a family.

// The trigger attributes that name the panel for the browser.
export const popoverTriggerAttributes = (id) =>
    ` command="toggle-popover" commandfor="${id}" popovertarget="${id}"`;

// Header lines, written after "Accessibility:".
export const popoverNotes = (part) => [
    `Popover API: the ${part} is popover="auto" and the trigger names it with`,
    `  command="toggle-popover" commandfor (and popovertarget), so it opens, and`,
    `  closes on Escape and on a click outside, even before Alpine starts`,
];

// jsdom has no Popover API, so the tests stub showPopover/hidePopover and drive the toggle event the way a
// browser fires it.
export const popoverTests = (slug, triggerSel, panelSel) => `

  it("names the panel for the browser: command/commandfor and popovertarget", async () => {
    await mount("${slug}");
    const t = document.querySelector("${triggerSel}"), p = document.querySelector("${panelSel}");
    expect(t.getAttribute("command")).toBe("toggle-popover");
    expect(t.getAttribute("commandfor")).toBe(p.id);
    expect(t.getAttribute("popovertarget")).toBe(p.id);
  });

  describe("with the Popover API", () => {
    const proto = HTMLElement.prototype;
    afterEach(() => { delete proto.showPopover; delete proto.hidePopover; });

    it("is popover=auto, leaves the click to the browser and follows the toggle event", async () => {
      proto.showPopover = vi.fn();
      proto.hidePopover = vi.fn();
      await mount("${slug}");
      const t = document.querySelector("${triggerSel}"), p = document.querySelector("${panelSel}");
      expect(p.getAttribute("popover")).toBe("auto");
      expect(p.hidden).toBe(false);
      t.click(); await tick();
      expect(t.getAttribute("aria-expanded")).toBe("false");
      const opened = new Event("toggle");
      Object.assign(opened, { newState: "open", oldState: "closed" });
      p.dispatchEvent(opened); await tick();
      expect(t.getAttribute("aria-expanded")).toBe("true");
      const closed = new Event("toggle");
      Object.assign(closed, { newState: "closed", oldState: "open" });
      p.dispatchEvent(closed); await tick();
      expect(t.getAttribute("aria-expanded")).toBe("false");
    });
  });`;
