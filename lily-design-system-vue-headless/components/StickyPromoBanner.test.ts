import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./StickyPromoBanner.vue";


describe("StickyPromoBanner", () => {
    const baseProps = {
        label: "Promotional banner",
        dismissLabel: "Dismiss promotional banner",
    };

    test("renders as an aside with role complementary and aria-label", () => {
        render(Subject, {
            props: baseProps,
            slots: { default: "Save 20%" },
        });

        const aside: HTMLElement = screen.getByRole("complementary", { name: "Promotional banner" });
        expect(aside.tagName).toBe("ASIDE");
    });

    test("has sticky-promo-banner class on root", () => {
        render(Subject, {
            props: baseProps,
            slots: { default: "Save 20%" },
        });

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.classList.contains("sticky-promo-banner")).toBe(true);
    });

    test("defaults position to bottom and exposes data-position", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { default: "Save 20%" },
        });

        const aside: HTMLElement = container.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("data-position")).toBe("bottom");
    });

    test("applies position when provided", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, position: "top" },
            slots: { default: "Save 20%" },
        });

        const aside: HTMLElement = container.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("data-position")).toBe("top");
    });

    test("applies position fixed inline style with bottom by default", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { default: "Save 20%" },
        });

        const aside: HTMLElement = container.querySelector("aside") as HTMLElement;
        expect(aside.style.position).toBe("fixed");
        expect(aside.style.left).toBe("0px");
        expect(aside.style.right).toBe("0px");
        expect(aside.style.bottom).toBe("0px");
    });

    test("applies top edge inline style when position is top", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, position: "top" },
            slots: { default: "Save 20%" },
        });

        const aside: HTMLElement = container.querySelector("aside") as HTMLElement;
        expect(aside.style.top).toBe("0px");
    });

    test("is visible by default (not hidden)", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { default: "Save 20%" },
        });

        const aside: HTMLElement = container.querySelector("aside") as HTMLElement;
        expect(aside.hasAttribute("hidden")).toBe(false);
    });

    test("is hidden when open is false", () => {
        const { container } = render(Subject, {
            props: { ...baseProps, open: false },
            slots: { default: "Save 20%" },
        });

        const aside: HTMLElement = container.querySelector("aside") as HTMLElement;
        expect(aside.hasAttribute("hidden")).toBe(true);
    });

    test("renders default slot content inside content wrapper", () => {
        const { container } = render(Subject, {
            props: baseProps,
            slots: { default: "Save 20% today!" },
        });

        const content: HTMLElement | null = container.querySelector(".sticky-promo-banner-content");
        expect(content?.textContent).toContain("Save 20% today!");
    });

    test("renders dismiss button with aria-label", () => {
        render(Subject, {
            props: baseProps,
            slots: { default: "Save 20%" },
        });

        const button: HTMLElement = screen.getByRole("button", { name: "Dismiss promotional banner" });
        expect(button.classList.contains("sticky-promo-banner-dismiss")).toBe(true);
        expect(button.getAttribute("type")).toBe("button");
    });

    test("emits dismiss on click", async () => {
        const user: UserEvent = userEvent.setup();
        const onDismiss = vi.fn();

        render(Subject, {
            props: { ...baseProps, onDismiss },
            slots: { default: "Save 20%" },
        });

        const button: HTMLElement = screen.getByRole("button", { name: "Dismiss promotional banner" });
        await user.click(button);

        expect(onDismiss).toHaveBeenCalledOnce();
    });
});
