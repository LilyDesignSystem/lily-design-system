import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TextInput";

describe("TextInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Name" />);
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has aria-label", () => {
        render(<Subject label="Full name" />);
        expect(screen.getByLabelText("Full name")).toBeTruthy();
    });

    test("supports required", () => {
        render(
            <Subject
                label="Name"
                required
            />,
        );
        expect((screen.getByLabelText("Name") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Name"
                disabled
            />,
        );
        expect((screen.getByLabelText("Name") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Name"
                data-testid="ti"
            />,
        );
        expect(screen.getByTestId("ti")).toBeTruthy();
    });
});
