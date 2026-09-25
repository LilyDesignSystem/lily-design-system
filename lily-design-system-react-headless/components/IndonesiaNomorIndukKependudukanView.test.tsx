import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./IndonesiaNomorIndukKependudukanView";

describe("IndonesiaNomorIndukKependudukanView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" value="test-value" />);

        const el = screen.getByLabelText("Nomor Induk Kependudukan (NIK)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("indonesia-nomor-induk-kependudukan-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" value="test-value" />);

        const el = screen.getByLabelText("Nomor Induk Kependudukan (NIK)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Nomor Induk Kependudukan (NIK)" />);

        const el = screen.getByLabelText("Nomor Induk Kependudukan (NIK)");
        expect(el.getAttribute("aria-label")).toBe("Nomor Induk Kependudukan (NIK)");
    });
});
