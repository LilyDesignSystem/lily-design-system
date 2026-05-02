import { describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import Subject from "./SuperBanner.vue";

describe("SuperBanner", () => {
    test("renders a div with class super-banner", () => {
        const { container } = render(Subject, { slots: { default: "Outage" } });
        const root = container.querySelector(".super-banner");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=alert and aria-live=assertive", () => {
        render(Subject, { slots: { default: "Outage" } });
        const alert = screen.getByRole("alert");
        expect(alert.getAttribute("aria-live")).toBe("assertive");
    });

    test("renders slot content", () => {
        const { container } = render(Subject, { slots: { default: "Service is down" } });
        expect(container.textContent).toContain("Service is down");
    });

    test("does not render dismiss button by default", () => {
        render(Subject, { slots: { default: "Outage" } });
        expect(screen.queryByRole("button")).toBeNull();
    });

    test("renders dismiss button when dismissable", () => {
        render(Subject, { props: { dismissable: true }, slots: { default: "Outage" } });
        const btn = screen.getByRole("button", { name: "Dismiss" });
        expect(btn).toBeTruthy();
    });

    test("uses custom dismissLabel", () => {
        render(Subject, {
            props: { dismissable: true, dismissLabel: "Close banner" },
            slots: { default: "Outage" },
        });
        expect(screen.getByRole("button", { name: "Close banner" })).toBeTruthy();
    });

    test("emits dismiss when the dismiss button is clicked", async () => {
        const { emitted } = render(Subject, {
            props: { dismissable: true },
            slots: { default: "Outage" },
        });
        await fireEvent.click(screen.getByRole("button"));
        expect(emitted().dismiss).toBeTruthy();
    });
});
