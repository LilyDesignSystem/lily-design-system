import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./InformationCallout.vue";

describe("InformationCallout", () => {
    test("renders with note role", () => {
        render(Subject, { props: { label: "Note" }, slots: { default: "Info" } });
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Important" }, slots: { default: "C" } });
        expect(screen.getByRole("note").getAttribute("aria-label")).toBe("Important");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "N" }, slots: { default: "Beta feature" } });
        expect(screen.getByRole("note").textContent).toContain("Beta feature");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "ic" }, slots: { default: "C" } });
        expect(screen.getByTestId("ic")).toBeTruthy();
    });
});
