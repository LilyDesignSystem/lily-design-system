import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolCallStatus from "./ToolCallStatus";

describe("ToolCallStatus", () => {
    it("renders a <span> with the base class", () => {
        const { container } = render(<ToolCallStatus>Hello</ToolCallStatus>);
        expect(container.querySelector("span.tool-call-status")).toBeTruthy();
    });

    it("sets data-status from status, and omits it without one", () => {
        const a = render(<ToolCallStatus status="running">x</ToolCallStatus>);
        expect(a.container.querySelector(".tool-call-status")!.getAttribute("data-status")).toBe("running");
        a.unmount();
        const b = render(<ToolCallStatus>x</ToolCallStatus>);
        expect(b.container.querySelector(".tool-call-status")!.hasAttribute("data-status")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<ToolCallStatus className="mine">x</ToolCallStatus>);
        expect(container.querySelector(".tool-call-status")!.getAttribute("class")).toBe("tool-call-status mine");
    });

    it("renders the children", () => {
        render(<ToolCallStatus><span data-testid="txt">Hello</span></ToolCallStatus>);
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(<ToolCallStatus id="x1">x</ToolCallStatus>);
        expect(container.querySelector(".tool-call-status")!.id).toBe("x1");
    });
});
