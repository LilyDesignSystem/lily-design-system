import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionGroup.vue";


describe("ActionGroup", () => {
    test("renders as a group with aria-label", () => {
        render(Subject, { props: { label: "Toolbar" }, slots: { default: "<button>One</button>" } });

        const group: HTMLElement = screen.getByRole("group", { name: "Toolbar" });
        expect(group).toBeTruthy();
    });

    test("has action-group class on root", () => {
        render(Subject, { props: { label: "Toolbar" }, slots: { default: "<button>One</button>" } });

        const group: HTMLElement = screen.getByRole("group");
        expect(group.classList.contains("action-group")).toBe(true);
    });

    test("renders default slot children", () => {
        render(Subject, { props: { label: "Toolbar" }, slots: { default: "<button>One</button>" } });

        expect(screen.getByText("One")).toBeTruthy();
    });

    test("does not render overflow trigger when overflow slot is omitted", () => {
        render(Subject, { props: { label: "Toolbar" }, slots: { default: "<span>One</span>" } });

        expect(screen.queryByRole("button")).toBeNull();
    });

    test("renders overflow trigger when overflow slot is provided", () => {
        render(Subject, {
            props: { label: "Toolbar", overflowLabel: "More actions" },
            slots: { default: "<span>One</span>", overflow: "<span>menu</span>" },
        });

        const trigger: HTMLElement = screen.getByRole("button", { name: "More actions" });
        expect(trigger).toBeTruthy();
        expect(trigger.classList.contains("action-group-overflow-trigger")).toBe(true);
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    });

    test("trigger reflects overflowOpen via aria-expanded (closed)", () => {
        render(Subject, {
            props: { label: "Toolbar", overflowLabel: "More actions", overflowOpen: false },
            slots: { default: "<span>One</span>", overflow: "<span>menu</span>" },
        });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    test("trigger reflects overflowOpen via aria-expanded (open)", () => {
        render(Subject, {
            props: { label: "Toolbar", overflowLabel: "More actions", overflowOpen: true },
            slots: { default: "<span>One</span>", overflow: "<span>menu-open</span>" },
        });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByText("menu-open")).toBeTruthy();
    });

    test("emits overflowToggle when trigger is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const onOverflowToggle = vi.fn();
        render(Subject, {
            props: { label: "Toolbar", overflowLabel: "More actions", onOverflowToggle },
            slots: { default: "<span>One</span>", overflow: "<span>menu</span>" },
        });

        await user.click(screen.getByRole("button", { name: "More actions" }));
        expect(onOverflowToggle).toHaveBeenCalledOnce();
    });
});
