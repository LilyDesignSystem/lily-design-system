import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./HangukJuminDeungnokBeonhoView";

describe("HangukJuminDeungnokBeonhoView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" value="test-value" />);

        const el = screen.getByLabelText("Resident Registration Number (주민등록번호)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hanguk-jumin-deungnok-beonho-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" value="test-value" />);

        const el = screen.getByLabelText("Resident Registration Number (주민등록번호)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Resident Registration Number (주민등록번호)" />);

        const el = screen.getByLabelText("Resident Registration Number (주민등록번호)");
        expect(el.getAttribute("aria-label")).toBe("Resident Registration Number (주민등록번호)");
    });
});
