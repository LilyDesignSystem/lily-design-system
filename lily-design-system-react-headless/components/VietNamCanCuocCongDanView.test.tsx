import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./VietNamCanCuocCongDanView";

describe("VietNamCanCuocCongDanView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Citizen Identification Number (CCCD)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Citizen Identification Number (CCCD)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("viet-nam-can-cuoc-cong-dan-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Citizen Identification Number (CCCD)"
                value="test-value"
            />,
        );

        const el = screen.getByLabelText("Citizen Identification Number (CCCD)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Citizen Identification Number (CCCD)" />);

        const el = screen.getByLabelText("Citizen Identification Number (CCCD)");
        expect(el.getAttribute("aria-label")).toBe("Citizen Identification Number (CCCD)");
    });
});
