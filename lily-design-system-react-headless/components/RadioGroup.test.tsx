import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RadioGroup";

const radioButtons = (
    <>
        <label>
            <input
                type="radio"
                name="size"
                value="s"
            />{" "}
            Small
        </label>
        <label>
            <input
                type="radio"
                name="size"
                value="m"
            />{" "}
            Medium
        </label>
    </>
);

describe("RadioGroup", () => {
    test("renders a radiogroup", () => {
        render(<Subject label="Size">{radioButtons}</Subject>);
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Size">{radioButtons}</Subject>);
        expect(screen.getByLabelText("Size")).toBeTruthy();
    });

    test("renders radio children", () => {
        render(<Subject label="Size">{radioButtons}</Subject>);
        expect(screen.getAllByRole("radio").length).toBe(2);
    });

    test("uses fieldset element", () => {
        render(<Subject label="Size">{radioButtons}</Subject>);
        expect(screen.getByRole("radiogroup").tagName).toBe("FIELDSET");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="rg"
            >
                {radioButtons}
            </Subject>,
        );
        expect(screen.getByTestId("rg")).toBeTruthy();
    });
});
