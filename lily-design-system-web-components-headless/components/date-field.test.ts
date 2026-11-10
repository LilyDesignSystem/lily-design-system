import { afterEach, describe, expect, test } from "vitest";

import { DateField } from "./date-field.js";

if (!customElements.get("lily-date-field")) {
    customElements.define("lily-date-field", DateField);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const LABELS = 'day-label="Day" month-label="Month" year-label="Year"';
const type = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
};
const order = (host: HTMLElement) => [...host.querySelectorAll("input")].map((i) => i.className);

describe("DateField", () => {
    test("builds a fieldset with the base class, named by its legend", () => {
        const host = render(
            `<lily-date-field label="Date of birth" ${LABELS} class="wide"></lily-date-field>`,
        );
        const fieldset = host.querySelector("fieldset")!;
        expect(fieldset.className).toBe("date-field wide");
        expect(fieldset.querySelector("legend")!.textContent).toBe("Date of birth");
    });

    test("labels each part, in ISO 8601 order by default", () => {
        const host = render(`<lily-date-field label="D" ${LABELS} id="dob"></lily-date-field>`);
        expect(host.hasAttribute("id")).toBe(false);
        expect(order(host)).toEqual(["date-field-year", "date-field-month", "date-field-day"]);
        expect(host.querySelector('label[for="dob-day"]')!.textContent).toBe("Day");
        expect(host.querySelector("#dob-day")!.getAttribute("inputmode")).toBe("numeric");
    });

    test("follows the order asked for", () => {
        const host = render(`<lily-date-field label="D" ${LABELS} order="mdy"></lily-date-field>`);
        expect(order(host)).toEqual(["date-field-month", "date-field-day", "date-field-year"]);
    });

    test("fills the parts from value, and names them from name", () => {
        const host = render(
            `<lily-date-field label="D" ${LABELS} value="2007-03-27" name="dob"></lily-date-field>`,
        );
        const day = host.querySelector(".date-field-day") as HTMLInputElement;
        expect(day.value).toBe("27");
        expect(day.name).toBe("dob-day");
        expect((host.querySelector(".date-field-year") as HTMLInputElement).value).toBe("2007");
    });

    test('value is YYYY-MM-DD once every part is filled, and "" before', () => {
        const host = render(`<lily-date-field label="D" ${LABELS}></lily-date-field>`) as DateField;
        type(host.querySelector(".date-field-day")!, "5");
        type(host.querySelector(".date-field-month")!, "9");
        expect(host.value).toBe("");
        type(host.querySelector(".date-field-year")!, "1990");
        expect(host.value).toBe("1990-09-05");
        expect(host.getAttribute("value")).toBe("1990-09-05");
        expect((host.querySelector(".date-field-day") as HTMLInputElement).value).toBe("5");
    });

    test("links the description and the error from the fieldset, and marks the parts invalid", () => {
        const host = render(
            `<lily-date-field label="D" ${LABELS} id="d" description="For example" error="Enter a real date"></lily-date-field>`,
        );
        expect(host.querySelector("fieldset")!.getAttribute("aria-describedby")).toBe(
            "d-desc d-error",
        );
        expect(host.querySelector("[role=alert]")!.textContent).toBe("Enter a real date");
        expect(host.querySelector(".date-field-day")!.getAttribute("aria-invalid")).toBe("true");
        host.removeAttribute("error");
        expect(host.querySelector("fieldset")!.getAttribute("aria-describedby")).toBe("d-desc");
        expect(host.querySelector(".date-field-day")!.hasAttribute("aria-invalid")).toBe(false);
    });

    test("autocomplete bday, required and disabled", () => {
        const host = render(
            `<lily-date-field label="D" ${LABELS} autocomplete="bday" required disabled></lily-date-field>`,
        );
        expect(host.querySelector(".date-field-month")!.getAttribute("autocomplete")).toBe(
            "bday-month",
        );
        expect((host.querySelector(".date-field-year") as HTMLInputElement).required).toBe(true);
        expect((host.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
    });
});
