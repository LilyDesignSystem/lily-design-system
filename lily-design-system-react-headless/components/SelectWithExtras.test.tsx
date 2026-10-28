import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SelectWithExtras";

const options = (
    <>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
    </>
);

describe("SelectWithExtras", () => {
    test("renders a select", () => {
        render(<Subject label="Choose">{options}</Subject>);
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Pick one">{options}</Subject>);
        expect(screen.getByLabelText("Pick one")).toBeTruthy();
    });

    test("renders option children", () => {
        render(<Subject label="Choose">{options}</Subject>);
        expect(screen.getByText("Option A")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="Choose"
                required
            >
                {options}
            </Subject>,
        );
        expect((screen.getByRole("combobox") as HTMLSelectElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="C"
                data-testid="swe"
            >
                {options}
            </Subject>,
        );
        expect(screen.getByTestId("swe")).toBeTruthy();
    });
});
