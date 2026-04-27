import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./GovernmentBanner.vue";


const baseProps = {
    label: "Official government website",
    headerText: "An official website of the United States government",
    expandLabel: "Here's how you know",
};


describe("GovernmentBanner", () => {
    test("renders as a complementary landmark with aria-label", () => {
        render(Subject, { props: baseProps });

        const aside: HTMLElement = screen.getByRole("complementary", { name: baseProps.label });
        expect(aside).toBeTruthy();
    });

    test("has government-banner class on root", () => {
        render(Subject, { props: baseProps });

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.classList.contains("government-banner")).toBe(true);
    });

    test("renders header text", () => {
        render(Subject, { props: baseProps });

        expect(screen.getByText(baseProps.headerText)).toBeTruthy();
    });

    test("renders toggle button with expand label", () => {
        render(Subject, { props: baseProps });

        const button: HTMLElement = screen.getByRole("button", { name: baseProps.expandLabel });
        expect(button).toBeTruthy();
    });

    test("toggle button defaults to aria-expanded=false", () => {
        render(Subject, { props: baseProps });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("toggle button reflects expanded prop", () => {
        render(Subject, { props: { ...baseProps, expanded: true } });

        const button: HTMLElement = screen.getByRole("button");
        expect(button.getAttribute("aria-expanded")).toBe("true");
    });

    test("toggle button aria-controls references the panel id", () => {
        const { container } = render(Subject, { props: baseProps });

        const button: HTMLElement = screen.getByRole("button");
        const controls: string | null = button.getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        const panel: HTMLElement | null = container.querySelector(`#${controls}`);
        expect(panel).toBeTruthy();
    });

    test("panel is hidden when not expanded", () => {
        const { container } = render(Subject, { props: baseProps });

        const panel: HTMLElement | null = container.querySelector(".government-banner-details");
        expect(panel?.hasAttribute("hidden")).toBe(true);
    });

    test("panel is visible when expanded", () => {
        const { container } = render(Subject, { props: { ...baseProps, expanded: true } });

        const panel: HTMLElement | null = container.querySelector(".government-banner-details");
        expect(panel?.hasAttribute("hidden")).toBe(false);
    });

    test("renders default slot content in panel", () => {
        render(Subject, {
            props: { ...baseProps, expanded: true },
            slots: { default: "<p>Why .gov matters</p>" },
        });

        expect(screen.getByText("Why .gov matters")).toBeTruthy();
    });

    test("emits toggle on button click", async () => {
        const user: UserEvent = userEvent.setup();
        const onToggle = vi.fn();
        render(Subject, { props: { ...baseProps, onToggle } });

        const button: HTMLElement = screen.getByRole("button");
        await user.click(button);
        expect(onToggle).toHaveBeenCalledOnce();
    });
});
