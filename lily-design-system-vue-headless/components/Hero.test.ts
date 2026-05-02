import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Hero.vue";

describe("Hero", () => {
    test("renders a section element with class hero", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: "content" } });
        const root = container.querySelector(".hero");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("SECTION");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "x" } });
        const root = container.querySelector(".hero");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
