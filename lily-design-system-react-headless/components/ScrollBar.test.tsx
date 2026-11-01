import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ScrollBar";

describe("ScrollBar", () => {
    test("renders a scrollbar", () => {
        render(<Subject label="Scroll">thumb</Subject>);
        expect(screen.getByRole("scrollbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(<Subject label="Page scroll">thumb</Subject>);
        expect(screen.getByLabelText("Page scroll")).toBeTruthy();
    });

    test("defaults to vertical orientation", () => {
        render(<Subject label="Scroll">thumb</Subject>);
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("vertical");
    });

    test("supports horizontal orientation", () => {
        render(
            <Subject
                label="Scroll"
                orientation="horizontal"
            >
                thumb
            </Subject>,
        );
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="sb"
            >
                x
            </Subject>,
        );
        expect(screen.getByTestId("sb")).toBeTruthy();
    });

    test("is focusable and names the scrolled element", () => {
        render(
            <Subject
                label="Scroll"
                controls="messages"
            >
                thumb
            </Subject>,
        );
        const bar = screen.getByRole("scrollbar");
        expect(bar.getAttribute("tabindex")).toBe("0");
        expect(bar.getAttribute("aria-controls")).toBe("messages");
    });

    test("arrow keys move the value by step, clamped to the range", () => {
        render(
            <Subject
                label="Scroll"
                defaultValue={1}
                step={2}
            >
                thumb
            </Subject>,
        );
        const bar = screen.getByRole("scrollbar");
        fireEvent.keyDown(bar, { key: "ArrowDown" });
        expect(bar.getAttribute("aria-valuenow")).toBe("3");
        fireEvent.keyDown(bar, { key: "ArrowRight" });
        expect(bar.getAttribute("aria-valuenow")).toBe("5");
        fireEvent.keyDown(bar, { key: "ArrowUp" });
        fireEvent.keyDown(bar, { key: "ArrowLeft" });
        fireEvent.keyDown(bar, { key: "ArrowLeft" });
        expect(bar.getAttribute("aria-valuenow")).toBe("0");
    });

    test("Page Up and Page Down move the value by pageStep", () => {
        render(
            <Subject
                label="Scroll"
                defaultValue={50}
                pageStep={25}
            >
                thumb
            </Subject>,
        );
        const bar = screen.getByRole("scrollbar");
        fireEvent.keyDown(bar, { key: "PageDown" });
        expect(bar.getAttribute("aria-valuenow")).toBe("75");
        fireEvent.keyDown(bar, { key: "PageDown" });
        expect(bar.getAttribute("aria-valuenow")).toBe("100");
        fireEvent.keyDown(bar, { key: "PageUp" });
        expect(bar.getAttribute("aria-valuenow")).toBe("75");
    });

    test("Home and End jump to min and max", () => {
        render(
            <Subject
                label="Scroll"
                defaultValue={40}
                min={10}
                max={90}
            >
                thumb
            </Subject>,
        );
        const bar = screen.getByRole("scrollbar");
        expect(bar.getAttribute("aria-valuemin")).toBe("10");
        expect(bar.getAttribute("aria-valuemax")).toBe("90");
        fireEvent.keyDown(bar, { key: "End" });
        expect(bar.getAttribute("aria-valuenow")).toBe("90");
        fireEvent.keyDown(bar, { key: "Home" });
        expect(bar.getAttribute("aria-valuenow")).toBe("10");
    });

    test("a controlled value reports the next value and waits for the consumer", () => {
        const onChange = vi.fn();
        render(
            <Subject
                label="Scroll"
                value={20}
                onChange={onChange}
            >
                thumb
            </Subject>,
        );
        const bar = screen.getByRole("scrollbar");
        fireEvent.keyDown(bar, { key: "PageDown" });
        expect(onChange).toHaveBeenCalledWith(30);
        expect(bar.getAttribute("aria-valuenow")).toBe("20");
    });
});
