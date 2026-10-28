import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RedOrangeYellowGreenBluePicker";

describe("RedOrangeYellowGreenBluePicker", () => {
    test("renders a select element", () => {
        render(<Subject label="Status" />);

        expect(screen.getByLabelText("Status").tagName).toBe("SELECT");
    });

    test("has aria-label from label prop", () => {
        render(<Subject label="Status" />);

        const el = screen.getByLabelText("Status");
        expect(el.getAttribute("aria-label")).toBe("Status");
    });

    test("has five options", () => {
        render(<Subject label="Status" />);

        const options = screen.getByLabelText("Status").querySelectorAll("option");
        expect(options.length).toBe(5);
    });

    test("has red option", () => {
        render(<Subject label="Status" />);

        const options = screen.getByLabelText("Status").querySelectorAll("option");
        const values = Array.from(options).map((o) => (o as HTMLOptionElement).value);
        expect(values).toContain("red");
    });

    test("has orange option", () => {
        render(<Subject label="Status" />);

        const options = screen.getByLabelText("Status").querySelectorAll("option");
        const values = Array.from(options).map((o) => (o as HTMLOptionElement).value);
        expect(values).toContain("orange");
    });

    test("has yellow option", () => {
        render(<Subject label="Status" />);

        const options = screen.getByLabelText("Status").querySelectorAll("option");
        const values = Array.from(options).map((o) => (o as HTMLOptionElement).value);
        expect(values).toContain("yellow");
    });

    test("has green option", () => {
        render(<Subject label="Status" />);

        const options = screen.getByLabelText("Status").querySelectorAll("option");
        const values = Array.from(options).map((o) => (o as HTMLOptionElement).value);
        expect(values).toContain("green");
    });

    test("has blue option", () => {
        render(<Subject label="Status" />);

        const options = screen.getByLabelText("Status").querySelectorAll("option");
        const values = Array.from(options).map((o) => (o as HTMLOptionElement).value);
        expect(values).toContain("blue");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="roygb-select"
            />,
        );

        expect(screen.getByTestId("roygb-select")).toBeTruthy();
    });
});
