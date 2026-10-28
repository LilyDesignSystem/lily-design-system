import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TelInput";

describe("TelInput", () => {
    test("renders a tel input", () => {
        render(<Subject label="Phone" />);
        expect((screen.getByLabelText("Phone") as HTMLInputElement).type).toBe("tel");
    });

    test("has autocomplete tel", () => {
        render(<Subject label="Phone" />);
        expect(screen.getByLabelText("Phone").getAttribute("autocomplete")).toBe("tel");
    });

    test("supports required", () => {
        render(
            <Subject
                label="Phone"
                required
            />,
        );
        expect((screen.getByLabelText("Phone") as HTMLInputElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(
            <Subject
                label="Phone"
                disabled
            />,
        );
        expect((screen.getByLabelText("Phone") as HTMLInputElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="P"
                data-testid="ti"
            />,
        );
        expect(screen.getByTestId("ti")).toBeTruthy();
    });
});
