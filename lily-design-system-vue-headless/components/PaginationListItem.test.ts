import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./PaginationListItem.vue";

describe("PaginationListItem", () => {
    test("renders a list item", () => {
        render(Subject, { props: { "data-testid": "pli" }, slots: { default: "1" } });
        expect(screen.getByTestId("pli").tagName).toBe("LI");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Page 2" } });
        expect(screen.getByText("Page 2")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "item" }, slots: { default: "X" } });
        expect(screen.getByTestId("item")).toBeTruthy();
    });
});
