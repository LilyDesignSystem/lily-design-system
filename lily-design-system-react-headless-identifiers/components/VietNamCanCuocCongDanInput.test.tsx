import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./VietNamCanCuocCongDanInput";

describe("VietNamCanCuocCongDanInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Citizen Identification Number (CCCD)" />);

        const input = screen.getByLabelText(
            "Citizen Identification Number (CCCD)",
        ) as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Citizen Identification Number (CCCD)" />);

        const input = screen.getByLabelText("Citizen Identification Number (CCCD)");
        expect(input.getAttribute("class")).toContain("viet-nam-can-cuoc-cong-dan-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Citizen Identification Number (CCCD)" />);

        const input = screen.getByLabelText("Citizen Identification Number (CCCD)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Citizen Identification Number (CCCD)" />);

        const input = screen.getByLabelText(
            "Citizen Identification Number (CCCD)",
        ) as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(
            <Subject
                label="Citizen Identification Number (CCCD)"
                required
            />,
        );

        const input = screen.getByLabelText(
            "Citizen Identification Number (CCCD)",
        ) as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Citizen Identification Number (CCCD)" />);

        const input = screen.getByLabelText(
            "Citizen Identification Number (CCCD)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(
            <Subject
                label="Citizen Identification Number (CCCD)"
                disabled
            />,
        );

        const input = screen.getByLabelText(
            "Citizen Identification Number (CCCD)",
        ) as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Citizen Identification Number (CCCD)"
                data-testid="subject"
            />,
        );

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
