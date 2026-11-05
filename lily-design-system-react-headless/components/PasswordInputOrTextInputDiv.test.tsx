import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import type { ComponentType } from "react";
import Component from "./PasswordInputOrTextInputDiv";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as ComponentType<Record<string, unknown>>;

describe("PasswordInputOrTextInputDiv", () => {
    test("renders a password input", () => {
        render(<Subject label="Password" />);
        const input = screen.getByLabelText("Password") as HTMLInputElement;
        expect(input.type).toBe("password");
    });

    test("has toggle button", () => {
        render(
            <Subject
                label="Password"
                toggleLabel="Show password"
            />,
        );
        expect(screen.getByRole("button", { name: "Show password" })).toBeTruthy();
    });

    test("toggle reveals password", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Password" />);
        await user.click(screen.getByRole("button"));
        expect((screen.getByLabelText("Password") as HTMLInputElement).type).toBe("text");
    });

    test("toggle has aria-pressed", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="Password" />);
        const btn = screen.getByRole("button");
        expect(btn.getAttribute("aria-pressed")).toBe("false");
        await user.click(btn);
        expect(btn.getAttribute("aria-pressed")).toBe("true");
    });

    test("hides toggle when showToggle is false", () => {
        render(
            <Subject
                label="Password"
                showToggle={false}
            />,
        );
        expect(screen.queryByRole("button")).toBeNull();
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

    test("has autocomplete", () => {
        render(<Subject label="Password" />);
        expect(screen.getByLabelText("Password").getAttribute("autocomplete")).toBe(
            "current-password",
        );
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="P"
                data-testid="pw"
            />,
        );
        expect(screen.getByTestId("pw")).toBeTruthy();
    });
});
