import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TabBarButton.vue";

describe("TabBarButton", () => {
    test("renders a tab", () => {
        render(Subject, { props: { controls: "panel-1" }, slots: { default: "Dashboard" } });
        expect(screen.getByRole("tab")).toBeTruthy();
    });

    test("renders as a button element", () => {
        render(Subject, { props: { controls: "panel-1" }, slots: { default: "Dashboard" } });
        expect(screen.getByRole("tab").tagName).toBe("BUTTON");
    });

    test("renders children", () => {
        render(Subject, { props: { controls: "panel-1" }, slots: { default: "Settings" } });
        expect(screen.getByRole("tab").textContent).toContain("Settings");
    });

    test("is not selected by default", () => {
        render(Subject, { props: { controls: "panel-1" }, slots: { default: "Tab" } });
        expect(screen.getByRole("tab").getAttribute("aria-selected")).toBe("false");
    });

    test("reflects selected state when true", () => {
        render(Subject, {
            props: { selected: true, controls: "panel-1" },
            slots: { default: "Tab" },
        });
        expect(screen.getByRole("tab").getAttribute("aria-selected")).toBe("true");
    });

    test("has aria-controls pointing to panel id", () => {
        render(Subject, { props: { controls: "settings-panel" }, slots: { default: "Settings" } });
        expect(screen.getByRole("tab").getAttribute("aria-controls")).toBe("settings-panel");
    });

    test("has tabindex 0 when selected", () => {
        render(Subject, {
            props: { selected: true, controls: "panel-1" },
            slots: { default: "Tab" },
        });
        expect(screen.getByRole("tab").getAttribute("tabindex")).toBe("0");
    });

    test("has tabindex -1 when not selected", () => {
        render(Subject, { props: { controls: "panel-1" }, slots: { default: "Tab" } });
        expect(screen.getByRole("tab").getAttribute("tabindex")).toBe("-1");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { controls: "panel-1", "data-testid": "my-tab" },
            slots: { default: "Tab" },
        });
        expect(screen.getByTestId("my-tab")).toBeTruthy();
    });
});
