import { describe, it, expect, vi } from "vitest";
import { autoInit } from "../widget-init.js";
import { render } from "../../test/render.js";

describe("text-area-input-with-character-counter", () => {
    it("renders a <textarea> and a counter that is not live itself", () => {
        const { document } = render("text-area-input-with-character-counter", {
            id: "msg",
            name: "msg",
            maximum: 200,
            value: "Hello",
        });
        const ta = document.querySelector(
            "textarea.text-area-input-with-character-counter-textarea",
        );
        expect(ta).toBeTruthy();
        expect(ta.getAttribute("maxlength")).toBe("200");
        expect(ta.textContent).toBe("Hello");
        const out = document.querySelector("span.text-area-input-with-character-counter-counter");
        expect(ta.getAttribute("aria-describedby")).toBe(out.id);
        expect(document.querySelector("[aria-live]")).toBeNull();
        expect(out.querySelector('[aria-hidden="true"]').textContent).toBe("5 / 200");
        expect(out.querySelector('[role="status"]').textContent).toBe("5 / 200");
    });

    it("widget-init keeps the counter up to date, announcing once after the pause", () => {
        const { document } = render("text-area-input-with-character-counter", {
            id: "msg",
            maximum: 10,
            counterTemplate: "{count}/{max}",
        });
        vi.useFakeTimers();
        autoInit(document);
        const ta = document.querySelector("textarea");
        const status = document.querySelector('[role="status"]');
        for (const text of ["a", "ab", "abc"]) {
            ta.value = text;
            ta.dispatchEvent(new document.defaultView.Event("input"));
            vi.advanceTimersByTime(300);
        }
        expect(document.querySelector('[aria-hidden="true"]').textContent).toBe("3/10");
        expect(status.textContent).toBe("0/10");
        vi.advanceTimersByTime(1000);
        expect(status.textContent).toBe("3/10");
        vi.useRealTimers();
    });

    it("fills in the consumer's counterTemplate: no English of its own", () => {
        const { document } = render("text-area-input-with-character-counter", {
            id: "x",
            maximum: 200,
            value: "Hello",
            counterTemplate: "{count} de {max} caractères",
        });
        expect(document.querySelector('[aria-hidden="true"]').textContent).toBe(
            "5 de 200 caractères",
        );
    });

    it("omits the counter when no maximum is given", () => {
        const { document } = render("text-area-input-with-character-counter", { id: "x" });
        expect(
            document.querySelector(".text-area-input-with-character-counter-counter"),
        ).toBeFalsy();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("text-area-input-with-character-counter", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
