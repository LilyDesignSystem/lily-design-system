import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./Icon.vue";
describe("Icon", () => {
    test("meaningful icon has img role", () => {
        render(Subject, { props: { label: "Close" }, slots: { default: "×" } });
        expect(screen.getByRole("img", { name: "Close" })).toBeTruthy();
    });
    test("decorative icon is aria-hidden", () => {
        render(Subject, {
            props: { decorative: true, "data-testid": "ic" },
            slots: { default: "★" },
        });
        expect(screen.getByTestId("ic").getAttribute("aria-hidden")).toBe("true");
    });
    test("renders children", () => {
        render(Subject, { props: { label: "Star" }, slots: { default: "★" } });
        expect(screen.getByRole("img").textContent).toBe("★");
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "X", "data-testid": "ic" }, slots: { default: "×" } });
        expect(screen.getByTestId("ic")).toBeTruthy();
    });
});
