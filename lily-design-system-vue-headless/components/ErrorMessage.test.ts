import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ErrorMessage.vue";

describe("ErrorMessage", () => {
    test("renders with alert role", () => {
        render(Subject, { slots: { default: "Error occurred" } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("displays error text", () => {
        render(Subject, { slots: { default: "Field is required" } });
        expect(screen.getByRole("alert").textContent).toContain("Field is required");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "err" }, slots: { default: "E" } });
        expect(screen.getByTestId("err")).toBeTruthy();
    });
});
