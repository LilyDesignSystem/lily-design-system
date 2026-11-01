import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./ChatListItem.vue";

describe("ChatListItem", () => {
    test("renders a li element with class chat-list-item", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".chat-list-item");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("LI");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".chat-list-item");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, {
            props: { label: "Hello" },
            slots: { default: "x" },
        });
        const root = container.querySelector(".chat-list-item");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("aria-current only when current", async () => {
        const { container, rerender } = render(Subject, { props: {}, slots: { default: "x" } });
        expect(container.querySelector("li.chat-list-item")!.hasAttribute("aria-current")).toBe(
            false,
        );
        await rerender({ current: true });
        expect(container.querySelector("li.chat-list-item")!.getAttribute("aria-current")).toBe(
            "true",
        );
    });
});
