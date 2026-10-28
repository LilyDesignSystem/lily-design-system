import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/SummaryList.vue";

describe("SummaryList", () => {
    test("renders a dl element", () => {
        render(Subject, { props: { label: "Summary" }, slots: { default: "Content" } });

        const el = screen.getByLabelText("Summary");
        expect(el.tagName).toBe("DL");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Summary" }, slots: { default: "Content" } });

        const el = screen.getByLabelText("Summary");
        expect(el.getAttribute("aria-label")).toBe("Summary");
    });

    test("renders children content", () => {
        render(Subject, { props: { label: "Summary" }, slots: { default: "Item details" } });

        const el = screen.getByLabelText("Summary");
        expect(el.textContent).toContain("Item details");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { label: "Summary", "data-testid": "summary-list" },
            slots: { default: "Content" },
        });

        expect(screen.getByTestId("summary-list")).toBeTruthy();
    });

    test("accepts id attribute", () => {
        render(Subject, {
            props: { label: "Summary", id: "my-summary" },
            slots: { default: "Content" },
        });

        const el = screen.getByLabelText("Summary");
        expect(el.getAttribute("id")).toBe("my-summary");
    });
});
