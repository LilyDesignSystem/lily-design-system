import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ChatNav.vue";

describe("ChatNav", () => {
    test("renders a nav element with class chat-nav", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: "content" } });
        const root = container.querySelector(".chat-nav");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("NAV");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: { label: "Test" }, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, { props: { label: "Hello" }, slots: { default: "x" } });
        const root = container.querySelector(".chat-nav");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
