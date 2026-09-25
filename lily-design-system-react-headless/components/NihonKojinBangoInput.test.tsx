import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./NihonKojinBangoInput";

describe("NihonKojinBangoInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" />);

        const input = screen.getByLabelText("Individual Number / My Number (マイナンバー)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" />);

        const input = screen.getByLabelText("Individual Number / My Number (マイナンバー)");
        expect(input.getAttribute("class")).toContain("nihon-kojin-bango-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" />);

        const input = screen.getByLabelText("Individual Number / My Number (マイナンバー)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" />);

        const input = screen.getByLabelText("Individual Number / My Number (マイナンバー)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" required />);

        const input = screen.getByLabelText("Individual Number / My Number (マイナンバー)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" />);

        const input = screen.getByLabelText("Individual Number / My Number (マイナンバー)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" disabled />);

        const input = screen.getByLabelText("Individual Number / My Number (マイナンバー)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Individual Number / My Number (マイナンバー)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
