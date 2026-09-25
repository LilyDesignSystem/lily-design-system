import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PrathetThaiLekPrajamTuaPrachachonView";

describe("PrathetThaiLekPrajamTuaPrachachonView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="National Identification Number (เลขประจำตัวประชาชน)" value="test-value" />);

        const el = screen.getByLabelText("National Identification Number (เลขประจำตัวประชาชน)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("prathet-thai-lek-prajam-tua-prachachon-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="National Identification Number (เลขประจำตัวประชาชน)" value="test-value" />);

        const el = screen.getByLabelText("National Identification Number (เลขประจำตัวประชาชน)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Identification Number (เลขประจำตัวประชาชน)" />);

        const el = screen.getByLabelText("National Identification Number (เลขประจำตัวประชาชน)");
        expect(el.getAttribute("aria-label")).toBe("National Identification Number (เลขประจำตัวประชาชน)");
    });
});
