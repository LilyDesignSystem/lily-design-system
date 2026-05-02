import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ScreenReaderSpan.vue";

describe("ScreenReaderSpan", () => {
    test("renders a span element with class screen-reader-span", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".screen-reader-span");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("SPAN");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".screen-reader-span");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "x" } });
        const root = container.querySelector(".screen-reader-span");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
