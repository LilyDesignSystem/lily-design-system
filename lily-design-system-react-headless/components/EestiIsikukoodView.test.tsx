import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EestiIsikukoodView";

describe("EestiIsikukoodView", () => {
    test("renders with the correct class", () => {
        render(<Subject label="Personal Identification Code" value="test-value" />);

        const el = screen.getByLabelText("Personal Identification Code");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("eesti-isikukood-view");
    });

    test("renders the value as text content", () => {
        render(<Subject label="Personal Identification Code" value="test-value" />);

        const el = screen.getByLabelText("Personal Identification Code");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Personal Identification Code" />);

        const el = screen.getByLabelText("Personal Identification Code");
        expect(el.getAttribute("aria-label")).toBe("Personal Identification Code");
    });
});
