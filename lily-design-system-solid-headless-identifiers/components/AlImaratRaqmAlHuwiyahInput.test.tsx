import { render, screen } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import Subject from "./AlImaratRaqmAlHuwiyahInput";

describe("AlImaratRaqmAlHuwiyahInput", () => {
    test("renders a text input", () => {
        render(() => <Subject label="Emirates ID number" />);

        const input = screen.getByLabelText("Emirates ID number") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(() => <Subject label="Emirates ID number" />);

        const input = screen.getByLabelText("Emirates ID number");
        expect(input.getAttribute("class")).toContain("al-imarat-raqm-al-huwiyah-input");
    });

    test("has autocomplete off", () => {
        render(() => <Subject label="Emirates ID number" />);

        const input = screen.getByLabelText("Emirates ID number");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(() => <Subject label="Emirates ID number" />);

        const input = screen.getByLabelText("Emirates ID number") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(() => (
            <Subject
                label="Emirates ID number"
                required
            />
        ));

        const input = screen.getByLabelText("Emirates ID number") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(() => <Subject label="Emirates ID number" />);

        const input = screen.getByLabelText("Emirates ID number") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(() => (
            <Subject
                label="Emirates ID number"
                disabled
            />
        ));

        const input = screen.getByLabelText("Emirates ID number") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(() => (
            <Subject
                label="Emirates ID number"
                data-testid="subject"
            />
        ));

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
