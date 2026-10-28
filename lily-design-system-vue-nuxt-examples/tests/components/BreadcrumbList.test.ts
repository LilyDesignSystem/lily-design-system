import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/BreadcrumbList.vue";

describe("BreadcrumbList", () => {
    test("renders an ordered list", () => {
        render(Subject, { slots: { default: "items" } });
        expect(screen.getByRole("list").tagName).toBe("OL");
    });

    test("renders children inside the list", () => {
        render(Subject, { slots: { default: "<li>Home</li><li>About</li>" } });
        expect(screen.getByText("Home")).toBeTruthy();
        expect(screen.getByText("About")).toBeTruthy();
    });

    test("renders list items", () => {
        render(Subject, { slots: { default: "<li>Home</li><li>About</li>" } });
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "bcl" }, slots: { default: "x" } });
        expect(screen.getByTestId("bcl")).toBeTruthy();
    });
});
