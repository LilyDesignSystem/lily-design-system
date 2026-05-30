import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Draft.vue";

describe("Draft", () => {
    test("renders a div element with class draft", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".draft");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, { props: { label: "Draft article" }, slots: { default: "x" } });
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("aria-label")).toBe("Draft article");
    });

    test("does not set data-status when status is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("data-status")).toBeNull();
    });

    test("applies data-status when status prop is provided", () => {
        const { container } = render(Subject, { props: { status: "in-progress" }, slots: { default: "x" } });
        const root = container.querySelector(".draft");
        expect(root?.getAttribute("data-status")).toBe("in-progress");
    });
});
