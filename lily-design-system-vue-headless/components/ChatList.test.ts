import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ChatList.vue";

describe("ChatList", () => {
    test("renders a ol element with class chat-list", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".chat-list");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("OL");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".chat-list");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "x" } });
        const root = container.querySelector(".chat-list");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
