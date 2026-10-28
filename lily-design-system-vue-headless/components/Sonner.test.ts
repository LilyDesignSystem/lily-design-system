import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./Sonner.vue";
describe("Sonner", () => {
    test("renders a region", () => {
        render(Subject, { props: { label: "Notifications" }, slots: { default: "toast" } });
        expect(screen.getByRole("region")).toBeTruthy();
    });
    test("has aria-live", () => {
        render(Subject, { props: { label: "Notifications" }, slots: { default: "toast" } });
        expect(screen.getByRole("region").getAttribute("aria-live")).toBe("polite");
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "sn" }, slots: { default: "x" } });
        expect(screen.getByTestId("sn")).toBeTruthy();
    });
});
