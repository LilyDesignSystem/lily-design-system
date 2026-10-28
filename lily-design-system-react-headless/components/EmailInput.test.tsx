import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EmailInput";

describe("EmailInput", () => {
    test("renders an email input", () => {
        render(<Subject label="Email" />);
        const input = screen.getByLabelText("Email") as HTMLInputElement;
        expect(input.type).toBe("email");
    });

    test("has aria-label", () => {
        render(<Subject label="Your email" />);
        expect(screen.getByLabelText("Your email")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="Email"
                required
            />,
        );
        expect((screen.getByLabelText("Email") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Email"
                disabled
            />,
        );
        expect((screen.getByLabelText("Email") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Email"
                data-testid="ei"
            />,
        );
        expect(screen.getByTestId("ei")).toBeTruthy();
    });
});
