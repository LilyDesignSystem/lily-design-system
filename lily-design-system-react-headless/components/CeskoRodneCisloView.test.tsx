import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CeskoRodneCisloView";

describe("CeskoRodneCisloView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Czech Personal Number" value="test-value" />);

        const el = screen.getByLabelText("Czech Personal Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("cesko-rodne-cislo-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Czech Personal Number" value="test-value" />);

        const el = screen.getByLabelText("Czech Personal Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Czech Personal Number" />);

        const el = screen.getByLabelText("Czech Personal Number");
        expect(el.getAttribute("aria-label")).toBe("Czech Personal Number");
    });
});
