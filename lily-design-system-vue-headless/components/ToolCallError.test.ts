import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ToolCallError.vue";

describe("ToolCallError", () => {
    test("renders a <div> with the base class", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });
        expect(container.querySelector("div.tool-call-error")).toBeTruthy();
    });

    test("is an alert region", () => {
        render(Subject, { slots: { default: "x" } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("merges attrs (class, id) onto the root", () => {
        const { container } = render(Subject, { attrs: { class: "mine", id: "x1" }, slots: { default: "x" } });
        const el = container.querySelector(".tool-call-error")!;
        expect(el.id).toBe("x1");
        expect(el.getAttribute("class")).toBe("tool-call-error mine");
    });

    test("renders the slot", () => {
        render(Subject, { slots: { default: '<span data-testid="txt">Hello</span>' } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });
});
