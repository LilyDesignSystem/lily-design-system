import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./CheckList";

describe("CheckList", () => {
    test("renders as a list", () => {
        render(<Subject label="Tasks">Items</Subject>);
        expect(screen.getByRole("list", { name: "Tasks" })).toBeTruthy();
    });

    test("renders children", () => {
        render(<Subject>Task 1</Subject>);
        expect(screen.getByRole("list").textContent).toContain("Task 1");
    });

    test("applies aria-label", () => {
        render(<Subject label="Onboarding">Items</Subject>);
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Onboarding");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject data-testid="cl">Items</Subject>);
        expect(screen.getByTestId("cl")).toBeTruthy();
    });
});
