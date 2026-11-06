import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BannerBox";

describe("BannerBox", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(<Subject label="Demo">content</Subject>);
        const el = container.querySelector(".banner-box");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends className prop to root", () => {
        const { container } = render(
            <Subject
                label="Demo"
                className="extra"
            >
                content
            </Subject>,
        );
        const el = container.querySelector(".banner-box");
        expect(el?.className).toContain("banner-box");
        expect(el?.className).toContain("extra");
    });

    test("is a named group when labelled", () => {
        const { container } = render(<Subject label="Story">content</Subject>);
        const root = container.querySelector(".banner-box");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.querySelector(".banner-box")?.hasAttribute("role")).toBe(false);
    });
});
