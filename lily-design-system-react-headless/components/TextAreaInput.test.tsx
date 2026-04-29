import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TextAreaInput";

describe("TextAreaInput", () => {
    test("renders a text-area-input", () => {
        render(<Subject label="Comments" />);
        expect(screen.getByRole("textbox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Your comments" />);
        expect(screen.getByLabelText("Your comments")).toBeTruthy();
    });

    test("sets rows attribute", () => {
        render(<Subject label="C" rows={5} data-testid="ta" />);
        expect((screen.getByTestId("ta") as HTMLTextAreaElement).rows).toBe(5);
    });

    test("supports required", () => {
        render(<Subject label="C" required />);
        expect((screen.getByRole("textbox") as HTMLTextAreaElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(<Subject label="C" disabled />);
        expect((screen.getByRole("textbox") as HTMLTextAreaElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(<Subject label="C" data-testid="ta" />);
        expect(screen.getByTestId("ta")).toBeTruthy();
    });
});
