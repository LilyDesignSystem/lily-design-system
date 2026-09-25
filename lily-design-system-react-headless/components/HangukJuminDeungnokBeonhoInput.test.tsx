import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./HangukJuminDeungnokBeonhoInput";

describe("HangukJuminDeungnokBeonhoInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" />);

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" />);

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)");
        expect(input.getAttribute("class")).toContain("hanguk-jumin-deungnok-beonho-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" />);

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" />);

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" required />);

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" />);

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" disabled />);

        const input = screen.getByLabelText("Resident Registration Number (주민등록번호)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
