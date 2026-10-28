import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/MenuItem.vue";

describe("MenuItem", () => {
    test("renders a div with menuitem role", () => {
        render(Subject, { slots: { default: "New File" } });

        const item = screen.getByRole("menuitem");
        expect(item.tagName).toBe("DIV");
    });

    test("displays children content", () => {
        render(Subject, { slots: { default: "Open File" } });

        const item = screen.getByRole("menuitem");
        expect(item.textContent).toContain("Open File");
    });

    test("has tabindex -1 for roving focus", () => {
        render(Subject, { slots: { default: "Save" } });

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("tabindex")).toBe("-1");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "menu-item" }, slots: { default: "Exit" } });

        const item = screen.getByTestId("menu-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { id: "menu-save" }, slots: { default: "Save" } });

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("id")).toBe("menu-save");
    });

    test("supports aria-disabled attribute", () => {
        render(Subject, { props: { "aria-disabled": "true" }, slots: { default: "Undo" } });

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-disabled")).toBe("true");
    });

    test("supports aria-haspopup for submenu triggers", () => {
        render(Subject, { props: { "aria-haspopup": "true" }, slots: { default: "More Options" } });

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-haspopup")).toBe("true");
    });
});
