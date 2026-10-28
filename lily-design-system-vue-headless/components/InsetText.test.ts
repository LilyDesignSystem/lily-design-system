import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./InsetText.vue";

describe("InsetText", () => {
    test("renders with note role", () => {
        render(Subject, { slots: { default: "Important" } });
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { slots: { default: "8 weeks to process" } });
        expect(screen.getByRole("note").textContent).toContain("8 weeks to process");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "it" }, slots: { default: "C" } });
        expect(screen.getByTestId("it")).toBeTruthy();
    });
});
