import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./Sparkline.vue";
describe("Sparkline", () => {
    test("renders img role", () => {
        render(Subject, { props: { label: "Trend" }, slots: { default: "chart" } });
        expect(screen.getByRole("img")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(Subject, { props: { label: "Price trend" }, slots: { default: "chart" } });
        expect(screen.getByLabelText("Price trend")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "sl" }, slots: { default: "x" } });
        expect(screen.getByTestId("sl")).toBeTruthy();
    });
});
