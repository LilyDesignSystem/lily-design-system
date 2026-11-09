import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("dial", () => {
    it("renders a <div role=slider> with its value, as Svelte", () => {
        const { document } = render("dial", { id: "d", value: 50, label: "Volume" });
        const el = document.querySelector("div.dial");
        expect(el.getAttribute("role")).toBe("slider");
        expect(el.getAttribute("tabindex")).toBe("0");
        expect(el.getAttribute("aria-label")).toBe("Volume");
        expect([
            el.getAttribute("aria-valuenow"),
            el.getAttribute("aria-valuemin"),
            el.getAttribute("aria-valuemax"),
        ]).toEqual(["50", "0", "100"]);
    });

    it("takes part in a form through a hidden input when named", () => {
        const { document } = render("dial", { name: "vol", value: 20, label: "Volume" });
        expect(document.querySelector('.dial input[type="hidden"]').getAttribute("name")).toBe(
            "vol",
        );
    });

    it("is out of the tab order and aria-disabled when disabled", () => {
        const el = render("dial", { label: "Volume", disabled: true }).document.querySelector(
            ".dial",
        );
        expect(el.getAttribute("tabindex")).toBe("-1");
        expect(el.getAttribute("aria-disabled")).toBe("true");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("dial", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("dial keys", () => {
    it("arrows move one step, Shift ten, Home and End the ends, mirrored to the form", () => {
        const { document } = render("dial", { label: "Volume", value: 50, name: "vol" });
        autoInit(document);
        const dial = document.querySelector(".dial");
        const field = dial.querySelector("input");
        expect(on(dial).press("ArrowRight", { shiftKey: true }).defaultPrevented).toBe(true);
        expect(dial.getAttribute("aria-valuenow")).toBe("60");
        on(dial).press("ArrowDown");
        expect(dial.getAttribute("aria-valuenow")).toBe("59");
        on(dial).press("End");
        expect(dial.getAttribute("aria-valuenow")).toBe("100");
        on(dial).press("Home");
        expect(dial.getAttribute("aria-valuenow")).toBe("0");
        expect(field.value).toBe("0");
        expect(dial.dataset.value).toBe("0");
    });

    it("ignores keys while disabled", () => {
        const { document } = render("dial", { label: "Volume", value: 50, disabled: true });
        autoInit(document);
        const dial = document.querySelector(".dial");
        on(dial).press("ArrowRight");
        expect(dial.getAttribute("aria-valuenow")).toBe("50");
    });
});
