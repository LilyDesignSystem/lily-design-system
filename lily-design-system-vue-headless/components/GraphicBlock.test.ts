import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/vue";

import Subject from "./GraphicBlock.vue";

describe("GraphicBlock", () => {
    test("renders a figure with class graphic-block", () => {
        const { container } = render(Subject, {
            props: { label: "Sales chart" },
            slots: { default: "<svg />" },
        });
        const root = container.querySelector(".graphic-block");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("FIGURE");
    });

    test("applies role=img with aria-label", () => {
        render(Subject, { props: { label: "Sales chart" }, slots: { default: "<svg />" } });
        expect(screen.getByRole("img", { name: "Sales chart" })).toBeTruthy();
    });

    test("renders default slot inside graphic-block-content", () => {
        const { container } = render(Subject, {
            props: { label: "x" },
            slots: { default: "chart" },
        });
        expect(container.querySelector(".graphic-block-content")?.textContent).toBe("chart");
    });

    test("omits figcaption when no title, description, or notes", () => {
        const { container } = render(Subject, { props: { label: "x" }, slots: { default: "<svg />" } });
        expect(container.querySelector("figcaption")).toBeNull();
    });

    test("renders figcaption with title only", () => {
        const { container } = render(Subject, {
            props: { label: "x", title: "Sales 2026" },
            slots: { default: "<svg />" },
        });
        expect(container.querySelector("figcaption")).toBeTruthy();
        expect(container.querySelector(".graphic-block-title")?.textContent).toBe("Sales 2026");
    });

    test("renders title, description, and notes when all provided", () => {
        const { container } = render(Subject, {
            props: { label: "x", title: "T", description: "D", notes: "N" },
            slots: { default: "<svg />" },
        });
        expect(container.querySelector(".graphic-block-title")?.textContent).toBe("T");
        expect(container.querySelector(".graphic-block-description")?.textContent).toBe("D");
        expect(container.querySelector(".graphic-block-notes")?.textContent).toBe("N");
    });
});
