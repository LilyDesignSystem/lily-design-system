import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import Subject from "./HorizontalScroller.vue";

describe("HorizontalScroller", () => {
    test("renders a div with class horizontal-scroller", () => {
        const { container } = render(Subject, {
            props: { label: "Gallery" },
            slots: { default: "items" },
        });
        const root = container.querySelector(".horizontal-scroller");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=region with aria-label and tabindex=0", () => {
        render(Subject, { props: { label: "Gallery" }, slots: { default: "items" } });
        const region = screen.getByRole("region", { name: "Gallery" });
        expect(region.getAttribute("tabindex")).toBe("0");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, {
            props: { label: "x" },
            slots: { default: "card1 card2 card3" },
        });
        expect(container.textContent).toBe("card1 card2 card3");
    });

    test("ArrowRight calls scrollBy with positive step", async () => {
        render(Subject, { props: { label: "x", step: 150 }, slots: { default: "items" } });
        const region = screen.getByRole("region");
        const scrollBy = vi.fn();
        Object.defineProperty(region, "scrollBy", { value: scrollBy, configurable: true });
        await fireEvent.keyDown(region, { key: "ArrowRight" });
        expect(scrollBy).toHaveBeenCalledWith({ left: 150, behavior: "smooth" });
    });

    test("ArrowLeft calls scrollBy with negative step", async () => {
        render(Subject, { props: { label: "x", step: 150 }, slots: { default: "items" } });
        const region = screen.getByRole("region");
        const scrollBy = vi.fn();
        Object.defineProperty(region, "scrollBy", { value: scrollBy, configurable: true });
        await fireEvent.keyDown(region, { key: "ArrowLeft" });
        expect(scrollBy).toHaveBeenCalledWith({ left: -150, behavior: "smooth" });
    });

    test("Home calls scrollTo left=0", async () => {
        render(Subject, { props: { label: "x" }, slots: { default: "items" } });
        const region = screen.getByRole("region");
        const scrollTo = vi.fn();
        Object.defineProperty(region, "scrollTo", { value: scrollTo, configurable: true });
        await fireEvent.keyDown(region, { key: "Home" });
        expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "smooth" });
    });

    test("End calls scrollTo left=scrollWidth", async () => {
        render(Subject, { props: { label: "x" }, slots: { default: "items" } });
        const region = screen.getByRole("region");
        const scrollTo = vi.fn();
        Object.defineProperty(region, "scrollTo", { value: scrollTo, configurable: true });
        Object.defineProperty(region, "scrollWidth", { value: 1234, configurable: true });
        await fireEvent.keyDown(region, { key: "End" });
        expect(scrollTo).toHaveBeenCalledWith({ left: 1234, behavior: "smooth" });
    });
});
