import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./Figure.vue";
describe("Figure", () => {
    test("renders img role", () => {
        render(Subject, { props: { label: "Sales" }, slots: { default: "bars" } });
        expect(screen.getByRole("img")).toBeTruthy();
    });
    test("uses figure element", () => {
        render(Subject, { props: { label: "Sales" }, slots: { default: "bars" } });
        expect(screen.getByRole("img").tagName).toBe("FIGURE");
    });
    test("has aria-label", () => {
        render(Subject, { props: { label: "Monthly sales" }, slots: { default: "bars" } });
        expect(screen.getByLabelText("Monthly sales")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "C", "data-testid": "ch" }, slots: { default: "x" } });
        expect(screen.getByTestId("ch")).toBeTruthy();
    });
});
