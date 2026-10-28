import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./FloatingPanel.vue";

describe("FloatingPanel", () => {
    test("hidden when open is false", () => {
        render(Subject, { props: { label: "Panel", open: false }, slots: { default: "C" } });
        expect(screen.queryByRole("region")).toBeNull();
    });

    test("visible when open is true", () => {
        render(Subject, { props: { label: "Panel", open: true }, slots: { default: "C" } });
        expect(screen.getByRole("region", { name: "Panel" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Panel", open: true }, slots: { default: "Content" } });
        expect(screen.getByRole("region").textContent).toContain("Content");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "P", open: true, "data-testid": "fp" },
            slots: { default: "C" },
        });
        expect(screen.getByTestId("fp")).toBeTruthy();
    });
});
