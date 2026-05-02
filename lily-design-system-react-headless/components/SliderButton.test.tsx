import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./SliderButton";

describe("SliderButton", () => {
    test("renders a button with class slider-button", () => {
        const { container } = render(<Subject label="Slide to confirm" />);
        const btn = container.querySelector(".slider-button");
        expect(btn).toBeTruthy();
        expect(btn?.tagName).toBe("BUTTON");
    });

    test("type defaults to button", () => {
        render(<Subject label="x" />);
        expect(screen.getByRole("slider").getAttribute("type")).toBe("button");
    });

    test("applies role=slider with aria-valuemin, aria-valuemax, aria-valuenow", () => {
        render(<Subject label="Slide to confirm" />);
        const slider = screen.getByRole("slider", { name: "Slide to confirm" });
        expect(slider.getAttribute("aria-valuemin")).toBe("0");
        expect(slider.getAttribute("aria-valuemax")).toBe("100");
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
    });

    test("ArrowRight advances aria-valuenow by step", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="x" />);
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowRight}");
        expect(slider.getAttribute("aria-valuenow")).toBe("10");
        await user.keyboard("{ArrowRight}");
        expect(slider.getAttribute("aria-valuenow")).toBe("20");
    });

    test("ArrowLeft retreats aria-valuenow by step", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="x" />);
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowRight}{ArrowRight}{ArrowLeft}");
        expect(slider.getAttribute("aria-valuenow")).toBe("10");
    });

    test("custom step is honored", async () => {
        const user: UserEvent = userEvent.setup();
        render(<Subject label="x" step={25} />);
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowRight}");
        expect(slider.getAttribute("aria-valuenow")).toBe("25");
    });

    test("End key fires onConfirm and resets to 0", async () => {
        const user: UserEvent = userEvent.setup();
        const onConfirm = vi.fn();
        render(<Subject label="x" onConfirm={onConfirm} />);
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{End}");
        expect(onConfirm).toHaveBeenCalledOnce();
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
    });

    test("Enter activates immediately as accessibility fallback", async () => {
        const user: UserEvent = userEvent.setup();
        const onConfirm = vi.fn();
        render(<Subject label="x" onConfirm={onConfirm} />);
        screen.getByRole("slider").focus();
        await user.keyboard("{Enter}");
        expect(onConfirm).toHaveBeenCalledOnce();
    });

    test("ArrowRight repeatedly to 100 fires onConfirm", async () => {
        const user: UserEvent = userEvent.setup();
        const onConfirm = vi.fn();
        render(<Subject label="x" step={50} onConfirm={onConfirm} />);
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowRight}{ArrowRight}");
        expect(onConfirm).toHaveBeenCalledOnce();
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
    });

    test("does not respond to keys when disabled", async () => {
        const user: UserEvent = userEvent.setup();
        const onConfirm = vi.fn();
        render(<Subject label="x" disabled onConfirm={onConfirm} />);
        const slider = screen.getByRole("slider");
        slider.focus();
        await user.keyboard("{ArrowRight}{End}");
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
        expect(onConfirm).not.toHaveBeenCalled();
    });
});
