import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import type { ComponentType } from "react";
import Component from "./EndNotes";

// Some tests leave a required word out, to show that nothing English fills it in.
const Subject = Component as ComponentType<Record<string, unknown>>;

describe("EndNotes", () => {
    test("renders a section with class end-notes", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".end-notes");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("SECTION");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("has no English aria-label of its own", () => {
        const { container } = render(<Subject>x</Subject>);
        const root = container.querySelector(".end-notes");
        expect(root?.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label can be overridden", () => {
        const { container } = render(<Subject label="Other">x</Subject>);
        const root = container.querySelector(".end-notes");
        expect(root?.getAttribute("aria-label")).toBe("Other");
    });
});
