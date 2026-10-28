import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Drawer.vue";

describe("Drawer", () => {
    test("hidden when open is false", () => {
        render(Subject, { props: { label: "Nav", open: false }, slots: { default: "Content" } });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open is true", () => {
        render(Subject, { props: { label: "Nav", open: true }, slots: { default: "Content" } });
        expect(screen.getByRole("dialog", { name: "Nav" })).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(Subject, { props: { label: "Nav", open: true }, slots: { default: "C" } });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(Subject, {
            props: { label: "Nav", open: true, side: "right" },
            slots: { default: "C" },
        });
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("right");
    });

    test("defaults to left side", () => {
        render(Subject, { props: { label: "Nav", open: true }, slots: { default: "C" } });
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("Escape closes the drawer", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Nav", open: true }, slots: { default: "C" } });
        screen.getByRole("dialog").focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("renders children", () => {
        render(Subject, {
            props: { label: "Nav", open: true },
            slots: { default: "Drawer content" },
        });
        expect(screen.getByRole("dialog").textContent).toContain("Drawer content");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Nav", open: true, "data-testid": "dr" },
            slots: { default: "C" },
        });
        expect(screen.getByTestId("dr")).toBeTruthy();
    });
});
