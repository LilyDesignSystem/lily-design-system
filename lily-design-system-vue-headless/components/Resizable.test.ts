import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./Resizable.vue";

describe("Resizable", () => {
    test("renders a region", () => {
        render(Subject, { props: { label: "Panel" }, slots: { default: "content" } });
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Resizable panel" }, slots: { default: "content" } });
        expect(screen.getByLabelText("Resizable panel")).toBeTruthy();
    });

    test("defaults to both direction", () => {
        render(Subject, { props: { label: "Panel" }, slots: { default: "content" } });
        expect(screen.getByRole("region").getAttribute("data-resize")).toBe("both");
    });

    test("supports horizontal direction", () => {
        render(Subject, {
            props: { label: "Panel", direction: "horizontal" },
            slots: { default: "x" },
        });
        expect(screen.getByRole("region").getAttribute("data-resize")).toBe("horizontal");
    });

    test("is keyboard focusable", () => {
        render(Subject, { props: { label: "Panel" }, slots: { default: "content" } });
        expect(screen.getByRole("region").getAttribute("tabindex")).toBe("0");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "P", "data-testid": "rs" }, slots: { default: "x" } });
        expect(screen.getByTestId("rs")).toBeTruthy();
    });
});
