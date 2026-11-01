// contextual-help.test.js
// ContextualHelp component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.contextual-help");

describe("ContextualHelp", () => {
    it("renders the element with its base class", async () => {
        await mount("contextual-help");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("contextual-help")).toBe(true);
    });

    it("opens, and Escape closes it and returns focus", async () => {
        await mount("contextual-help");
        const t = document.querySelector(".contextual-help-trigger"),
            p = document.querySelector(".contextual-help-panel");
        expect(p.hidden).toBe(true);
        t.click();
        await tick();
        expect(t.getAttribute("aria-expanded")).toBe("true");
        expect(p.hidden).toBe(false);
        p.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await tick();
        expect(p.hidden).toBe(true);
        expect(document.activeElement).toBe(t);
    });

    it("names the panel for the browser: command/commandfor and popovertarget", async () => {
        await mount("contextual-help");
        const t = document.querySelector(".contextual-help-trigger"),
            p = document.querySelector(".contextual-help-panel");
        expect(t.getAttribute("command")).toBe("toggle-popover");
        expect(t.getAttribute("commandfor")).toBe(p.id);
        expect(t.getAttribute("popovertarget")).toBe(p.id);
    });

    describe("with the Popover API", () => {
        const proto = HTMLElement.prototype;
        afterEach(() => {
            delete proto.showPopover;
            delete proto.hidePopover;
        });

        it("is popover=auto, leaves the click to the browser and follows the toggle event", async () => {
            proto.showPopover = vi.fn();
            proto.hidePopover = vi.fn();
            await mount("contextual-help");
            const t = document.querySelector(".contextual-help-trigger"),
                p = document.querySelector(".contextual-help-panel");
            expect(p.getAttribute("popover")).toBe("auto");
            expect(p.hidden).toBe(false);
            t.click();
            await tick();
            expect(t.getAttribute("aria-expanded")).toBe("false");
            const opened = new Event("toggle");
            Object.assign(opened, { newState: "open", oldState: "closed" });
            p.dispatchEvent(opened);
            await tick();
            expect(t.getAttribute("aria-expanded")).toBe("true");
            const closed = new Event("toggle");
            Object.assign(closed, { newState: "closed", oldState: "open" });
            p.dispatchEvent(closed);
            await tick();
            expect(t.getAttribute("aria-expanded")).toBe("false");
        });
    });
});
