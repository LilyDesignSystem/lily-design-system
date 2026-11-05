import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type { ComponentType } from "react";
import Component from "./DoList";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as ComponentType<Record<string, unknown>>;

describe("DoList", () => {
    test("renders as a list", () => {
        render(<Subject>Items</Subject>);
        expect(screen.getByRole("list")).toBeTruthy();
    });

    test("has no English label of its own", () => {
        render(<Subject>Items</Subject>);
        expect(screen.getByRole("list").hasAttribute("aria-label")).toBe(false);
    });

    test("accepts custom label", () => {
        render(<Subject label="Recommended">Items</Subject>);
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Recommended");
    });

    test("renders children", () => {
        render(<Subject>Use alt text</Subject>);
        expect(screen.getByRole("list").textContent).toContain("Use alt text");
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="dl">C</Subject>);
        expect(screen.getByTestId("dl")).toBeTruthy();
    });
});
