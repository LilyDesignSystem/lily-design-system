import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./StreamingText.vue";

describe("StreamingText", () => {
    test("renders a <div> with the base class", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });
        expect(container.querySelector("div.streaming-text")).toBeTruthy();
    });

    test("is a polite, atomic status region", () => {
        render(Subject, { slots: { default: "Hello" } });
        const el = screen.getByRole("status");
        expect(el.getAttribute("aria-live")).toBe("polite");
        expect(el.getAttribute("aria-atomic")).toBe("true");
    });

    test("is not busy by default", () => {
        render(Subject, { slots: { default: "Hello" } });
        const el = screen.getByRole("status");
        expect(el.hasAttribute("aria-busy")).toBe(false);
        expect(el.hasAttribute("data-streaming")).toBe(false);
    });

    test("marks the region busy while streaming", () => {
        render(Subject, { props: { streaming: true }, slots: { default: "Hel" } });
        const el = screen.getByRole("status");
        expect(el.getAttribute("aria-busy")).toBe("true");
        expect(el.getAttribute("data-streaming")).toBe("true");
    });

    test("clears busy when streaming becomes false", async () => {
        const { rerender } = render(Subject, { props: { streaming: true }, slots: { default: "Hel" } });
        await rerender({ streaming: false });
        const el = screen.getByRole("status");
        expect(el.hasAttribute("aria-busy")).toBe(false);
        expect(el.hasAttribute("data-streaming")).toBe(false);
    });

    test("sets aria-label from label, and omits it without one", () => {
        const a = render(Subject, { props: { label: "Answer" }, slots: { default: "x" } });
        expect(screen.getByRole("status").getAttribute("aria-label")).toBe("Answer");
        a.unmount();
        render(Subject, { slots: { default: "x" } });
        expect(screen.getByRole("status").hasAttribute("aria-label")).toBe(false);
    });

    test("merges attrs (class, id, data-*) onto the root", () => {
        render(Subject, { attrs: { class: "mine", id: "s1", "data-testid": "root" }, slots: { default: "x" } });
        const el = screen.getByTestId("root");
        expect(el.id).toBe("s1");
        expect(el.getAttribute("class")).toBe("streaming-text mine");
    });

    test("renders the slot", () => {
        render(Subject, { slots: { default: '<span data-testid="txt">Hello</span>' } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });
});
