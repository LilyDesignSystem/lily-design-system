import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Loading.vue";

describe("Loading", () => {
    test("renders a div element with class loading", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".loading");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("applies role=status", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "x" } });
        const root = container.querySelector(".loading");
        expect(root?.getAttribute("role")).toBe("status");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".loading");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "x" } });
        const root = container.querySelector(".loading");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
