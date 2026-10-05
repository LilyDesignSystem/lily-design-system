import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolCallOutput from "./ToolCallOutput";

describe("ToolCallOutput", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(<ToolCallOutput>Hello</ToolCallOutput>);
        expect(container.querySelector("div.tool-call-output")).toBeTruthy();
    });

    it("with a label it is a named group; without one it has neither role nor aria-label", () => {
        const a = render(<ToolCallOutput label="Input">x</ToolCallOutput>);
        expect(screen.getByRole("group", { name: "Input" }).getAttribute("aria-label")).toBe("Input");
        a.unmount();
        const { container } = render(<ToolCallOutput>x</ToolCallOutput>);
        const el = container.querySelector(".tool-call-output")!;
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<ToolCallOutput className="mine">x</ToolCallOutput>);
        expect(container.querySelector(".tool-call-output")!.getAttribute("class")).toBe("tool-call-output mine");
    });

    it("renders the children", () => {
        render(<ToolCallOutput><span data-testid="txt">Hello</span></ToolCallOutput>);
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(<ToolCallOutput id="x1">x</ToolCallOutput>);
        expect(container.querySelector(".tool-call-output")!.id).toBe("x1");
    });
});
