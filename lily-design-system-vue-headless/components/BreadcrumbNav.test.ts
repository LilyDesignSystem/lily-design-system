import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbNav.vue";

describe("BreadcrumbNav", () => {
    test("renders a navigation landmark", () => {
        render(Subject, { props: { label: "Breadcrumb" }, slots: { default: "trail" } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Breadcrumb" }, slots: { default: "trail" } });
        expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Breadcrumb" }, slots: { default: "Home > About" } });
        expect(screen.getByText("Home > About")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Breadcrumb", "data-testid": "bcn" },
            slots: { default: "x" },
        });
        expect(screen.getByTestId("bcn")).toBeTruthy();
    });
});
