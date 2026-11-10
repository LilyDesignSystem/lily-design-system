import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateField } from "./DateField";

const labels = { dayLabel: "Day", monthLabel: "Month", yearLabel: "Year" };

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(DateField);
    for (const [key, value] of Object.entries({ label: "Date of birth", ...labels, ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

const type = (el: HTMLInputElement, value: string) => {
    el.value = value;
    el.dispatchEvent(new Event("input"));
};

const parts = (root: HTMLElement) => [...root.querySelectorAll("input")].map((i) => i.className);

describe("DateField", () => {
    test("renders a fieldset with the base class, named by its legend", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("fieldset.date-field");
        expect(el.classList.contains("extra")).toBe(true);
        expect(el.querySelector("legend").textContent).toBe("Date of birth");
    });

    test("labels each part, and puts them in ISO 8601 order by default", () => {
        const root = make({ id: "dob" }).nativeElement;
        expect(parts(root)).toEqual(["date-field-year", "date-field-month", "date-field-day"]);
        const labelsFor = [...root.querySelectorAll("label")].map((l: Element) => [
            l.getAttribute("for"),
            l.textContent,
        ]);
        expect(labelsFor).toEqual([
            ["dob-year", "Year"],
            ["dob-month", "Month"],
            ["dob-day", "Day"],
        ]);
        expect(root.querySelector("#dob-day").getAttribute("inputmode")).toBe("numeric");
    });

    test("follows the order asked for", () => {
        expect(parts(make({ order: "dmy" }).nativeElement)).toEqual([
            "date-field-day",
            "date-field-month",
            "date-field-year",
        ]);
    });

    test("fills the parts from value, and names them from name", () => {
        const root = make({ value: "2007-03-27", name: "dob" }).nativeElement;
        const day = root.querySelector(".date-field-day") as HTMLInputElement;
        expect(day.value).toBe("27");
        expect(day.name).toBe("dob-day");
        expect((root.querySelector(".date-field-year") as HTMLInputElement).value).toBe("2007");
    });

    test('value is YYYY-MM-DD once every part is filled, and "" before', () => {
        const fixture = make();
        const root = fixture.nativeElement;
        type(root.querySelector(".date-field-day"), "5");
        type(root.querySelector(".date-field-month"), "9");
        expect(fixture.componentInstance.value()).toBe("");
        type(root.querySelector(".date-field-year"), "1990");
        expect(fixture.componentInstance.value()).toBe("1990-09-05");
    });

    test("links the description and the error from the fieldset, and marks the parts invalid", () => {
        const root = make({
            id: "d",
            description: "For example",
            error: "Enter a real date",
        }).nativeElement;
        expect(root.querySelector("fieldset").getAttribute("aria-describedby")).toBe(
            "d-desc d-error",
        );
        expect(root.querySelector("[role=alert]").textContent).toBe("Enter a real date");
        expect(root.querySelector(".date-field-day").getAttribute("aria-invalid")).toBe("true");
    });

    test("autocomplete bday marks the parts for a date of birth", () => {
        const root = make({ autocomplete: "bday" }).nativeElement;
        expect(root.querySelector(".date-field-month").getAttribute("autocomplete")).toBe(
            "bday-month",
        );
    });

    test("supports required and disabled", () => {
        const root = make({ required: true, disabled: true }).nativeElement;
        expect(root.querySelector(".date-field-year").required).toBe(true);
        expect(root.querySelector("fieldset").disabled).toBe(true);
    });

    test("a form reset puts the first value back", async () => {
        const host = document.createElement("form");
        document.body.appendChild(host);
        const fixture = TestBed.createComponent(DateField);
        host.appendChild(fixture.nativeElement);
        for (const [key, value] of Object.entries({ label: "D", ...labels, value: "2001-02-03" }))
            fixture.componentRef.setInput(key, value);
        fixture.detectChanges();
        await fixture.whenStable();
        type(fixture.nativeElement.querySelector(".date-field-day"), "9");
        host.reset();
        await new Promise((resolve) => setTimeout(resolve, 10));
        fixture.detectChanges();
        expect(fixture.componentInstance.value()).toBe("2001-02-03");
        expect(
            (fixture.nativeElement.querySelector(".date-field-day") as HTMLInputElement).value,
        ).toBe("03");
        host.remove();
    });
});
