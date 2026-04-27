import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Watermark";

describe("Watermark", () => {
    test("renders a div with the watermark root class", () => {
        const { container } = render(<Subject text="DRAFT">content</Subject>);

        const root: HTMLElement = container.querySelector(".watermark") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.tagName).toBe("DIV");
    });

    test("renders the overlay with aria-hidden=true", () => {
        const { container } = render(<Subject text="DRAFT">content</Subject>);

        const overlay: HTMLElement = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay).toBeTruthy();
        expect(overlay.getAttribute("aria-hidden")).toBe("true");
    });

    test("exposes text as data-text on the overlay", () => {
        const { container } = render(<Subject text="DRAFT">x</Subject>);
        const overlay: HTMLElement = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay.getAttribute("data-text")).toBe("DRAFT");
    });

    test("exposes imageUrl as data-image-url on the overlay", () => {
        const { container } = render(
            <Subject imageUrl="/wm.png">x</Subject>
        );
        const overlay: HTMLElement = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay.getAttribute("data-image-url")).toBe("/wm.png");
    });

    test("default gap is 100px and default rotate is -22", () => {
        const { container } = render(<Subject text="x">y</Subject>);
        const root: HTMLElement = container.querySelector(".watermark") as HTMLElement;
        expect(root.getAttribute("data-gap")).toBe("100px");
        expect(root.getAttribute("data-rotate")).toBe("-22");
    });

    test("applies custom gap and rotate", () => {
        const { container } = render(
            <Subject text="x" gap="120px" rotate={-30}>
                y
            </Subject>
        );
        const root: HTMLElement = container.querySelector(".watermark") as HTMLElement;
        expect(root.getAttribute("data-gap")).toBe("120px");
        expect(root.getAttribute("data-rotate")).toBe("-30");
    });

    test("renders children beneath the overlay", () => {
        render(
            <Subject text="x">
                <p>page content</p>
            </Subject>
        );
        expect(screen.getByText("page content")).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject text="x" id="wm-1">
                y
            </Subject>
        );
        const root: HTMLElement = container.querySelector(".watermark") as HTMLElement;
        expect(root.getAttribute("id")).toBe("wm-1");
    });
});
