import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ToolCallOutput.vue";

describe("ToolCallOutput", () => {
    test("renders a <div> with the base class", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });
        expect(container.querySelector("div.tool-call-output")).toBeTruthy();
    });

    test("with a label it is a named group; without one it has neither role nor aria-label", () => {
        const a = render(Subject, { props: { label: "Input" }, slots: { default: "x" } });
        expect(screen.getByRole("group", { name: "Input" }).getAttribute("aria-label")).toBe("Input");
        a.unmount();
        const { container } = render(Subject, { slots: { default: "x" } });
        const el = container.querySelector(".tool-call-output")!;
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    test("merges attrs (class, id) onto the root", () => {
        const { container } = render(Subject, { attrs: { class: "mine", id: "x1" }, slots: { default: "x" } });
        const el = container.querySelector(".tool-call-output")!;
        expect(el.id).toBe("x1");
        expect(el.getAttribute("class")).toBe("tool-call-output mine");
    });

    test("renders the slot", () => {
        render(Subject, { slots: { default: '<span data-testid="txt">Hello</span>' } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });
});
