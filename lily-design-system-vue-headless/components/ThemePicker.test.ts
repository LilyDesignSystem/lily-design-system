import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeSelect.vue";


describe("ThemeSelect", () => {
    test("renders a radiogroup", () => {
        render(Subject, { props: { label: "Theme" }, slots: { default: "options" } });
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Choose theme" }, slots: { default: "options" } });
        expect(screen.getByLabelText("Choose theme")).toBeTruthy();
    });

    test("uses fieldset element", () => {
        render(Subject, { props: { label: "Theme" }, slots: { default: "options" } });
        expect(screen.getByRole("radiogroup").tagName).toBe("FIELDSET");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", "data-testid": "tp" }, slots: { default: "x" } });
        expect(screen.getByTestId("tp")).toBeTruthy();
    });
});
