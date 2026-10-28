import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ContentsList.vue";

describe("ContentsList", () => {
    test("renders as an ordered list", () => {
        render(Subject, { slots: { default: "Items" } });
        expect(screen.getByRole("list")).toBeTruthy();
        expect(screen.getByRole("list").tagName).toBe("OL");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Section 1" } });
        expect(screen.getByRole("list").textContent).toContain("Section 1");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "cl" }, slots: { default: "Items" } });
        expect(screen.getByTestId("cl")).toBeTruthy();
    });

    test("passes through aria-label", () => {
        render(Subject, { props: { "aria-label": "Sections" }, slots: { default: "Items" } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Sections");
    });
});
