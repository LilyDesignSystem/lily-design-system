import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolCallInput from "./ToolCallInput";

describe("ToolCallInput", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(<ToolCallInput>Hello</ToolCallInput>);
        expect(container.querySelector("div.tool-call-input")).toBeTruthy();
    });

    it("with a label it is a named group; without one it has neither role nor aria-label", () => {
        const a = render(<ToolCallInput label="Input">x</ToolCallInput>);
        expect(screen.getByRole("group", { name: "Input" }).getAttribute("aria-label")).toBe("Input");
        a.unmount();
        const { container } = render(<ToolCallInput>x</ToolCallInput>);
        const el = container.querySelector(".tool-call-input")!;
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<ToolCallInput className="mine">x</ToolCallInput>);
        expect(container.querySelector(".tool-call-input")!.getAttribute("class")).toBe("tool-call-input mine");
    });

    it("renders the children", () => {
        render(<ToolCallInput><span data-testid="txt">Hello</span></ToolCallInput>);
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(<ToolCallInput id="x1">x</ToolCallInput>);
        expect(container.querySelector(".tool-call-input")!.id).toBe("x1");
    });
});
