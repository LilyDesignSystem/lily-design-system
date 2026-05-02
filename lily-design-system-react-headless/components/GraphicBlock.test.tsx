import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./GraphicBlock";

describe("GraphicBlock", () => {
    test("renders a figure with class graphic-block", () => {
        const { container } = render(<Subject label="Sales chart"><svg /></Subject>);
        const root = container.querySelector(".graphic-block");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("FIGURE");
    });

    test("applies role=img with aria-label from label prop", () => {
        render(<Subject label="Sales chart"><svg /></Subject>);
        const fig = screen.getByRole("img", { name: "Sales chart" });
        expect(fig).toBeTruthy();
    });

    test("renders children content inside graphic-block-content", () => {
        const { container } = render(
            <Subject label="x"><div>chart</div></Subject>
        );
        expect(container.querySelector(".graphic-block-content")?.textContent).toBe("chart");
    });

    test("omits figcaption when no title, description, or notes", () => {
        const { container } = render(<Subject label="x"><svg /></Subject>);
        expect(container.querySelector("figcaption")).toBeNull();
    });

    test("renders figcaption with title only", () => {
        const { container } = render(
            <Subject label="x" title="Sales 2026"><svg /></Subject>
        );
        const cap = container.querySelector("figcaption");
        expect(cap).toBeTruthy();
        expect(cap?.querySelector(".graphic-block-title")?.textContent).toBe("Sales 2026");
    });

    test("renders title, description, and notes when all provided", () => {
        const { container } = render(
            <Subject label="x" title="T" description="D" notes="N"><svg /></Subject>
        );
        expect(container.querySelector(".graphic-block-title")?.textContent).toBe("T");
        expect(container.querySelector(".graphic-block-description")?.textContent).toBe("D");
        expect(container.querySelector(".graphic-block-notes")?.textContent).toBe("N");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject label="x" data-testid="gb"><svg /></Subject>
        );
        expect(container.querySelector("[data-testid='gb']")).toBeTruthy();
    });
});
