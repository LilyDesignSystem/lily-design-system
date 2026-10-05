import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StreamingText from "./StreamingText";

describe("StreamingText", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(<StreamingText>Hello</StreamingText>);
        expect(container.querySelector("div.streaming-text")).toBeTruthy();
    });

    it("is a polite, atomic status region", () => {
        render(<StreamingText>Hello</StreamingText>);
        const el = screen.getByRole("status");
        expect(el.getAttribute("aria-live")).toBe("polite");
        expect(el.getAttribute("aria-atomic")).toBe("true");
    });

    it("is not busy by default", () => {
        render(<StreamingText>Hello</StreamingText>);
        const el = screen.getByRole("status");
        expect(el.hasAttribute("aria-busy")).toBe(false);
        expect(el.hasAttribute("data-streaming")).toBe(false);
    });

    it("marks the region busy while streaming", () => {
        render(<StreamingText streaming>Hel</StreamingText>);
        const el = screen.getByRole("status");
        expect(el.getAttribute("aria-busy")).toBe("true");
        expect(el.getAttribute("data-streaming")).toBe("true");
    });

    it("clears busy when streaming becomes false", () => {
        const { rerender } = render(<StreamingText streaming>Hel</StreamingText>);
        rerender(<StreamingText>Hello</StreamingText>);
        const el = screen.getByRole("status");
        expect(el.hasAttribute("aria-busy")).toBe(false);
        expect(el.hasAttribute("data-streaming")).toBe(false);
    });

    it("sets aria-label from label, and omits it without one", () => {
        const a = render(<StreamingText label="Answer">x</StreamingText>);
        expect(screen.getByRole("status").getAttribute("aria-label")).toBe("Answer");
        a.unmount();
        render(<StreamingText>x</StreamingText>);
        expect(screen.getByRole("status").hasAttribute("aria-label")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        render(<StreamingText className="mine">x</StreamingText>);
        expect(screen.getByRole("status").getAttribute("class")).toBe("streaming-text mine");
    });

    it("renders the children", () => {
        render(<StreamingText><span data-testid="txt">Hello</span></StreamingText>);
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        render(<StreamingText id="s1" data-testid="root">x</StreamingText>);
        expect(screen.getByTestId("root").id).toBe("s1");
    });
});
