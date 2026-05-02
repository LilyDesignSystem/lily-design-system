import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./HeroHeadline";

describe("HeroHeadline", () => {
    test("renders a div with class hero-headline", () => {
        const { container } = render(<Subject label="x">content</Subject>);
        const root = container.querySelector(".hero-headline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(<Subject label="x" media={<div />}>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(<Subject label="Hello">content</Subject>);
        const root = container.querySelector(".hero-headline");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("renders the media prop", () => {
        const { container } = render(<Subject label="x" media={<div>MEDIA</div>}>HEADLINE</Subject>);
        expect(container.textContent).toContain("MEDIA");
        expect(container.textContent).toContain("HEADLINE");
    });
});
