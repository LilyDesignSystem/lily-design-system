import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Input";

describe("Input", () => {
    test("renders a text input", () => {
        render(<Subject label="Name" />);
        expect(screen.getByLabelText("Name")).toBeTruthy();
    });

    test("defaults to text type", () => {
        render(<Subject label="Name" />);
        expect((screen.getByLabelText("Name") as HTMLInputElement).type).toBe("text");
    });

    test("supports custom type", () => {
        render(
            <Subject
                label="Search"
                type="search"
            />,
        );
        expect((screen.getByLabelText("Search") as HTMLInputElement).type).toBe("search");
    });

    test("supports required", () => {
        render(
            <Subject
                label="Name"
                required
            />,
        );
        expect((screen.getByLabelText("Name") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Name"
                disabled
            />,
        );
        expect((screen.getByLabelText("Name") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="N"
                data-testid="inp"
            />,
        );
        expect(screen.getByTestId("inp")).toBeTruthy();
    });
});
