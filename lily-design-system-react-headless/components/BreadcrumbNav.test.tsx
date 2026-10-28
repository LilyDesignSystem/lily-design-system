import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbNav";

describe("BreadcrumbNav", () => {
    test("renders a navigation landmark", () => {
        render(<Subject label="Breadcrumb">trail</Subject>);
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Breadcrumb">trail</Subject>);
        expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject label="Breadcrumb">Home &gt; About</Subject>);
        expect(screen.getByText("Home > About")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="Breadcrumb"
                data-testid="bcn"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("bcn")).toBeTruthy();
    });
});
