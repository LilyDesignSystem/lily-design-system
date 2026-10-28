import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/ScrollArea.vue";

describe("ScrollArea", () => {
    test("renders a region", () => {
        render(Subject, { props: { label: "Content" }, slots: { default: "text" } });
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Scrollable" }, slots: { default: "text" } });
        expect(screen.getByLabelText("Scrollable")).toBeTruthy();
    });

    test("has tabindex for keyboard scrolling", () => {
        render(Subject, { props: { label: "Content" }, slots: { default: "text" } });
        expect(screen.getByRole("region").getAttribute("tabindex")).toBe("0");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Content" }, slots: { default: "Long text" } });
        expect(screen.getByText("Long text")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "C", "data-testid": "sa" }, slots: { default: "x" } });
        expect(screen.getByTestId("sa")).toBeTruthy();
    });
});
