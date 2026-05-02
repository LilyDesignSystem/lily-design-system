import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ArticleLayout.vue";

describe("ArticleLayout", () => {
    test("renders a article with class article-layout", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".article-layout");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("ARTICLE");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        expect(container.textContent).toContain("content");
    });
});
