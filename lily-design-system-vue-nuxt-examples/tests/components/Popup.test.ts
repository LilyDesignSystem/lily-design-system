import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/Popup.vue";

describe("Popup", () => {
    test("hidden when closed", () => {
        render(Subject, { props: { label: "Info", open: false }, slots: { default: "C" } });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open", () => {
        render(Subject, { props: { label: "Info", open: true }, slots: { default: "C" } });
        expect(screen.getByRole("dialog", { name: "Info" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "I", open: true }, slots: { default: "Content" } });
        expect(screen.getByRole("dialog").textContent).toContain("Content");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "My Popup", open: true }, slots: { default: "C" } });
        expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("My Popup");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "I", open: true, "data-testid": "pu" },
            slots: { default: "C" },
        });
        expect(screen.getByTestId("pu")).toBeTruthy();
    });
});
