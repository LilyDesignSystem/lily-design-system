import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollBar.vue";

describe("ScrollBar", () => {
    test("renders a scrollbar", () => {
        render(Subject, { props: { label: "Scroll" }, slots: { default: "thumb" } });
        expect(screen.getByRole("scrollbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Page scroll" }, slots: { default: "thumb" } });
        expect(screen.getByLabelText("Page scroll")).toBeTruthy();
    });

    test("defaults to vertical orientation", () => {
        render(Subject, { props: { label: "Scroll" }, slots: { default: "thumb" } });
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("vertical");
    });

    test("supports horizontal orientation", () => {
        render(Subject, {
            props: { label: "Scroll", orientation: "horizontal" },
            slots: { default: "thumb" },
        });
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "sb" }, slots: { default: "x" } });
        expect(screen.getByTestId("sb")).toBeTruthy();
    });
});
