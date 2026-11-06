import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const labels = { dateLabel: "Fecha", timeLabel: "Hora", nowLabel: "Ahora" };

describe("date-time-now-input", () => {
    it("renders date, time, and now button", () => {
        const { document } = render("date-time-now-input", {
            id: "dt",
            name: "dt",
            date: "2026-04-20",
            time: "09:30",
            ...labels,
        });
        expect(document.querySelector(".date-time-now-input-date").getAttribute("value")).toBe(
            "2026-04-20",
        );
        expect(document.querySelector(".date-time-now-input-time").getAttribute("value")).toBe(
            "09:30",
        );
        expect(document.querySelector(".date-time-now-input-now").textContent.trim()).toBe("Ahora");
    });

    it("is a group named by label", () => {
        const { document } = render("date-time-now-input", { label: "Cita", ...labels });
        const root = document.querySelector("div.date-time-now-input");
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Cita");
    });

    it("names the date input, time input and Now button from its params", () => {
        const { document } = render("date-time-now-input", { label: "Cita", ...labels });
        expect(document.querySelector(".date-time-now-input-date").getAttribute("aria-label")).toBe(
            "Fecha",
        );
        expect(document.querySelector(".date-time-now-input-time").getAttribute("aria-label")).toBe(
            "Hora",
        );
        expect(document.querySelector(".date-time-now-input-now").getAttribute("aria-label")).toBe(
            "Ahora",
        );
    });

    it("has no English default: without labels the controls carry no name or text", () => {
        const { document } = render("date-time-now-input", {});
        const root = document.querySelector("div.date-time-now-input");
        for (const el of root.querySelectorAll("input, button"))
            expect(el.hasAttribute("aria-label")).toBe(false);
        expect(root.hasAttribute("aria-label")).toBe(false);
        expect(root.textContent.trim()).toBe("");
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("date-time-now-input", {});
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("names each input from its label", () => {
        const { document } = render("date-time-now-input", { id: "a", dateLabel: "Date", timeLabel: "Time" });
        expect(document.querySelector("input[type=date]").getAttribute("aria-label")).toBe("Date");
        expect(document.querySelector("input[type=time]").getAttribute("aria-label")).toBe("Time");
    });
});
