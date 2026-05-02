import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Visible.vue";

describe("Visible", () => {
    test("renders a div with class visible", () => {
        const { container } = render(Subject, { slots: { default: "<span>x</span>" } });
        const root = container.querySelector(".visible");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("exposes data-visible attribute", () => {
        const { container } = render(Subject, { slots: { default: "<span>x</span>" } });
        expect(container.querySelector(".visible")?.getAttribute("data-visible")).toBe("false");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { slots: { default: "<span>hello</span>" } });
        expect(container.textContent).toBe("hello");
    });
});
