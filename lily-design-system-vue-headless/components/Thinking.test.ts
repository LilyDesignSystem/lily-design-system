import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Thinking.vue";

function root(container: HTMLElement) {
    return container.firstElementChild as HTMLDetailsElement;
}

describe("Thinking", () => {
    test("root is native <details> with the thinking class", () => {
        const { container } = render(Subject, { props: { label: "Thinking" }, slots: { default: "x" } });
        expect(root(container).tagName).toBe("DETAILS");
        expect(root(container).getAttribute("class")).toContain("thinking");
    });

    test("summary carries label and class", () => {
        const { container } = render(Subject, { props: { label: "Reasoning" }, slots: { default: "x" } });
        const summary = container.querySelector("summary.thinking-summary")!;
        expect(summary.textContent).toBe("Reasoning");
    });

    test("closed by default", () => {
        const { container } = render(Subject, { props: { label: "T" }, slots: { default: "x" } });
        expect(root(container).open).toBe(false);
    });

    test("open prop opens it", () => {
        const { container } = render(Subject, { props: { label: "T", open: true }, slots: { default: "x" } });
        expect(root(container).open).toBe(true);
    });

    test("children render inside .thinking-content", () => {
        const { container } = render(Subject, { props: { label: "T" }, slots: { default: "Step 1" } });
        expect(container.querySelector(".thinking-content")!.textContent).toBe("Step 1");
    });

    test("clicking the summary toggles open", async () => {
        const user = userEvent.setup();
        const { container } = render(Subject, { props: { label: "T" }, slots: { default: "x" } });
        await user.click(screen.getByText("T"));
        expect(root(container).open).toBe(true);
    });

    test("toggling mirrors into the open model (update:open)", () => {
        const { container, emitted } = render(Subject, { props: { label: "T" }, slots: { default: "x" } });
        root(container).open = true;
        root(container).dispatchEvent(new Event("toggle"));
        const events = emitted()["update:open"] as unknown[][];
        expect(events[events.length - 1][0]).toBe(true);
    });

    test("streaming sets data-streaming and aria-busy", () => {
        const { container } = render(Subject, { props: { label: "T", streaming: true }, slots: { default: "x" } });
        expect(root(container).getAttribute("data-streaming")).toBe("true");
        expect(root(container).getAttribute("aria-busy")).toBe("true");
    });

    test("not streaming omits data-streaming and aria-busy", () => {
        const { container } = render(Subject, { props: { label: "T" }, slots: { default: "x" } });
        expect(root(container).hasAttribute("data-streaming")).toBe(false);
        expect(root(container).hasAttribute("aria-busy")).toBe(false);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "th" }, slots: { default: "x" } });
        expect(screen.getByTestId("th")).toBeTruthy();
    });
});
