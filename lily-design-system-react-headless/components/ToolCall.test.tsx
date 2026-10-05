import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ToolCall from "./ToolCall";

const sum = <span data-testid="sum">search_web</span>;
const body = <span data-testid="body">Body</span>;

describe("ToolCall", () => {
    it("renders a <details> with the base class, closed by default", () => {
        const { container } = render(<ToolCall summary={sum}>{body}</ToolCall>);
        const el = container.querySelector("details.tool-call") as HTMLDetailsElement;
        expect(el).toBeTruthy();
        expect(el.open).toBe(false);
    });

    it("puts the summary content in <summary class=tool-call-summary>", () => {
        const { container } = render(<ToolCall summary={sum}>{body}</ToolCall>);
        expect(container.querySelector("summary.tool-call-summary [data-testid=sum]")).toBeTruthy();
    });

    it("puts the body in <div class=tool-call-content>", () => {
        const { container } = render(<ToolCall summary={sum}>{body}</ToolCall>);
        expect(container.querySelector("div.tool-call-content [data-testid=body]")).toBeTruthy();
    });

    it("reflects open", () => {
        const { container } = render(<ToolCall summary={sum} open>{body}</ToolCall>);
        expect((container.querySelector("details") as HTMLDetailsElement).open).toBe(true);
    });

    it("sets data-status from status, and omits it without one", () => {
        const a = render(<ToolCall summary={sum} status="done">{body}</ToolCall>);
        expect(a.container.querySelector("details")!.getAttribute("data-status")).toBe("done");
        a.unmount();
        const b = render(<ToolCall summary={sum}>{body}</ToolCall>);
        expect(b.container.querySelector("details")!.hasAttribute("data-status")).toBe(false);
    });

    it("is busy only while running", () => {
        const a = render(<ToolCall summary={sum} status="running">{body}</ToolCall>);
        expect(a.container.querySelector("details")!.getAttribute("aria-busy")).toBe("true");
        a.unmount();
        for (const s of ["pending", "done", "error"]) {
            const b = render(<ToolCall summary={sum} status={s}>{body}</ToolCall>);
            expect(b.container.querySelector("details")!.hasAttribute("aria-busy")).toBe(false);
            b.unmount();
        }
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(<ToolCall summary={sum} className="mine">{body}</ToolCall>);
        expect(container.querySelector("details")!.getAttribute("class")).toBe("tool-call mine");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(<ToolCall summary={sum} id="t1">{body}</ToolCall>);
        expect(container.querySelector("details")!.id).toBe("t1");
    });
});
