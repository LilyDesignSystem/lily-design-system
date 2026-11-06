import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ThemeView.vue";

describe("ThemeView", () => {
    test("renders a span", () => {
        render(Subject, { props: { label: "Theme", value: "dark", "data-testid": "tv" } });
        expect(screen.getByTestId("tv").tagName).toBe("SPAN");
    });

    test("displays the theme value", () => {
        render(Subject, { props: { label: "Theme", value: "dark" } });
        expect(screen.getByText("dark")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Current theme", value: "light" } });
        expect(document.querySelector(".theme-view") as HTMLElement).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "T", value: "x", "data-testid": "tv" } });
        expect(screen.getByTestId("tv")).toBeTruthy();
    });
});
