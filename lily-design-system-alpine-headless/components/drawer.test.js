// drawer.test.js
// Drawer component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("dialog.drawer");

// jsdom has no showModal: stub it the way a browser behaves and assert it is what opens the panel. The Tab trap and
// the inert page are the browser's part (see the html-headless wdio tests).
const proto = HTMLDialogElement.prototype;
let showModal;
beforeEach(() => {
    showModal = vi.fn(function () {
        this.setAttribute("open", "");
    });
    proto.showModal = showModal;
    proto.close = vi.fn(function () {
        this.removeAttribute("open");
        this.dispatchEvent(new Event("close"));
    });
});
afterEach(() => {
    delete proto.showModal;
    delete proto.close;
});

describe("Drawer", () => {
    it("renders the element with its base class", async () => {
        await mount("drawer");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("drawer")).toBe(true);
    });

    const trigger = () => document.querySelector(".drawer-trigger");
    it("is a closed modal <dialog>", async () => {
        await mount("drawer");
        expect(el().tagName).toBe("DIALOG");
        expect(el().open).toBe(false);
        expect(el().getAttribute("aria-modal")).toBe("true");
        expect(el().hasAttribute("role")).toBe(false);
        expect(trigger().getAttribute("aria-expanded")).toBe("false");
    });
    it("opens with showModal(), moves focus in, and the close button returns focus to the trigger", async () => {
        await mount("drawer");
        trigger().focus();
        trigger().click();
        await tick();
        await tick();
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(el().open).toBe(true);
        expect(el().getAttribute("data-open")).toBe("true");
        expect(el().contains(document.activeElement)).toBe(true);
        document.querySelector(".drawer-close").click();
        await tick();
        expect(el().open).toBe(false);
        expect(document.activeElement).toBe(trigger());
    });
    it("closes on Escape and returns focus to the trigger", async () => {
        await mount("drawer");
        trigger().focus();
        trigger().click();
        await tick();
        await tick();
        el().dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
        );
        await tick();
        expect(el().open).toBe(false);
        expect(document.activeElement).toBe(trigger());
    });
    it("closes on the native cancel event", async () => {
        await mount("drawer");
        trigger().focus();
        trigger().click();
        await tick();
        await tick();
        el().dispatchEvent(new Event("cancel", { cancelable: true }));
        await tick();
        expect(el().open).toBe(false);
        expect(el().getAttribute("data-open")).toBe("false");
    });
});
