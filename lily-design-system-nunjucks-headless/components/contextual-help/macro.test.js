import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("contextual-help", () => {
    it("renders a wrapping <div> with the base class", () => {
        const { document } = render("contextual-help", {
            label: "Help",
        });
        expect(document.querySelector("div.contextual-help")).toBeTruthy();
    });

    it("renders a trigger button with the correct ARIA wiring", () => {
        const { document } = render("contextual-help", {
            id: "field-help",
            label: "Help",
        });
        const trigger = document.querySelector("button.contextual-help-trigger");
        expect(trigger).toBeTruthy();
        expect(trigger.getAttribute("type")).toBe("button");
        expect(trigger.getAttribute("aria-label")).toBe("Help");
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
        // No static aria-expanded: without script nothing would update it; the browser exposes a
        // popovertarget trigger's expanded state itself.
        expect(trigger.hasAttribute("aria-expanded")).toBe(false);
        expect(trigger.getAttribute("aria-controls")).toBe("field-help");
    });

    it("opens with no script: the trigger names the popover=auto panel", () => {
        const { document } = render("contextual-help", {
            id: "field-help",
            label: "Help",
            triggerLabel: "?",
        });
        const trigger = document.querySelector(".contextual-help-trigger");
        const panel = document.querySelector(".contextual-help-panel");
        expect(panel.getAttribute("popover")).toBe("auto");
        expect(trigger.getAttribute("command")).toBe("toggle-popover");
        expect(trigger.getAttribute("commandfor")).toBe("field-help");
        expect(trigger.getAttribute("popovertarget")).toBe("field-help");
    });

    it("renders triggerLabel as the trigger text, with no default glyph", () => {
        const { document: a } = render("contextual-help", { label: "Help", triggerLabel: "؟" });
        expect(a.querySelector(".contextual-help-trigger").textContent.trim()).toBe("؟");
        const { document: b } = render("contextual-help", { label: "Help" });
        expect(b.querySelector(".contextual-help-trigger").textContent.trim()).toBe("");
        const { document: c } = render("contextual-help", { label: "Help", triggerText: "?" });
        expect(c.querySelector(".contextual-help-trigger").textContent.trim()).toBe("?");
    });

    it("renders aria-expanded='true' when expanded is true", () => {
        const { document } = render("contextual-help", {
            label: "Help",
            expanded: true,
        });
        expect(
            document.querySelector(".contextual-help-trigger").getAttribute("aria-expanded"),
        ).toBe("true");
    });

    it("renders the panel as role=dialog with the matching id", () => {
        const { document } = render("contextual-help", {
            id: "field-help",
            label: "Help",
        });
        const panel = document.querySelector(".contextual-help-panel");
        expect(panel).toBeTruthy();
        expect(panel.getAttribute("role")).toBe("dialog");
        expect(panel.getAttribute("id")).toBe("field-help");
    });

    it("closed by default: a popover the browser hides until the trigger opens it", () => {
        const { document } = render("contextual-help", {
            label: "Help",
        });
        const panel = document.querySelector(".contextual-help-panel");
        expect(panel.getAttribute("popover")).toBe("auto");
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    it("expanded renders the panel shown in place, without popover", () => {
        const { document } = render("contextual-help", {
            label: "Help",
            expanded: true,
        });
        const panel = document.querySelector(".contextual-help-panel");
        expect(panel.hasAttribute("popover")).toBe(false);
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    it("contains no <script> tag", () => {
        const { html } = render("contextual-help", { label: "Help" });
        expect(html).not.toContain("<script");
    });

    it("renders the panel raw html content", () => {
        const { document } = render("contextual-help", {
            label: "Help",
            expanded: true,
            html: "<p>Type your full legal name.</p>",
        });
        expect(document.querySelector(".contextual-help-panel p").textContent).toBe(
            "Type your full legal name.",
        );
    });

    it("appends params.classes", () => {
        const { document } = render("contextual-help", {
            label: "Help",
            classes: "compact",
        });
        expect(document.querySelector("div.contextual-help.compact")).toBeTruthy();
    });

    it("renders params.attributes on the wrapper", () => {
        const { document } = render("contextual-help", {
            label: "Help",
            attributes: { "data-test": "x" },
        });
        expect(document.querySelector("div.contextual-help").getAttribute("data-test")).toBe("x");
    });

    it("contains no <style> tag", () => {
        const { html } = render("contextual-help", { label: "Help" });
        expect(html).not.toContain("<style");
    });

    it("names the dialog as the trigger is named", () => {
        const { document } = render("contextual-help", { label: "Help: name", triggerLabel: "?", id: "h" });
        expect(document.querySelector(".contextual-help-panel").getAttribute("aria-label")).toBe("Help: name");
    });
});
