// popover.test.js
// Popover component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.popover");
const trigger = () => document.querySelector(".popover-trigger");
const panel = () => document.querySelector(".popover-panel");

describe("Popover", () => {
    it("renders the element with its base class", async () => {
        await mount("popover");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("popover")).toBe(true);
    });

    it("starts closed", async () => {
        await mount("popover");
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
        expect(panel().hidden).toBe(true);
    });
    it("opens on click", async () => {
        await mount("popover");
        trigger().click();
        await tick();
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
        expect(panel().hidden).toBe(false);
    });
    it("closes on Escape and returns focus to the trigger", async () => {
        await mount("popover");
        trigger().click();
        await tick();
        panel().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await tick();
        expect(panel().hidden).toBe(true);
        expect(document.activeElement).toBe(trigger());
    });
    it("closes on an outside click", async () => {
        await mount("popover");
        trigger().click();
        await tick();
        document.body.click();
        await tick();
        expect(panel().hidden).toBe(true);
    });

    it("names the panel for the browser: command/commandfor and popovertarget", async () => {
        await mount("popover");
        const t = document.querySelector(".popover-trigger"),
            p = document.querySelector(".popover-panel");
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
            await mount("popover");
            const t = document.querySelector(".popover-trigger"),
                p = document.querySelector(".popover-panel");
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
