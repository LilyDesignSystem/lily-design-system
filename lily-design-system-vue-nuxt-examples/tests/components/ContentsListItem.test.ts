import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ContentsListItem.vue";

describe("ContentsListItem", () => {
    test("renders a list item element", () => {
        render(Subject, { slots: { default: "Introduction" } });

        const item = screen.getByRole("listitem");
        expect(item.tagName).toBe("LI");
    });

    test("renders children content", () => {
        render(Subject, { slots: { default: "Chapter 1" } });

        const item = screen.getByRole("listitem");
        expect(item.textContent).toContain("Chapter 1");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { "data-testid": "toc-item" }, slots: { default: "Section" } });

        const item = screen.getByTestId("toc-item");
        expect(item).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { id: "item-1" }, slots: { default: "Section" } });

        const item = screen.getByRole("listitem");
        expect(item.getAttribute("id")).toBe("item-1");
    });

    test("passes through aria-current attribute", () => {
        render(Subject, { props: { "aria-current": "page" }, slots: { default: "Current page" } });

        const item = screen.getByRole("listitem");
        expect(item.getAttribute("aria-current")).toBe("page");
    });
});
