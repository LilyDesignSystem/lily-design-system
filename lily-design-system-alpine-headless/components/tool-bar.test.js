// tool-bar.test.js
// ToolBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tool-bar");
const press = async (target, key, init = {}) => {
    target.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
    );
    await tick();
};
const fill = () => {
    el().innerHTML =
        '<button>Bold</button><button disabled>Italic</button><button>Link</button><span role="button" tabindex="0">More</span>';
};
const focused = () => document.activeElement.textContent;

describe("ToolBar", () => {
    it("renders the element with its base class", async () => {
        await mount("tool-bar");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("tool-bar")).toBe(true);
    });

    it('is role="toolbar" with an accessible name', async () => {
        await mount("tool-bar");
        expect(el().getAttribute("role")).toBe("toolbar");
        expect(el().hasAttribute("aria-label")).toBe(true);
    });
    it("ArrowRight moves to the next item, skips disabled buttons and wraps", async () => {
        await mount("tool-bar");
        fill();
        el().querySelector("button").focus();
        await press(document.activeElement, "ArrowRight");
        expect(focused()).toBe("Link");
        await press(document.activeElement, "ArrowRight");
        expect(focused()).toBe("More");
        await press(document.activeElement, "ArrowRight");
        expect(focused()).toBe("Bold");
    });
    it("ArrowLeft moves to the previous item and wraps", async () => {
        await mount("tool-bar");
        fill();
        el().querySelector("button").focus();
        await press(document.activeElement, "ArrowLeft");
        expect(focused()).toBe("More");
        await press(document.activeElement, "ArrowLeft");
        expect(focused()).toBe("Link");
    });
    it("Home and End jump; the keys it handles are cancelled, others are not", async () => {
        await mount("tool-bar");
        fill();
        el().querySelector("button").focus();
        await press(document.activeElement, "End");
        expect(focused()).toBe("More");
        await press(document.activeElement, "Home");
        expect(focused()).toBe("Bold");
        const prevented = ["ArrowRight", "ArrowDown", "Tab"].map((key) => {
            const e = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
            document.activeElement.dispatchEvent(e);
            return e.defaultPrevented;
        });
        expect(prevented).toEqual([true, false, false]);
    });
});
