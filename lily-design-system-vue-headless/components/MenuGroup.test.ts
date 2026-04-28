import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./MenuGroup.vue";


describe("MenuGroup", () => {
    test("renders as a group with aria-label", () => {
        render(Subject, { props: { label: "View" }, slots: { default: "<button>Item</button>" } });

        const group: HTMLElement = screen.getByRole("group", { name: "View" });
        expect(group).toBeTruthy();
    });

    test("has menu-group class on root", () => {
        render(Subject, { props: { label: "View" }, slots: { default: "<button>Item</button>" } });

        const group: HTMLElement = screen.getByRole("group");
        expect(group.classList.contains("menu-group")).toBe(true);
    });

    test("renders the visible heading text", () => {
        render(Subject, { props: { label: "View" }, slots: { default: "<button>Item</button>" } });

        const heading: HTMLElement = screen.getByText("View");
        expect(heading).toBeTruthy();
        expect(heading.classList.contains("menu-group-heading")).toBe(true);
    });

    test("heading is aria-hidden", () => {
        render(Subject, { props: { label: "View" }, slots: { default: "<button>Item</button>" } });

        const heading: HTMLElement = screen.getByText("View");
        expect(heading.getAttribute("aria-hidden")).toBe("true");
    });

    test("renders default slot children", () => {
        render(Subject, {
            props: { label: "View" },
            slots: { default: "<button>Zoom in</button>" },
        });

        expect(screen.getByText("Zoom in")).toBeTruthy();
    });

    test("aria-label matches the label prop", () => {
        render(Subject, { props: { label: "Edit actions" }, slots: { default: "<span>x</span>" } });

        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("aria-label")).toBe("Edit actions");
    });
});
