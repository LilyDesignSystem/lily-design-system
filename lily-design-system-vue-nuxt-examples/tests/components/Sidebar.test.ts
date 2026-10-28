import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Sidebar.vue";

describe("Sidebar", () => {
    test("renders an aside", () => {
        render(Subject, {
            props: { label: "Nav", "data-testid": "sb" },
            slots: { default: "content" },
        });
        expect(screen.getByTestId("sb").tagName).toBe("ASIDE");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Navigation" }, slots: { default: "content" } });
        expect(screen.getByLabelText("Navigation")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Nav" }, slots: { default: "Menu" } });
        expect(screen.getByText("Menu")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "sb" }, slots: { default: "x" } });
        expect(screen.getByTestId("sb")).toBeTruthy();
    });
});
