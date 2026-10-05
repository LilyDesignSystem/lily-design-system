import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolCallName from "./ToolCallName";

describe("ToolCallName", () => {
    it("renders a <span> with the base class", () => {
        const { container } = render(<ToolCallName>Hello</ToolCallName>);
        expect(container.querySelector("span.tool-call-name")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<ToolCallName className="mine">x</ToolCallName>);
        expect(container.querySelector(".tool-call-name")!.getAttribute("class")).toBe("tool-call-name mine");
    });

    it("renders the children", () => {
        render(<ToolCallName><span data-testid="txt">Hello</span></ToolCallName>);
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(<ToolCallName id="x1">x</ToolCallName>);
        expect(container.querySelector(".tool-call-name")!.id).toBe("x1");
    });
});
