import { render } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Watermark.vue";


describe("Watermark", () => {
    test("renders root with watermark class", () => {
        const { container } = render(Subject, { slots: { default: "<p>x</p>" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("watermark")).toBe(true);
    });

    test("default rotate is -22 and default gap is 100px", () => {
        const { container } = render(Subject, { slots: { default: "x" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-rotate")).toBe("-22");
        expect(root.getAttribute("data-gap")).toBe("100px");
    });

    test("custom rotate and gap", () => {
        const { container } = render(Subject, {
            props: { rotate: -45, gap: "120px" },
            slots: { default: "x" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("data-rotate")).toBe("-45");
        expect(root.getAttribute("data-gap")).toBe("120px");
    });

    test("renders watermark-overlay with aria-hidden true", () => {
        const { container } = render(Subject, { slots: { default: "x" } });

        const overlay: HTMLElement = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay).toBeTruthy();
        expect(overlay.getAttribute("aria-hidden")).toBe("true");
    });

    test("overlay exposes text via data-text", () => {
        const { container } = render(Subject, {
            props: { text: "CONFIDENTIAL" },
            slots: { default: "x" },
        });

        const overlay: HTMLElement = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay.getAttribute("data-text")).toBe("CONFIDENTIAL");
    });

    test("overlay exposes imageUrl via data-image-url", () => {
        const { container } = render(Subject, {
            props: { imageUrl: "/wm.png" },
            slots: { default: "x" },
        });

        const overlay: HTMLElement = container.querySelector(".watermark-overlay") as HTMLElement;
        expect(overlay.getAttribute("data-image-url")).toBe("/wm.png");
    });

    test("renders default slot content beneath the overlay", () => {
        const { container } = render(Subject, { slots: { default: "<p>article body</p>" } });

        expect(container.textContent).toContain("article body");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(Subject, {
            props: { id: "wm-1" },
            slots: { default: "x" },
        });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("id")).toBe("wm-1");
    });
});
