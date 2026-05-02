import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import Subject from "./SliderButton.vue";

describe("SliderButton", () => {
    test("renders a button with class slider-button", () => {
        const { container } = render(Subject, { props: { label: "Slide to confirm" } });
        const btn = container.querySelector(".slider-button");
        expect(btn).toBeTruthy();
        expect(btn?.tagName).toBe("BUTTON");
    });

    test("type defaults to button", () => {
        render(Subject, { props: { label: "x" } });
        expect(screen.getByRole("slider").getAttribute("type")).toBe("button");
    });

    test("applies role=slider with aria-valuemin, aria-valuemax, aria-valuenow", () => {
        render(Subject, { props: { label: "Slide to confirm" } });
        const slider = screen.getByRole("slider", { name: "Slide to confirm" });
        expect(slider.getAttribute("aria-valuemin")).toBe("0");
        expect(slider.getAttribute("aria-valuemax")).toBe("100");
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
    });

    test("ArrowRight advances aria-valuenow by step", async () => {
        render(Subject, { props: { label: "x" } });
        const slider = screen.getByRole("slider");
        await fireEvent.keyDown(slider, { key: "ArrowRight" });
        expect(slider.getAttribute("aria-valuenow")).toBe("10");
        await fireEvent.keyDown(slider, { key: "ArrowRight" });
        expect(slider.getAttribute("aria-valuenow")).toBe("20");
    });

    test("ArrowLeft retreats aria-valuenow by step", async () => {
        render(Subject, { props: { label: "x" } });
        const slider = screen.getByRole("slider");
        await fireEvent.keyDown(slider, { key: "ArrowRight" });
        await fireEvent.keyDown(slider, { key: "ArrowRight" });
        await fireEvent.keyDown(slider, { key: "ArrowLeft" });
        expect(slider.getAttribute("aria-valuenow")).toBe("10");
    });

    test("custom step is honored", async () => {
        render(Subject, { props: { label: "x", step: 25 } });
        const slider = screen.getByRole("slider");
        await fireEvent.keyDown(slider, { key: "ArrowRight" });
        expect(slider.getAttribute("aria-valuenow")).toBe("25");
    });

    test("End key emits confirm and resets to 0", async () => {
        const { emitted } = render(Subject, { props: { label: "x" } });
        const slider = screen.getByRole("slider");
        await fireEvent.keyDown(slider, { key: "End" });
        expect(emitted().confirm?.length).toBe(1);
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
    });

    test("Enter activates immediately as accessibility fallback", async () => {
        const { emitted } = render(Subject, { props: { label: "x" } });
        const slider = screen.getByRole("slider");
        await fireEvent.keyDown(slider, { key: "Enter" });
        expect(emitted().confirm?.length).toBe(1);
    });

    test("ArrowRight repeatedly to 100 emits confirm", async () => {
        const { emitted } = render(Subject, { props: { label: "x", step: 50 } });
        const slider = screen.getByRole("slider");
        await fireEvent.keyDown(slider, { key: "ArrowRight" });
        await fireEvent.keyDown(slider, { key: "ArrowRight" });
        expect(emitted().confirm?.length).toBe(1);
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
    });

    test("does not respond to keys when disabled", async () => {
        const { emitted } = render(Subject, { props: { label: "x", disabled: true } });
        const slider = screen.getByRole("slider");
        await fireEvent.keyDown(slider, { key: "ArrowRight" });
        await fireEvent.keyDown(slider, { key: "End" });
        expect(slider.getAttribute("aria-valuenow")).toBe("0");
        expect(emitted().confirm).toBeUndefined();
    });
});
