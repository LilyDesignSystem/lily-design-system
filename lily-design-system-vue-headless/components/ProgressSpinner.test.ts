import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ProgressSpinner.vue";

describe("ProgressSpinner", () => {
    test("renders with status role", () => {
        render(Subject, { props: { label: "Loading" } });
        expect(screen.getByRole("status")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Loading data" } });
        expect(screen.getByLabelText("Loading data")).toBeTruthy();
    });

    test("has polite aria-live", () => {
        render(Subject, { props: { label: "Loading", "data-testid": "ps" } });
        expect(screen.getByTestId("ps").getAttribute("aria-live")).toBe("polite");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "L" }, slots: { default: "Please wait" } });
        expect(screen.getByRole("status").textContent).toContain("Please wait");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "L", "data-testid": "ps" } });
        expect(screen.getByTestId("ps")).toBeTruthy();
    });
});
