import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Panel.vue";

describe("Panel", () => {
    test("renders as a region", () => {
        render(Subject, { props: { label: "Settings" }, slots: { default: "Content" } });
        expect(screen.getByRole("region", { name: "Settings" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Info" }, slots: { default: "C" } });
        expect(screen.getByRole("region").getAttribute("aria-label")).toBe("Info");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "P" }, slots: { default: "Panel content" } });
        expect(screen.getByRole("region").textContent).toContain("Panel content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "P", "data-testid": "pn" }, slots: { default: "C" } });
        expect(screen.getByTestId("pn")).toBeTruthy();
    });
});
