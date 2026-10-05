import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ToolCallStatus.vue";

describe("ToolCallStatus", () => {
    test("renders a <span> with the base class", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });
        expect(container.querySelector("span.tool-call-status")).toBeTruthy();
    });

    test("sets data-status from status, and omits it without one", () => {
        const a = render(Subject, { props: { status: "running" }, slots: { default: "x" } });
        expect(a.container.querySelector(".tool-call-status")!.getAttribute("data-status")).toBe("running");
        a.unmount();
        const b = render(Subject, { slots: { default: "x" } });
        expect(b.container.querySelector(".tool-call-status")!.hasAttribute("data-status")).toBe(false);
    });

    test("merges attrs (class, id) onto the root", () => {
        const { container } = render(Subject, { attrs: { class: "mine", id: "x1" }, slots: { default: "x" } });
        const el = container.querySelector(".tool-call-status")!;
        expect(el.id).toBe("x1");
        expect(el.getAttribute("class")).toBe("tool-call-status mine");
    });

    test("renders the slot", () => {
        render(Subject, { slots: { default: '<span data-testid="txt">Hello</span>' } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });
});
