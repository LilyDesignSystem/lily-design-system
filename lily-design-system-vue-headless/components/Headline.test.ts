import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Headline.vue";

describe("Headline", () => {
    test("renders a div with class headline", () => {
        const { container } = render(Subject, { slots: { default: "Title" } });
        const root = container.querySelector(".headline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders h1 by default", () => {
        const { container } = render(Subject, { slots: { default: "Title" } });
        const h = container.querySelector(".headline-heading");
        expect(h?.tagName).toBe("H1");
        expect(h?.textContent).toBe("Title");
    });

    test("respects the level prop", () => {
        const { container } = render(Subject, { props: { level: 3 }, slots: { default: "Title" } });
        expect(container.querySelector(".headline-heading")?.tagName).toBe("H3");
    });

    test("renders subtitle slot when provided", () => {
        const { container } = render(Subject, {
            slots: { default: "Title", subtitle: "The dek" },
        });
        expect(container.querySelector(".headline-subtitle")?.textContent).toBe("The dek");
    });

    test("omits subtitle when not provided", () => {
        const { container } = render(Subject, { slots: { default: "Title" } });
        expect(container.querySelector(".headline-subtitle")).toBeNull();
    });

    test("renders byline slot when provided", () => {
        const { container } = render(Subject, {
            slots: { default: "Title", byline: "<span>By Jane</span>" },
        });
        expect(container.querySelector(".headline-byline")?.textContent).toBe("By Jane");
    });
});
