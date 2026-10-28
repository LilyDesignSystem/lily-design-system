import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PasswordInput";

describe("PasswordInput", () => {
    test("renders a password input", () => {
        render(<Subject label="Password" />);
        const input = screen.getByLabelText("Password") as HTMLInputElement;
        expect(input.type).toBe("password");
    });

    test("has aria-label", () => {
        render(<Subject label="Password" />);
        expect(screen.getByLabelText("Password")).toBeTruthy();
    });

    test("has autocomplete current-password by default", () => {
        render(<Subject label="Password" />);
        expect(screen.getByLabelText("Password").getAttribute("autocomplete")).toBe(
            "current-password",
        );
    });

    test("supports custom autocomplete", () => {
        render(
            <Subject
                label="Password"
                autocomplete="new-password"
            />,
        );
        expect(screen.getByLabelText("Password").getAttribute("autocomplete")).toBe("new-password");
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Password"
                disabled
            />,
        );
        expect((screen.getByLabelText("Password") as HTMLInputElement).disabled).toBe(true);
    });

    test("supports required", () => {
        render(
            <Subject
                label="Password"
                required
            />,
        );
        expect((screen.getByLabelText("Password") as HTMLInputElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Password"
                data-testid="pi"
            />,
        );
        expect(screen.getByTestId("pi")).toBeTruthy();
    });
});
