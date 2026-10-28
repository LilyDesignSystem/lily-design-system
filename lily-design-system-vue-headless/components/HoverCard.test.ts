import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./HoverCard.vue";

describe("HoverCard", () => {
    test("hidden when closed", () => {
        render(Subject, { props: { label: "Info", open: false }, slots: { default: "C" } });
        expect(screen.queryByRole("tooltip")).toBeNull();
    });

    test("visible when open", () => {
        render(Subject, { props: { label: "Info", open: true }, slots: { default: "C" } });
        expect(screen.getByRole("tooltip", { name: "Info" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Info", open: true }, slots: { default: "Details" } });
        expect(screen.getByRole("tooltip").textContent).toContain("Details");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "I", open: true, "data-testid": "hc" },
            slots: { default: "C" },
        });
        expect(screen.getByTestId("hc")).toBeTruthy();
    });
});
