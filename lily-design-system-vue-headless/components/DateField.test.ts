import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./DateField.vue";

const labels = { dayLabel: "Day", monthLabel: "Month", yearLabel: "Year" };

describe("DateField", () => {
    test("renders a fieldset named by its legend, with three labelled parts", () => {
        const { container } = render(Subject, { props: { label: "Date of birth", ...labels } });
        const fieldset = container.querySelector("fieldset.date-field");
        expect(screen.getByRole("group", { name: "Date of birth" })).toBe(fieldset);
        for (const name of ["Day", "Month", "Year"]) {
            const input = screen.getByLabelText(name) as HTMLInputElement;
            expect(input.type).toBe("text");
            expect(input.getAttribute("inputmode")).toBe("numeric");
        }
    });

    test("puts the parts in ISO 8601 order by default, and in the order asked for", () => {
        const order = (container: Element) =>
            [...container.querySelectorAll("input")].map((input) => input.className);
        const { container, unmount } = render(Subject, { props: { label: "D", ...labels } });
        expect(order(container)).toEqual(["date-field-year", "date-field-month", "date-field-day"]);
        unmount();
        const dmy = render(Subject, { props: { label: "D", ...labels, order: "dmy" } });
        expect(order(dmy.container)).toEqual([
            "date-field-day",
            "date-field-month",
            "date-field-year",
        ]);
    });

    test("fills the parts from v-model, and names them from name", () => {
        render(Subject, {
            props: { label: "D", ...labels, modelValue: "2007-03-27", name: "dob" },
        });
        const day = screen.getByLabelText("Day") as HTMLInputElement;
        expect(day.value).toBe("27");
        expect(day.name).toBe("dob-day");
        expect((screen.getByLabelText("Year") as HTMLInputElement).value).toBe("2007");
    });

    test("emits YYYY-MM-DD once every part is filled, and nothing before", async () => {
        const { emitted } = render(Subject, { props: { label: "D", ...labels } });
        await fireEvent.update(screen.getByLabelText("Day"), "5");
        await fireEvent.update(screen.getByLabelText("Month"), "9");
        expect(emitted()["update:modelValue"]).toBeUndefined();
        await fireEvent.update(screen.getByLabelText("Year"), "1990");
        expect(emitted()["update:modelValue"].at(-1)).toEqual(["1990-09-05"]);
    });

    test("links the description and the error from the fieldset, and marks the parts invalid", () => {
        const { container } = render(Subject, {
            props: {
                label: "D",
                ...labels,
                description: "For example, 27 3 2007",
                error: "Enter a real date",
            },
        });
        const ids = container
            .querySelector("fieldset")!
            .getAttribute("aria-describedby")!
            .split(" ");
        expect(ids.map((id) => document.getElementById(id)?.textContent?.trim())).toEqual([
            "For example, 27 3 2007",
            "Enter a real date",
        ]);
        expect(screen.getByRole("alert").textContent?.trim()).toBe("Enter a real date");
        expect(screen.getByLabelText("Day").getAttribute("aria-invalid")).toBe("true");
    });

    test("autocomplete bday marks the parts for a date of birth", () => {
        render(Subject, { props: { label: "D", ...labels, autocomplete: "bday" } });
        expect(screen.getByLabelText("Month").getAttribute("autocomplete")).toBe("bday-month");
    });

    test("supports required and disabled", () => {
        const { container } = render(Subject, {
            props: { label: "D", ...labels, required: true, disabled: true },
        });
        expect(screen.getByLabelText("Year").hasAttribute("required")).toBe(true);
        expect((container.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "D", ...labels }, attrs: { "data-testid": "df" } });
        expect(screen.getByTestId("df").tagName).toBe("FIELDSET");
    });
});
