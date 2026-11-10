import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const labels = { dayLabel: "Day", monthLabel: "Month", yearLabel: "Year" };
const order = (document) => [...document.querySelectorAll("input")].map((i) => i.className);

describe("date-field", () => {
    it("renders a fieldset with a legend and three labelled numeric parts", () => {
        const { document } = render("date-field", { id: "dob", label: "Date of birth", ...labels });
        const fieldset = document.querySelector("fieldset.date-field");
        expect(fieldset.querySelector("legend").textContent).toBe("Date of birth");
        expect(document.querySelector('label[for="dob-day"]').textContent).toBe("Day");
        expect(document.querySelector("#dob-day").getAttribute("inputmode")).toBe("numeric");
    });

    it("puts the parts in ISO 8601 order by default, and in the order asked for", () => {
        expect(order(render("date-field", { label: "D", ...labels }).document)).toEqual([
            "date-field-year",
            "date-field-month",
            "date-field-day",
        ]);
        expect(
            order(render("date-field", { label: "D", ...labels, order: "dmy" }).document),
        ).toEqual(["date-field-day", "date-field-month", "date-field-year"]);
    });

    it("fills the parts from value, or from day, month and year, and names them from name", () => {
        let { document } = render("date-field", {
            label: "D",
            ...labels,
            value: "2007-03-27",
            name: "dob",
        });
        expect(document.querySelector(".date-field-day").getAttribute("value")).toBe("27");
        expect(document.querySelector(".date-field-day").getAttribute("name")).toBe("dob-day");
        ({ document } = render("date-field", {
            label: "D",
            ...labels,
            day: "5",
            month: "9",
            year: "1990",
        }));
        expect(document.querySelector(".date-field-year").getAttribute("value")).toBe("1990");
    });

    it("accepts legend for label, for older calls", () => {
        const { document } = render("date-field", { legend: "Start date", ...labels });
        expect(document.querySelector("legend").textContent).toBe("Start date");
    });

    it("links the description and the error from the fieldset, and marks the parts invalid", () => {
        const { document } = render("date-field", {
            id: "d",
            label: "D",
            ...labels,
            description: "For example, 27 3 2007",
            error: "Enter a real date",
        });
        expect(document.querySelector("fieldset").getAttribute("aria-describedby")).toBe(
            "d-desc d-error",
        );
        expect(document.querySelector("[role=alert]").textContent).toBe("Enter a real date");
        expect(document.querySelector(".date-field-day").getAttribute("aria-invalid")).toBe("true");
    });

    it("has no English of its own", () => {
        const { document } = render("date-field", { label: "D" });
        expect([...document.querySelectorAll("label")].map((l) => l.textContent)).toEqual([
            "",
            "",
            "",
        ]);
    });

    it("autocomplete bday, required and disabled", () => {
        const { document } = render("date-field", {
            label: "D",
            ...labels,
            autocomplete: "bday",
            required: true,
            disabled: true,
        });
        expect(document.querySelector(".date-field-month").getAttribute("autocomplete")).toBe(
            "bday-month",
        );
        expect(document.querySelector(".date-field-year").hasAttribute("required")).toBe(true);
        expect(document.querySelector("fieldset").hasAttribute("disabled")).toBe(true);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("date-field", { label: "D", ...labels });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});
