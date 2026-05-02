import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ArticleLayout";

describe("ArticleLayout", () => {
    test("renders a article with class article-layout", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".article-layout");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("ARTICLE");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });
});
