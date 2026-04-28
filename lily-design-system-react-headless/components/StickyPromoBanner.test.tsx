import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./StickyPromoBanner";

describe("StickyPromoBanner", () => {
    test("renders as a complementary landmark with the required aria-label", () => {
        render(
            <Subject label="Promo" dismissLabel="Dismiss">
                <p>Hello</p>
            </Subject>,
        );

        const aside: HTMLElement = screen.getByRole("complementary", { name: "Promo" });
        expect(aside).toBeTruthy();
    });

    test("applies the sticky-promo-banner root class", () => {
        render(
            <Subject label="Promo" dismissLabel="Dismiss">
                <p>Hi</p>
            </Subject>,
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.className.includes("sticky-promo-banner")).toBe(true);
    });

    test("defaults position to bottom and exposes data-position", () => {
        render(
            <Subject label="Promo" dismissLabel="Dismiss">
                <p>Hi</p>
            </Subject>,
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.getAttribute("data-position")).toBe("bottom");
    });

    test("respects position prop for top", () => {
        render(
            <Subject label="Promo" dismissLabel="Dismiss" position="top">
                <p>Hi</p>
            </Subject>,
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.getAttribute("data-position")).toBe("top");
    });

    test("uses inline position fixed with bottom: 0 by default", () => {
        render(
            <Subject label="Promo" dismissLabel="Dismiss">
                <p>Hi</p>
            </Subject>,
        );

        const aside = screen.getByRole("complementary") as HTMLElement;
        expect(aside.style.position).toBe("fixed");
        expect(aside.style.bottom).toBe("0px");
        expect(aside.style.left).toBe("0px");
        expect(aside.style.right).toBe("0px");
    });

    test("uses inline position fixed with top: 0 when position is top", () => {
        render(
            <Subject label="Promo" dismissLabel="Dismiss" position="top">
                <p>Hi</p>
            </Subject>,
        );

        const aside = screen.getByRole("complementary") as HTMLElement;
        expect(aside.style.position).toBe("fixed");
        expect(aside.style.top).toBe("0px");
        expect(aside.style.left).toBe("0px");
        expect(aside.style.right).toBe("0px");
    });

    test("renders children content in the content wrapper", () => {
        const { container } = render(
            <Subject label="Promo" dismissLabel="Dismiss">
                <p>Subscribe now</p>
            </Subject>,
        );

        const wrapper = container.querySelector(".sticky-promo-banner-content");
        expect(wrapper).toBeTruthy();
        expect(wrapper!.textContent).toContain("Subscribe now");
    });

    test("does NOT render the dismiss button when onDismiss is not provided", () => {
        const { container } = render(
            <Subject label="Promo" dismissLabel="Dismiss">
                <p>Hi</p>
            </Subject>,
        );

        const button = container.querySelector(".sticky-promo-banner-dismiss");
        expect(button).toBeNull();
    });

    test("renders the dismiss button when onDismiss is provided", () => {
        const handle = vi.fn();
        render(
            <Subject label="Promo" dismissLabel="Dismiss banner" onDismiss={handle}>
                <p>Hi</p>
            </Subject>,
        );

        const button = screen.getByRole("button", { name: "Dismiss banner" });
        expect(button).toBeTruthy();
    });

    test("calls onDismiss when the dismiss button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handle = vi.fn();
        render(
            <Subject label="Promo" dismissLabel="Dismiss banner" onDismiss={handle}>
                <p>Hi</p>
            </Subject>,
        );

        await user.click(screen.getByRole("button", { name: "Dismiss banner" }));
        expect(handle).toHaveBeenCalledOnce();
    });

    test("hides the banner when open is false", () => {
        render(
            <Subject label="Promo" dismissLabel="Dismiss" open={false}>
                <p>Hi</p>
            </Subject>,
        );

        const aside = document.querySelector(".sticky-promo-banner");
        expect(aside).toBeTruthy();
        expect((aside as HTMLElement).hasAttribute("hidden")).toBe(true);
    });

    test("is visible by default", () => {
        render(
            <Subject label="Promo" dismissLabel="Dismiss">
                <p>Hi</p>
            </Subject>,
        );

        const aside = screen.getByRole("complementary");
        expect(aside.hasAttribute("hidden")).toBe(false);
    });
});
