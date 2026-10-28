import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Notification.vue";

describe("Notification", () => {
    test("renders with status role by default", () => {
        render(Subject, { slots: { default: "Saved" } });
        expect(screen.getByRole("status")).toBeTruthy();
    });

    test("renders with alert role when urgent", () => {
        render(Subject, { props: { urgent: true }, slots: { default: "Error" } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("has polite live region by default", () => {
        render(Subject, { props: { "data-testid": "n" }, slots: { default: "Info" } });
        expect(screen.getByTestId("n").getAttribute("aria-live")).toBe("polite");
    });

    test("has assertive live region when urgent", () => {
        render(Subject, { props: { urgent: true, "data-testid": "n" }, slots: { default: "E" } });
        expect(screen.getByTestId("n").getAttribute("aria-live")).toBe("assertive");
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "Changes saved" } });
        expect(screen.getByRole("status").textContent).toContain("Changes saved");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "n" }, slots: { default: "C" } });
        expect(screen.getByTestId("n")).toBeTruthy();
    });
});
