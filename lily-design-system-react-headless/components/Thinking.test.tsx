import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, test } from "vitest";

import Subject from "./Thinking";

function root(container: HTMLElement) {
    return container.firstElementChild as HTMLDetailsElement;
}

describe("Thinking", () => {
    test("root is native <details> with the thinking class", () => {
        const { container } = render(<Subject label="Thinking">x</Subject>);
        expect(root(container).tagName).toBe("DETAILS");
        expect(root(container).getAttribute("class")).toContain("thinking");
    });

    test("summary carries label and class", () => {
        const { container } = render(<Subject label="Reasoning">x</Subject>);
        expect(container.querySelector("summary.thinking-summary")!.textContent).toBe("Reasoning");
    });

    test("closed by default", () => {
        const { container } = render(<Subject label="T">x</Subject>);
        expect(root(container).open).toBe(false);
    });

    test("open prop opens it", () => {
        const { container } = render(<Subject label="T" open>x</Subject>);
        expect(root(container).open).toBe(true);
    });

    test("children render inside .thinking-content", () => {
        const { container } = render(<Subject label="T">Step 1</Subject>);
        expect(container.querySelector(".thinking-content")!.textContent).toBe("Step 1");
    });

    test("clicking the summary toggles open", async () => {
        const user = userEvent.setup();
        const { container } = render(<Subject label="T">x</Subject>);
        await user.click(screen.getByText("T"));
        expect(root(container).open).toBe(true);
    });

    test("onChange reports the open state", async () => {
        const user = userEvent.setup();
        const seen: boolean[] = [];
        render(<Subject label="T" onChange={(v) => seen.push(v)}>x</Subject>);
        await user.click(screen.getByText("T"));
        expect(seen).toEqual([true]);
    });

    test("streaming sets data-streaming and aria-busy", () => {
        const { container } = render(<Subject label="T" streaming>x</Subject>);
        expect(root(container).getAttribute("data-streaming")).toBe("true");
        expect(root(container).getAttribute("aria-busy")).toBe("true");
    });

    test("not streaming omits data-streaming and aria-busy", () => {
        const { container } = render(<Subject label="T">x</Subject>);
        expect(root(container).hasAttribute("data-streaming")).toBe(false);
        expect(root(container).hasAttribute("aria-busy")).toBe(false);
    });

    test("passes through attributes", () => {
        render(<Subject label="T" data-testid="th">x</Subject>);
        expect(screen.getByTestId("th")).toBeTruthy();
    });
});
