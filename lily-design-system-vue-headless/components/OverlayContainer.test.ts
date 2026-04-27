import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./OverlayContainer.vue";


describe("OverlayContainer", () => {
    test("has overlay-container class on root", () => {
        render(Subject, {
            props: { open: true, "data-testid": "ov" },
            slots: { default: "Hello" },
        });

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.classList.contains("overlay-container")).toBe(true);
    });

    test("renders with role presentation", () => {
        render(Subject, {
            props: { open: true, "data-testid": "ov" },
            slots: { default: "Hello" },
        });

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.getAttribute("role")).toBe("presentation");
    });

    test("defaults to closed (hidden, aria-hidden true)", () => {
        render(Subject, {
            props: { "data-testid": "ov" },
            slots: { default: "Hello" },
        });

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.getAttribute("data-open")).toBe("false");
        expect(el.getAttribute("aria-hidden")).toBe("true");
        expect(el.hasAttribute("hidden")).toBe(true);
    });

    test("when open, removes hidden and aria-hidden=false", () => {
        render(Subject, {
            props: { open: true, "data-testid": "ov" },
            slots: { default: "Hello" },
        });

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.getAttribute("data-open")).toBe("true");
        expect(el.getAttribute("aria-hidden")).toBe("false");
        expect(el.hasAttribute("hidden")).toBe(false);
    });

    test("renders default slot when open", () => {
        render(Subject, {
            props: { open: true },
            slots: { default: "Modal content" },
        });

        expect(screen.getByText("Modal content")).toBeTruthy();
    });

    test("applies aria-label when provided", () => {
        render(Subject, {
            props: { open: true, label: "Backdrop", "data-testid": "ov" },
            slots: { default: "Hello" },
        });

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.getAttribute("aria-label")).toBe("Backdrop");
    });

    test("emits click on backdrop activation", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(Subject, {
            props: { open: true, "data-testid": "ov", onClick },
            slots: { default: "Modal" },
        });

        const el: HTMLElement = screen.getByTestId("ov");
        await user.click(el);
        expect(onClick).toHaveBeenCalledOnce();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: { open: true, id: "ov-1", "data-testid": "ov" },
            slots: { default: "Hello" },
        });

        const el: HTMLElement = screen.getByTestId("ov");
        expect(el.getAttribute("id")).toBe("ov-1");
    });
});
