import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Select";

const options = (
    <>
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
    </>
);

describe("Select", () => {
    test("renders a select element", () => {
        render(<Subject label="Choice">{options}</Subject>);
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Country">{options}</Subject>);
        expect(screen.getByLabelText("Country")).toBeTruthy();
    });

    test("renders children options", () => {
        render(<Subject label="C">{options}</Subject>);
        expect(screen.getByText("Alpha")).toBeTruthy();
        expect(screen.getByText("Beta")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="C"
                required
            >
                {options}
            </Subject>,
        );
        expect((screen.getByRole("combobox") as HTMLSelectElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="C"
                disabled
            >
                {options}
            </Subject>,
        );
        expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="C"
                data-testid="sel"
            >
                {options}
            </Subject>,
        );
        expect(screen.getByTestId("sel")).toBeTruthy();
    });
});
