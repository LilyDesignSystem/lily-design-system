import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";
import { autoInit } from "../widget-init.js";
import { on } from "../../test/keys.js";

describe("slider-button", () => {
    it("renders a <button role=slider> with no English label", () => {
        const { document } = render("slider-button", {});
        const el = document.querySelector("button.slider-button");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("slider");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("respects custom labels and disabled", () => {
        const { document } = render("slider-button", {
            label: "Slide to delete",
            confirmedLabel: "Deleted",
            disabled: true,
        });
        const el = document.querySelector("button");
        expect(el.getAttribute("aria-label")).toBe("Slide to delete");
        expect(el.getAttribute("data-confirmed-label")).toBe("Deleted");
        expect(el.disabled).toBe(true);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("slider-button", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

describe("slider-button keys", () => {
    it("slides on the arrows and confirms at the end", () => {
        const { document } = render("slider-button", { label: "Slide to delete" });
        autoInit(document);
        const button = document.querySelector(".slider-button");
        let confirmed = 0;
        button.addEventListener("confirm", () => confirmed++);
        on(button).press("ArrowRight");
        expect(button.getAttribute("aria-valuenow")).toBe("10");
        on(button).press("ArrowLeft");
        expect(button.getAttribute("aria-valuenow")).toBe("0");
        on(button).press("Enter");
        expect(confirmed).toBe(1);
    });
});
