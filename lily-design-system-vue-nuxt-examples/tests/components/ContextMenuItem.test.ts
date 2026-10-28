import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ContextMenuItem.vue";

describe("ContextMenuItem", () => {
    test("renders a div with menuitem role", () => {
        render(Subject, { slots: { default: "Cut" } });

        const item = screen.getByRole("menuitem");
        expect(item.tagName).toBe("DIV");
    });

    test("displays children content", () => {
        render(Subject, { slots: { default: "Copy" } });

        const item = screen.getByRole("menuitem");
        expect(item.textContent).toContain("Copy");
    });

    test("has tabindex -1 for roving focus", () => {
        render(Subject, { slots: { default: "Paste" } });

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("tabindex")).toBe("-1");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "ctx-item" }, slots: { default: "Delete" } });

        const item = screen.getByTestId("ctx-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { id: "ctx-cut" }, slots: { default: "Cut" } });

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("id")).toBe("ctx-cut");
    });

    test("supports aria-disabled attribute", () => {
        render(Subject, { props: { "aria-disabled": "true" }, slots: { default: "Delete" } });

        const item = screen.getByRole("menuitem");
        expect(item.getAttribute("aria-disabled")).toBe("true");
    });
});
