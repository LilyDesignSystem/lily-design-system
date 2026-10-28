import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Subject from "./CalendarRangePicker";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("CalendarRangePicker", () => {
    test("renders application role", () => {
        render(<Subject label="Dates">cal</Subject>);
        expect(screen.getByRole("application")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(<Subject label="Select dates">cal</Subject>);
        expect(screen.getByLabelText("Select dates")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(
            <Subject
                label="D"
                data-testid="crp"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("crp")).toBeTruthy();
    });
});
