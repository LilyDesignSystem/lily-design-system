import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CheckboxGroup";

const checkboxes = (
    <>
        <label>
            <input
                type="checkbox"
                name="features"
                value="wifi"
            />{" "}
            Wi-Fi
        </label>
        <label>
            <input
                type="checkbox"
                name="features"
                value="bluetooth"
            />{" "}
            Bluetooth
        </label>
    </>
);

describe("CheckboxGroup", () => {
    test("renders a group", () => {
        render(<Subject label="Features">{checkboxes}</Subject>);
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Features">{checkboxes}</Subject>);
        expect(screen.getByLabelText("Features")).toBeTruthy();
    });

    test("renders checkbox children", () => {
        render(<Subject label="Features">{checkboxes}</Subject>);
        expect(screen.getAllByRole("checkbox").length).toBe(2);
    });

    test("uses fieldset element", () => {
        render(<Subject label="Features">{checkboxes}</Subject>);
        expect(screen.getByRole("group").tagName).toBe("FIELDSET");
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Features"
                disabled
            >
                {checkboxes}
            </Subject>,
        );
        expect((screen.getByRole("group") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="F"
                data-testid="cg"
            >
                {checkboxes}
            </Subject>,
        );
        expect(screen.getByTestId("cg")).toBeTruthy();
    });
});
