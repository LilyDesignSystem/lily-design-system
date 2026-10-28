import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SummaryList";

describe("SummaryList", () => {
    test("renders a dl element", () => {
        render(<Subject label="Summary">Content</Subject>);

        const el = screen.getByLabelText("Summary");
        expect(el.tagName).toBe("DL");
    });

    test("has aria-label from label prop", () => {
        render(<Subject label="Summary">Content</Subject>);

        const el = screen.getByLabelText("Summary");
        expect(el.getAttribute("aria-label")).toBe("Summary");
    });

    test("renders children content", () => {
        render(<Subject label="Summary">Item details</Subject>);

        const el = screen.getByLabelText("Summary");
        expect(el.textContent).toContain("Item details");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject
                label="Summary"
                data-testid="summary-list"
            >
                Content
            </Subject>,
        );

        expect(screen.getByTestId("summary-list")).toBeTruthy();
    });

    test("accepts id attribute", () => {
        render(
            <Subject
                label="Summary"
                id="my-summary"
            >
                Content
            </Subject>,
        );

        const el = screen.getByLabelText("Summary");
        expect(el.getAttribute("id")).toBe("my-summary");
    });
});
