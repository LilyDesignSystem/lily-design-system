import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./NumericRatingScalePicker";

const props = {
    label: "How bad is your pain now?",
    minLabel: "No pain",
    maxLabel: "Worst pain imaginable",
};

describe("NumericRatingScalePicker", () => {
    test("is a fieldset named by its legend, with radios from 0 to 10 and described ends", () => {
        render(<Subject {...props} />);
        expect(screen.getByRole("group", { name: "How bad is your pain now?" }).tagName).toBe(
            "FIELDSET",
        );
        expect(screen.getAllByRole("radio")).toHaveLength(11);
        expect(screen.getByRole("radio", { name: "0", description: "No pain" })).toBeTruthy();
        expect(
            screen.getByRole("radio", { name: "10", description: "Worst pain imaginable" }),
        ).toBeTruthy();
    });

    test("arrow keys move and choose, and onChange reports it", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(
            <Subject
                {...props}
                defaultValue="3"
                onChange={onChange}
            />,
        );
        screen.getByRole("radio", { name: "3" }).focus();
        await user.keyboard("{ArrowRight}");
        expect((screen.getByRole("radio", { name: "4" }) as HTMLInputElement).checked).toBe(true);
        expect(onChange).toHaveBeenLastCalledWith("4");
    });

    test("min and max change the range", () => {
        render(
            <Subject
                label="Rate it"
                min={1}
                max={5}
            />,
        );
        expect(screen.getAllByRole("radio").map((r) => (r as HTMLInputElement).value)).toEqual([
            "1",
            "2",
            "3",
            "4",
            "5",
        ]);
    });
});
