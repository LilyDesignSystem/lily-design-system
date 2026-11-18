import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./MauritiusNationalIdentityCardNumberInput";

describe("MauritiusNationalIdentityCardNumberInput", () => {
    test("renders a text input", () => {
        render(() => <Subject label="National Identity Card number" />);

        const input = screen.getByLabelText("National Identity Card number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(() => <Subject label="National Identity Card number" />);

        const input = screen.getByLabelText("National Identity Card number");
        expect(input.getAttribute("class")).toContain(
            "mauritius-national-identity-card-number-input",
        );
    });

    test("has autocomplete off", () => {
        render(() => <Subject label="National Identity Card number" />);

        const input = screen.getByLabelText("National Identity Card number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(() => <Subject label="National Identity Card number" />);

        const input = screen.getByLabelText("National Identity Card number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(() => (
            <Subject
                label="National Identity Card number"
                required
            />
        ));

        const input = screen.getByLabelText("National Identity Card number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(() => <Subject label="National Identity Card number" />);

        const input = screen.getByLabelText("National Identity Card number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(() => (
            <Subject
                label="National Identity Card number"
                disabled
            />
        ));

        const input = screen.getByLabelText("National Identity Card number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(() => (
            <Subject
                label="National Identity Card number"
                data-testid="subject"
            />
        ));

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
