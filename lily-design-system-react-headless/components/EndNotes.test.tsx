import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./EndNotes";

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

    test("defaults aria-label to 'End notes'", () => {
        const { container } = render(<Subject>x</Subject>);
        const root = container.querySelector(".end-notes");
        expect(root?.getAttribute("aria-label")).toBe("End notes");
    });

    test("aria-label can be overridden", () => {
        const { container } = render(<Subject label="Other">x</Subject>);
        const root = container.querySelector(".end-notes");
        expect(root?.getAttribute("aria-label")).toBe("Other");
    });
});
