import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Label";

describe("Label", () => {
    test("renders label text", () => {
        render(<Subject>Email</Subject>);
        expect(screen.getByText("Email")).toBeTruthy();
    });

    test("has for attribute", () => {
        render(
            <Subject
                for="email-input"
                data-testid="lbl"
            >
                Email
            </Subject>,
        );
        expect(screen.getByTestId("lbl").getAttribute("for")).toBe("email-input");
    });

    test("renders as label element", () => {
        render(<Subject data-testid="lbl">Name</Subject>);
        expect(screen.getByTestId("lbl").tagName).toBe("LABEL");
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="lbl">X</Subject>);
        expect(screen.getByTestId("lbl")).toBeTruthy();
    });
});
