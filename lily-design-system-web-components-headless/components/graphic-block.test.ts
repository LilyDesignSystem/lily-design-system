import { afterEach, describe, expect, test } from "vitest";

import { GraphicBlock } from "./graphic-block.js";

if (!customElements.get("lily-graphic-block")) {
    customElements.define("lily-graphic-block", GraphicBlock);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GraphicBlock", () => {
    test("renders a figure with role=img", () => {
        const host = render('<lily-graphic-block label="Revenue chart"><svg></svg></lily-graphic-block>');

        const figure = host.querySelector("figure")!;
        expect(figure.className).toBe("graphic-block");
        expect(figure.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-graphic-block label="Revenue chart"><svg></svg></lily-graphic-block>');

        expect(host.querySelector("figure")!.getAttribute("aria-label")).toBe("Revenue chart");
    });

    test("does not render a figcaption when title, description, and notes are absent", () => {
        const host = render('<lily-graphic-block label="Revenue chart"><svg></svg></lily-graphic-block>');

        expect(host.querySelector("figcaption")).toBeNull();
    });

    test("renders title, description, and notes inside the figcaption when provided", () => {
        const host = render(
            '<lily-graphic-block label="Revenue chart" title="Revenue" description="By quarter" notes="Source: internal"><svg></svg></lily-graphic-block>',
        );

        const figcaption = host.querySelector("figcaption.graphic-block-caption")!;
        expect(figcaption.querySelector(".graphic-block-title")!.textContent).toBe("Revenue");
        expect(figcaption.querySelector(".graphic-block-description")!.textContent).toBe("By quarter");
        expect(figcaption.querySelector(".graphic-block-notes")!.textContent).toBe("Source: internal");
    });

    test("moves the consumer's graphic content into graphic-block-content", () => {
        const host = render('<lily-graphic-block label="Revenue chart"><svg data-testid="chart"></svg></lily-graphic-block>');

        expect(host.querySelector(".graphic-block-content svg")).toBeTruthy();
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-graphic-block label="Revenue chart"><svg></svg></lily-graphic-block>');

        (host as unknown as GraphicBlock).connectedCallback();

        expect(host.querySelectorAll("figure").length).toBe(1);
    });
});
