// popup.test.js
// Popup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.popup");

describe("Popup", () => {
    it("renders the element with its base class", async () => {
        await mount("popup");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("popup")).toBe(true);
    });

    const trigger = () => document.querySelector(".popup-trigger");
    it("is closed, with the dialog role", async () => {
        await mount("popup");
        expect(el().hidden).toBe(true);
        expect(el().getAttribute("role")).toBe("dialog");
        expect(el().hasAttribute("aria-modal")).toBe(false);
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
    });
    it("opens, moves focus in, and the close button returns focus to the trigger", async () => {
        await mount("popup");
        trigger().focus();
        trigger().click();
        await tick();
        await tick();
        expect(el().hidden).toBe(false);
        expect(el().getAttribute("data-open")).toBe("true");
        expect(el().contains(document.activeElement)).toBe(true);
        document.querySelector(".popup-close").click();
        await tick();
        expect(el().hidden).toBe(true);
        expect(document.activeElement).toBe(trigger());
    });
    it("closes on Escape", async () => {
        await mount("popup");
        trigger().click();
        await tick();
        await tick();
        el().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await tick();
        expect(el().hidden).toBe(true);
        expect(document.activeElement).toBe(trigger());
    });

    it("names the panel for the browser: command/commandfor and popovertarget", async () => {
        await mount("popup");
        const t = document.querySelector(".popup-trigger"),
            p = document.querySelector(".popup");
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
            await mount("popup");
            const t = document.querySelector(".popup-trigger"),
                p = document.querySelector(".popup");
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
