import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Fieldset";

describe("Fieldset", () => {
    test("renders as a group with legend", () => {
        render(<Subject legend="Contact">Fields</Subject>);
        expect(screen.getByRole("group", { name: "Contact" })).toBeTruthy();
    });

    test("displays legend text", () => {
        render(<Subject legend="Address">Fields</Subject>);
        expect(screen.getByText("Address")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(
            <Subject
                legend="Info"
                disabled
                data-testid="fs"
            >
                C
            </Subject>,
        );
        expect((screen.getByTestId("fs") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("renders children", () => {
        render(<Subject legend="G">Child content</Subject>);
        expect(screen.getByRole("group").textContent).toContain("Child content");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                legend="G"
                data-testid="fs"
            >
                C
            </Subject>,
        );
        expect(screen.getByTestId("fs")).toBeTruthy();
    });
});
