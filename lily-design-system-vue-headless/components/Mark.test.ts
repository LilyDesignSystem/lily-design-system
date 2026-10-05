import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Mark.vue";

describe("Mark", () => {
    test("renders a <mark> with the base class", () => {
        const { container } = render(Subject, { slots: { default: "Hello" } });
        expect(container.querySelector("mark.mark")).toBeTruthy();
    });

    test("merges attrs (class, id) onto the root", () => {
        const { container } = render(Subject, { attrs: { class: "mine", id: "x1" }, slots: { default: "x" } });
        const el = container.querySelector(".mark")!;
        expect(el.id).toBe("x1");
        expect(el.getAttribute("class")).toBe("mark mine");
    });

    test("renders the slot", () => {
        render(Subject, { slots: { default: '<span data-testid="txt">Hello</span>' } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });
});
