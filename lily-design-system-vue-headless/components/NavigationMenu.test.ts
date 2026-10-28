import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./NavigationMenu.vue";

describe("NavigationMenu", () => {
    test("renders a navigation landmark", () => {
        render(Subject, { props: { label: "Main" }, slots: { default: "content" } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Main navigation" }, slots: { default: "content" } });
        expect(screen.getByLabelText("Main navigation")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Nav" }, slots: { default: "Home" } });
        expect(screen.getByText("Home")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "nm" }, slots: { default: "x" } });
        expect(screen.getByTestId("nm")).toBeTruthy();
    });
});
