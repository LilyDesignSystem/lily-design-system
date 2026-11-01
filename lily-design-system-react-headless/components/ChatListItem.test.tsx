import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ChatListItem";

describe("ChatListItem", () => {
    test("renders a li element with class chat-list-item", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".chat-list-item");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("LI");
    });

    test("renders children content", () => {
        const { container } = render(<Subject>content</Subject>);
        expect(container.textContent).toContain("content");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(<Subject>content</Subject>);
        const root = container.querySelector(".chat-list-item");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(<Subject label="Hello">content</Subject>);
        const root = container.querySelector(".chat-list-item");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(<Subject data-testid="subject">content</Subject>);
        expect(container.querySelector("[data-testid='subject']")).toBeTruthy();
    });

    test("aria-current only when current", () => {
        const { container, rerender } = render(<Subject label="Ana">x</Subject>);
        expect(container.querySelector("li.chat-list-item")!.hasAttribute("aria-current")).toBe(
            false,
        );
        rerender(
            <Subject
                label="Ana"
                current
            >
                x
            </Subject>,
        );
        expect(container.querySelector("li.chat-list-item")!.getAttribute("aria-current")).toBe(
            "true",
        );
    });
});
