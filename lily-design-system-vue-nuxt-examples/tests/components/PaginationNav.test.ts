import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/PaginationNav.vue";

describe("PaginationNav", () => {
    test("renders a navigation landmark", () => {
        render(Subject, { props: { label: "Pagination" }, slots: { default: "pages" } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Pagination" }, slots: { default: "pages" } });
        expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy();
    });

    test("renders as a nav element", () => {
        render(Subject, { props: { label: "Pagination" }, slots: { default: "pages" } });
        expect(screen.getByRole("navigation").tagName).toBe("NAV");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Pagination" }, slots: { default: "Page 1 Page 2" } });
        expect(screen.getByText("Page 1 Page 2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Pagination", "data-testid": "pn" },
            slots: { default: "x" },
        });
        expect(screen.getByTestId("pn")).toBeTruthy();
    });
});
