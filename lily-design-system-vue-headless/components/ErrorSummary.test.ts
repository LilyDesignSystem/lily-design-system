import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ErrorSummary.vue";

describe("ErrorSummary", () => {
    test("renders with alert role", () => {
        render(Subject, { props: { title: "Errors" }, slots: { default: "Fix these" } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("displays title as heading", () => {
        render(Subject, { props: { title: "There are errors" }, slots: { default: "List" } });
        expect(screen.getByRole("heading", { name: "There are errors" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { title: "Errors" }, slots: { default: "Name is required" } });
        expect(screen.getByRole("alert").textContent).toContain("Name is required");
    });

    test("is focusable", () => {
        render(Subject, { props: { title: "Errors" }, slots: { default: "Fix" } });
        const alert = screen.getByRole("alert");
        alert.focus();
        expect(document.activeElement).toBe(alert);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { title: "E", "data-testid": "es" }, slots: { default: "C" } });
        expect(screen.getByTestId("es")).toBeTruthy();
    });
});
