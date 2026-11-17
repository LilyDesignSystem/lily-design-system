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

    test("below minimumPoints it shows the consumer's words as text, not the graphic", () => {
        const { container } = render(Subject, {
            props: {
                label: "Weight trend",
                pointCount: 2,
                minimumPoints: 3,
                insufficientLabel: "Not enough readings for a trend",
            },
            slots: { default: "<svg />" },
        });
        const root = container.querySelector(".sparkline") as HTMLElement;
        expect(root.hasAttribute("data-insufficient")).toBe(true);
        expect(root.getAttribute("role")).toBeNull();
        expect(root.querySelector("svg")).toBeNull();
        expect(root.querySelector(".sparkline-insufficient")?.textContent).toBe(
            "Not enough readings for a trend",
        );
    });
});
