import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./IndonesiaNomorIndukKependudukanInput";

describe("IndonesiaNomorIndukKependudukanInput", () => {
    test("renders a text input", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" />);

        const input = screen.getByLabelText("Nomor Induk Kependudukan (NIK)") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" />);

        const input = screen.getByLabelText("Nomor Induk Kependudukan (NIK)");
        expect(input.getAttribute("class")).toContain("indonesia-nomor-induk-kependudukan-input");
    });

    test("has autocomplete off", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" />);

        const input = screen.getByLabelText("Nomor Induk Kependudukan (NIK)");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" />);

        const input = screen.getByLabelText("Nomor Induk Kependudukan (NIK)") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" required />);

        const input = screen.getByLabelText("Nomor Induk Kependudukan (NIK)") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" />);

        const input = screen.getByLabelText("Nomor Induk Kependudukan (NIK)") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" disabled />);

        const input = screen.getByLabelText("Nomor Induk Kependudukan (NIK)") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" data-testid="subject" />);

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
