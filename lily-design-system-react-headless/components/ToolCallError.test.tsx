import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolCallError from "./ToolCallError";

describe("ToolCallError", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(<ToolCallError>Hello</ToolCallError>);
        expect(container.querySelector("div.tool-call-error")).toBeTruthy();
    });

    it("is an alert region", () => {
        render(<ToolCallError>x</ToolCallError>);
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<ToolCallError className="mine">x</ToolCallError>);
        expect(container.querySelector(".tool-call-error")!.getAttribute("class")).toBe("tool-call-error mine");
    });

    it("renders the children", () => {
        render(<ToolCallError><span data-testid="txt">Hello</span></ToolCallError>);
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(<ToolCallError id="x1">x</ToolCallError>);
        expect(container.querySelector(".tool-call-error")!.id).toBe("x1");
    });
});
