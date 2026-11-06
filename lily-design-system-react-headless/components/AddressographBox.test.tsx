import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./AddressographBox";

describe("AddressographBox", () => {
    test("renders a div element with class addressograph-box", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".addressograph-box");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".addressograph-box");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(<Subject label="Patient identification">content</Subject>);
        const root = container.querySelector(".addressograph-box");
        expect(root?.getAttribute("aria-label")).toBe("Patient identification");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });

    test("is a named group when labelled", () => {
        const { container } = render(<Subject label="Story">content</Subject>);
        const root = container.querySelector(".addressograph-box");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.querySelector(".addressograph-box")?.hasAttribute("role")).toBe(false);
    });
});
