import { describe, expect, test } from "vitest";
import { render } from "@testing-library/vue";

import Subject from "./Kbd.vue";

describe("Kbd", () => {
    test("renders a kbd element with class kbd", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "content" } });
        const root = container.querySelector(".kbd");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("KBD");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { props: {}, slots: { default: "hello" } });
        expect(container.textContent).toContain("hello");
    });

    test("does not set aria-label when label is omitted", () => {
        const { container } = render(Subject, { slots: { default: "x" } });
        const root = container.querySelector(".kbd");
        expect(root?.getAttribute("aria-label")).toBeNull();
    });

    test("renders label as hidden text, not aria-label", () => {
        const { container } = render(Subject, {
            props: { label: "Hello" },
            slots: { default: "x" },
        });
        const root = container.querySelector(".kbd");
        expect(root?.getAttribute("aria-label")).toBeNull();
        expect(root?.querySelector(".screen-reader-span")?.textContent).toBe("Hello ");
        expect(root?.querySelector(".kbd-text")?.getAttribute("aria-hidden")).toBe("true");
    });
});
