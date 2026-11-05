import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type { ComponentType } from "react";
import Component from "./DontList";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as ComponentType<Record<string, unknown>>;

describe("DontList", () => {
    test("renders as a list", () => {
        render(<Subject>Items</Subject>);
        expect(screen.getByRole("list")).toBeTruthy();
    });

    test("has no English label of its own", () => {
        render(<Subject>Items</Subject>);
        expect(screen.getByRole("list").hasAttribute("aria-label")).toBe(false);
    });

    test("accepts custom label", () => {
        render(<Subject label="Avoid">Items</Subject>);
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Avoid");
    });

    test("renders children", () => {
        render(<Subject>Skip tests</Subject>);
        expect(screen.getByRole("list").textContent).toContain("Skip tests");
    });

    test("passes through attributes", () => {
        render(<Subject data-testid="dnl">C</Subject>);
        expect(screen.getByTestId("dnl")).toBeTruthy();
    });
});
