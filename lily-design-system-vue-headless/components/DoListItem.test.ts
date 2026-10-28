import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./DoListItem.vue";

describe("DoListItem", () => {
    test("renders a list item", () => {
        render(Subject, { slots: { default: "Use semantic HTML" } });
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(Subject, { slots: { default: "Provide alt text" } });
        expect(screen.getByText("Provide alt text")).toBeTruthy();
    });

    test("sets data-recommendation to do", () => {
        render(Subject, { slots: { default: "Use labels" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-recommendation")).toBe("do");
    });

    test("passes through data-testid attribute", () => {
        render(Subject, { props: { "data-testid": "do-item" }, slots: { default: "Tip" } });
        expect(screen.getByTestId("do-item")).toBeTruthy();
        expect(screen.getByTestId("do-item").tagName).toBe("LI");
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { id: "do-1" }, slots: { default: "Tip" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("do-1");
    });

    test("passes through aria-label attribute", () => {
        render(Subject, { props: { "aria-label": "recommended" }, slots: { default: "Tip" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("aria-label")).toBe("recommended");
    });
});
