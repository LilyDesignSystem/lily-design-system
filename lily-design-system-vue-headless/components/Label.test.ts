import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Label.vue";

describe("Label", () => {
    test("renders label text", () => {
        render(Subject, { slots: { default: "Email" } });
        expect(screen.getByText("Email")).toBeTruthy();
    });

    test("has for attribute", () => {
        render(Subject, {
            props: { for: "email-input", "data-testid": "lbl" },
            slots: { default: "Email" },
        });
        expect(screen.getByTestId("lbl").getAttribute("for")).toBe("email-input");
    });

    test("renders as label element", () => {
        render(Subject, { props: { "data-testid": "lbl" }, slots: { default: "Name" } });
        expect(screen.getByTestId("lbl").tagName).toBe("LABEL");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "lbl" }, slots: { default: "X" } });
        expect(screen.getByTestId("lbl")).toBeTruthy();
    });
});
