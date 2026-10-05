import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ToolCallName.vue";

describe("ToolCallName", () => {
    test("renders a <span> with the base class", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });
        expect(container.querySelector("span.tool-call-name")).toBeTruthy();
    });

    test("merges attrs (class, id) onto the root", () => {
        const { container } = render(Subject, { attrs: { class: "mine", id: "x1" }, slots: { default: "x" } });
        const el = container.querySelector(".tool-call-name")!;
        expect(el.id).toBe("x1");
        expect(el.getAttribute("class")).toBe("tool-call-name mine");
    });

    test("renders the slot", () => {
        render(Subject, { slots: { default: '<span data-testid="txt">Hello</span>' } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });
});
