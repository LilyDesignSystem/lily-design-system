import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";
import Subject from "./SignaturePad.vue";
describe("SignaturePad", () => {
    test("renders application role", () => {
        render(Subject, { props: { label: "Signature" }, slots: { default: "canvas" } });
        expect(screen.getByRole("application")).toBeTruthy();
    });
    test("has aria-label", () => {
        render(Subject, { props: { label: "Sign here" }, slots: { default: "canvas" } });
        expect(screen.getByLabelText("Sign here")).toBeTruthy();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "sp" }, slots: { default: "x" } });
        expect(screen.getByTestId("sp")).toBeTruthy();
    });
});
