import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Kbd";

describe("Kbd", () => {
    test("renders a kbd element with class kbd", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".kbd");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("KBD");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".kbd");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(<Subject label="Hello">content</Subject>);
        const root = container.querySelector(".kbd");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });
});
