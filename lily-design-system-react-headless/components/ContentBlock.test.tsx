import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ContentBlock";

describe("ContentBlock", () => {
    test("renders a div with class content-block", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".content-block");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("data-width defaults to normal", () => {
        const { container } = render(<Subject>x</Subject>);
        const root = container.querySelector(".content-block");
        expect(root?.getAttribute("data-width")).toBe("normal");
    });

    test("data-width reflects the width prop", () => {
        const { container } = render(<Subject width="wide">x</Subject>);
        const root = container.querySelector(".content-block");
        expect(root?.getAttribute("data-width")).toBe("wide");
    });
});
