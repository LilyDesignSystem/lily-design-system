import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Option";

describe("Option", () => {
    test("renders an option element", () => {
        render(<Subject value="a">Alpha</Subject>);
        expect(screen.getByRole("option")).toBeTruthy();
    });

    test("has the correct value", () => {
        render(<Subject value="us">United States</Subject>);
        expect((screen.getByRole("option") as HTMLOptionElement).value).toBe("us");
    });

    test("renders children text", () => {
        render(<Subject value="uk">United Kingdom</Subject>);
        expect(screen.getByRole("option").textContent).toContain("United Kingdom");
    });

    test("supports selected", () => {
        render(
            <Subject
                value="a"
                selected
            >
                A
            </Subject>,
        );
        expect((screen.getByRole("option") as HTMLOptionElement).selected).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                value="a"
                disabled
            >
                A
            </Subject>,
        );
        expect((screen.getByRole("option") as HTMLOptionElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                value="a"
                data-testid="opt"
            >
                A
            </Subject>,
        );
        expect(screen.getByTestId("opt")).toBeTruthy();
    });
});
