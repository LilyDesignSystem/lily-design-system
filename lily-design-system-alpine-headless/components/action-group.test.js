// action-group.test.js
// ActionGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.action-group");

describe("ActionGroup", () => {
    it("renders the element with its base class", async () => {
        await mount("action-group");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("action-group")).toBe(true);
    });

    it('is a role="group"', async () => {
        await mount("action-group");
        expect(el().getAttribute("role")).toBe("group");
    });
    const trigger = () => document.querySelector(".action-group-overflow-trigger");
    const menu = () => document.querySelector(".action-group-overflow-menu");
    const items = () => [...document.querySelectorAll(".action-group-overflow-item")];
    const press = async (target, key, init = {}) => {
        target.dispatchEvent(
            new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
        );
        await tick();
    };
    it('has a menu trigger and a hidden role="menu"', async () => {
        await mount("action-group");
        expect(trigger().getAttribute("aria-haspopup")).toBe("menu");
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
        expect(menu().getAttribute("role")).toBe("menu");
        expect(menu().hidden).toBe(true);
    });
    it("opens on click and focuses the first item", async () => {
        await mount("action-group");
        trigger().click();
        await tick();
        await tick();
        expect(trigger().getAttribute("aria-expanded")).toBe("true");
        expect(menu().hidden).toBe(false);
        expect(document.activeElement).toBe(items()[0]);
    });
    it("opens with ArrowDown on the trigger", async () => {
        await mount("action-group");
        await press(trigger(), "ArrowDown");
        await tick();
        expect(menu().hidden).toBe(false);
    });
    it("arrows wrap, Home/End jump", async () => {
        await mount("action-group");
        trigger().click();
        await tick();
        await tick();
        await press(items()[0], "ArrowUp");
        expect(document.activeElement).toBe(items()[items().length - 1]);
        await press(document.activeElement, "ArrowDown");
        expect(document.activeElement).toBe(items()[0]);
        await press(items()[0], "End");
        expect(document.activeElement).toBe(items()[items().length - 1]);
        await press(document.activeElement, "Home");
        expect(document.activeElement).toBe(items()[0]);
    });
    it("Escape closes and returns focus to the trigger", async () => {
        await mount("action-group");
        trigger().focus();
        trigger().click();
        await tick();
        await tick();
        await press(document.activeElement, "Escape");
        expect(menu().hidden).toBe(true);
        expect(document.activeElement).toBe(trigger());
    });
    it("choosing an item closes the menu", async () => {
        await mount("action-group");
        trigger().focus();
        trigger().click();
        await tick();
        await tick();
        items()[1].click();
        await tick();
        expect(menu().hidden).toBe(true);
        expect(document.activeElement).toBe(trigger());
    });
    it("Tab and an outside click close without stealing focus", async () => {
        await mount("action-group");
        trigger().click();
        await tick();
        await tick();
        await press(document.activeElement, "Tab");
        expect(menu().hidden).toBe(true);
        trigger().click();
        await tick();
        document.body.click();
        await tick();
        expect(menu().hidden).toBe(true);
    });

    it("names the panel for the browser: command/commandfor and popovertarget", async () => {
        await mount("action-group");
        const t = document.querySelector(".action-group-overflow-trigger"),
            p = document.querySelector(".action-group-overflow-menu");
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
            await mount("action-group");
            const t = document.querySelector(".action-group-overflow-trigger"),
                p = document.querySelector(".action-group-overflow-menu");
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
