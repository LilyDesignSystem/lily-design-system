import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbList";

describe("BreadcrumbList", () => {
    test("renders an ordered list", () => {
        render(<Subject>items</Subject>);
        expect(screen.getByRole("list").tagName).toBe("OL");
    });

    test("renders children inside the list", () => {
        render(
            <Subject>
                <li>Home</li>
                <li>About</li>
            </Subject>,
        );
        expect(screen.getByText("Home")).toBeTruthy();
        expect(screen.getByText("About")).toBeTruthy();
    });

    test("renders list items", () => {
        render(
            <Subject>
                <li>Home</li>
                <li>About</li>
            </Subject>,
        );
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="bcl">x</Subject>);
        expect(screen.getByTestId("bcl")).toBeTruthy();
    });
});
