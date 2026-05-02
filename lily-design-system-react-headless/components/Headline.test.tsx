import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Headline";

describe("Headline", () => {
    test("renders a div with class headline", () => {
        const { container } = render(<Subject>Title</Subject>);
        const root = container.querySelector(".headline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders h1 by default", () => {
        const { container } = render(<Subject>Title</Subject>);
        const h = container.querySelector(".headline-heading");
        expect(h?.tagName).toBe("H1");
        expect(h?.textContent).toBe("Title");
    });

    test("respects the level prop", () => {
        const { container } = render(<Subject level={3}>Title</Subject>);
        expect(container.querySelector(".headline-heading")?.tagName).toBe("H3");
    });

    test("renders subtitle when provided", () => {
        const { container } = render(<Subject subtitle="The dek">Title</Subject>);
        expect(container.querySelector(".headline-subtitle")?.textContent).toBe("The dek");
    });

    test("omits subtitle when not provided", () => {
        const { container } = render(<Subject>Title</Subject>);
        expect(container.querySelector(".headline-subtitle")).toBeNull();
    });

    test("renders byline when provided", () => {
        const { container } = render(
            <Subject byline={<span>By Jane</span>}>Title</Subject>
        );
        expect(container.querySelector(".headline-byline")?.textContent).toBe("By Jane");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(
            <Subject data-testid="hl">Title</Subject>
        );
        expect(container.querySelector("[data-testid='hl']")).toBeTruthy();
    });
});
