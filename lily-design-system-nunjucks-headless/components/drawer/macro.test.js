import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("drawer", () => {
    it("renders a closed modal <dialog> with its base class", () => {
        const { document } = render("drawer", { label: "X" });
        const el = document.querySelector("dialog.drawer");
        expect(el).toBeTruthy();
        expect(el.getAttribute("aria-label")).toBe("X");
        expect(el.getAttribute("aria-modal")).toBe("true");
        expect(el.getAttribute("tabindex")).toBe("-1");
        expect(el.hasAttribute("hidden")).toBe(false);
        expect(el.hasAttribute("open")).toBe(false);
    });

    // P18-T6: a modal is opened with showModal() by the consumer; an `open` attribute would show it non-modally
    // (while it says aria-modal) and make showModal() throw, so `open` never renders it.
    it("never renders the open attribute, even with open: true", () => {
        const { document } = render("drawer", { label: "X", open: true });
        expect(document.querySelector("dialog").hasAttribute("open")).toBe(false);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("drawer", { label: "X" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("has no English default label (P18-T13)", () => {
        const { document } = render("drawer", {});
        expect(document.querySelector("dialog.drawer").hasAttribute("aria-label")).toBe(false);
    });

    it("exposes side as data-side, default left (P18-T13)", () => {
        expect(
            render("drawer", { label: "X" })
                .document.querySelector("dialog")
                .getAttribute("data-side"),
        ).toBe("left");
        expect(
            render("drawer", { label: "X", side: "bottom" })
                .document.querySelector("dialog")
                .getAttribute("data-side"),
        ).toBe("bottom");
    });
});
