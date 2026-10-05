import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Mark from "./Mark";

describe("Mark", () => {
    it("renders a <mark> with the base class", () => {
        const { container } = render(<Mark>Hello</Mark>);
        expect(container.querySelector("mark.mark")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<Mark className="mine">x</Mark>);
        expect(container.querySelector(".mark")!.getAttribute("class")).toBe("mark mine");
    });

    it("renders the children", () => {
        render(<Mark><span data-testid="txt">Hello</span></Mark>);
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(<Mark id="x1">x</Mark>);
        expect(container.querySelector(".mark")!.id).toBe("x1");
    });
});
