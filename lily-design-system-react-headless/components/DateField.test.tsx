import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./DateField";

const labels = { dayLabel: "Day", monthLabel: "Month", yearLabel: "Year" };

describe("DateField", () => {
    test("renders a fieldset named by its legend, with three labelled parts", () => {
        const { container } = render(
            <Subject
                label="Date of birth"
                {...labels}
            />,
        );
        const fieldset = container.querySelector("fieldset.date-field");
        expect(screen.getByRole("group", { name: "Date of birth" })).toBe(fieldset);
        for (const name of ["Day", "Month", "Year"]) {
            const input = screen.getByLabelText(name) as HTMLInputElement;
            expect(input.type).toBe("text");
            expect(input.getAttribute("inputmode")).toBe("numeric");
        }
    });

    test("puts the parts in ISO 8601 order by default, and in the order asked for", () => {
        const order = (container: HTMLElement) =>
            [...container.querySelectorAll("input")].map((input) => input.className);
        const { container, unmount } = render(
            <Subject
                label="D"
                {...labels}
            />,
        );
        expect(order(container)).toEqual(["date-field-year", "date-field-month", "date-field-day"]);
        unmount();
        const mdy = render(
            <Subject
                label="D"
                {...labels}
                order="mdy"
            />,
        );
        expect(order(mdy.container)).toEqual([
            "date-field-month",
            "date-field-day",
            "date-field-year",
        ]);
    });

    test("fills the parts from value, and names them from name", () => {
        render(
            <Subject
                label="D"
                {...labels}
                value="2007-03-27"
                name="dob"
            />,
        );
        const day = screen.getByLabelText("Day") as HTMLInputElement;
        expect(day.value).toBe("27");
        expect(day.name).toBe("dob-day");
        expect((screen.getByLabelText("Year") as HTMLInputElement).value).toBe("2007");
    });

    test('onChange reports YYYY-MM-DD once every part is filled, and "" before', () => {
        const onChange = vi.fn();
        render(
            <Subject
                label="D"
                {...labels}
                onChange={onChange}
            />,
        );
        fireEvent.change(screen.getByLabelText("Day"), { target: { value: "5" } });
        fireEvent.change(screen.getByLabelText("Month"), { target: { value: "9" } });
        expect(onChange).toHaveBeenLastCalledWith("");
        fireEvent.change(screen.getByLabelText("Year"), { target: { value: "1990" } });
        expect(onChange).toHaveBeenLastCalledWith("1990-09-05");
        expect((screen.getByLabelText("Day") as HTMLInputElement).value).toBe("5");
    });

    test("links the description and the error from the fieldset, and marks the parts invalid", () => {
        const { container } = render(
            <Subject
                label="D"
                {...labels}
                description="For example, 27 3 2007"
                error="Enter a real date"
            />,
        );
        const ids = container
            .querySelector("fieldset")!
            .getAttribute("aria-describedby")!
            .split(" ");
        expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual([
            "For example, 27 3 2007",
            "Enter a real date",
        ]);
        expect(screen.getByRole("alert").textContent).toBe("Enter a real date");
        expect(screen.getByLabelText("Day").getAttribute("aria-invalid")).toBe("true");
    });

    test("autocomplete bday marks the parts for a date of birth", () => {
        render(
            <Subject
                label="D"
                {...labels}
                autocomplete="bday"
            />,
        );
        expect(screen.getByLabelText("Month").getAttribute("autocomplete")).toBe("bday-month");
    });

    test("supports required and disabled", () => {
        const { container } = render(
            <Subject
                label="D"
                {...labels}
                required
                disabled
            />,
        );
        expect(screen.getByLabelText("Year").hasAttribute("required")).toBe(true);
        expect((container.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="D"
                {...labels}
                data-testid="df"
            />,
        );
        expect(screen.getByTestId("df").tagName).toBe("FIELDSET");
    });
});
