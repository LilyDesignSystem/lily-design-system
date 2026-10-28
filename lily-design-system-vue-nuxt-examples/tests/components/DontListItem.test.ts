import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/DontListItem.vue";

describe("DontListItem", () => {
    test("renders a list item", () => {
        render(Subject, { slots: { default: "Use color alone" } });
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(Subject, { slots: { default: "Remove focus outlines" } });
        expect(screen.getByText("Remove focus outlines")).toBeTruthy();
    });

    test("sets data-recommendation to dont", () => {
        render(Subject, { slots: { default: "Skip labels" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-recommendation")).toBe("dont");
    });

    test("passes through data-testid attribute", () => {
        render(Subject, {
            props: { "data-testid": "dont-item" },
            slots: { default: "Bad practice" },
        });
        expect(screen.getByTestId("dont-item")).toBeTruthy();
        expect(screen.getByTestId("dont-item").tagName).toBe("LI");
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { id: "dont-1" }, slots: { default: "Avoid" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("dont-1");
    });

    test("passes through aria-label attribute", () => {
        render(Subject, { props: { "aria-label": "discouraged" }, slots: { default: "Avoid" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("aria-label")).toBe("discouraged");
    });
});
