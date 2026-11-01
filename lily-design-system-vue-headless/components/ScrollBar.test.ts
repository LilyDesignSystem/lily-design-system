import { fireEvent, render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollBar.vue";

describe("ScrollBar", () => {
    test("renders a scrollbar", () => {
        render(Subject, { props: { label: "Scroll" }, slots: { default: "thumb" } });
        expect(screen.getByRole("scrollbar")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Page scroll" }, slots: { default: "thumb" } });
        expect(screen.getByLabelText("Page scroll")).toBeTruthy();
    });

    test("defaults to vertical orientation", () => {
        render(Subject, { props: { label: "Scroll" }, slots: { default: "thumb" } });
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("vertical");
    });

    test("supports horizontal orientation", () => {
        render(Subject, {
            props: { label: "Scroll", orientation: "horizontal" },
            slots: { default: "thumb" },
        });
        expect(screen.getByRole("scrollbar").getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "sb" }, slots: { default: "x" } });
        expect(screen.getByTestId("sb")).toBeTruthy();
    });

    test("is focusable and names the scrolled element", () => {
        render(Subject, {
            props: { label: "Scroll", controls: "messages" },
            slots: { default: "thumb" },
        });
        const bar = screen.getByRole("scrollbar");
        expect(bar.getAttribute("tabindex")).toBe("0");
        expect(bar.getAttribute("aria-controls")).toBe("messages");
    });

    test("arrow keys move the value by step, clamped to the range", async () => {
        render(Subject, {
            props: { label: "Scroll", modelValue: 1, step: 2 },
            slots: { default: "thumb" },
        });
        const bar = screen.getByRole("scrollbar");
        await fireEvent.keyDown(bar, { key: "ArrowDown" });
        expect(bar.getAttribute("aria-valuenow")).toBe("3");
        await fireEvent.keyDown(bar, { key: "ArrowRight" });
        expect(bar.getAttribute("aria-valuenow")).toBe("5");
        await fireEvent.keyDown(bar, { key: "ArrowUp" });
        await fireEvent.keyDown(bar, { key: "ArrowLeft" });
        await fireEvent.keyDown(bar, { key: "ArrowLeft" });
        expect(bar.getAttribute("aria-valuenow")).toBe("0");
    });

    test("Page Up and Page Down move the value by pageStep", async () => {
        const { emitted } = render(Subject, {
            props: { label: "Scroll", modelValue: 50, pageStep: 25 },
            slots: { default: "thumb" },
        });
        const bar = screen.getByRole("scrollbar");
        await fireEvent.keyDown(bar, { key: "PageDown" });
        expect(emitted()["update:modelValue"]).toEqual([[75]]);
    });

    test("Page Up moves the value back by pageStep", async () => {
        const { emitted } = render(Subject, {
            props: { label: "Scroll", modelValue: 50, pageStep: 25 },
            slots: { default: "thumb" },
        });
        await fireEvent.keyDown(screen.getByRole("scrollbar"), { key: "PageUp" });
        expect(emitted()["update:modelValue"]).toEqual([[25]]);
    });

    test("Home and End jump to min and max", async () => {
        render(Subject, {
            props: { label: "Scroll", modelValue: 40, min: 10, max: 90 },
            slots: { default: "thumb" },
        });
        const bar = screen.getByRole("scrollbar");
        expect(bar.getAttribute("aria-valuemin")).toBe("10");
        expect(bar.getAttribute("aria-valuemax")).toBe("90");
        await fireEvent.keyDown(bar, { key: "End" });
        expect(bar.getAttribute("aria-valuenow")).toBe("90");
        await fireEvent.keyDown(bar, { key: "Home" });
        expect(bar.getAttribute("aria-valuenow")).toBe("10");
    });
});
