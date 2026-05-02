import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./PhotoPack";

describe("PhotoPack", () => {
    test("renders a div with class photo-pack", () => {
        const { container } = render(<Subject label="x">content</Subject>);
        const root = container.querySelector(".photo-pack");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject label="x">content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("applies role=group", () => {
        const { container } = render(<Subject label="x">content</Subject>);
        const root = container.querySelector(".photo-pack");
        expect(root?.getAttribute("role")).toBe("group");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(<Subject label="Hello">content</Subject>);
        const root = container.querySelector(".photo-pack");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
