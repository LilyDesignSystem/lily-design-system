import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./StatusLight.vue";


describe("StatusLight", () => {
    test("has status-light class on root", () => {
        render(Subject, { props: { label: "Active" } });

        const status: HTMLElement = screen.getByRole("status");
        expect(status.classList.contains("status-light")).toBe(true);
    });

    test("renders as a status role container", () => {
        render(Subject, { props: { label: "Active" } });

        const status: HTMLElement = screen.getByRole("status");
        expect(status).toBeTruthy();
    });

    test("renders the status label text", () => {
        render(Subject, { props: { label: "Offline" } });

        const labelEl: HTMLElement = screen.getByText("Offline");
        expect(labelEl.classList.contains("status-light-label")).toBe(true);
    });

    test("dot is aria-hidden", () => {
        const { container } = render(Subject, { props: { label: "Active" } });

        const dot = container.querySelector(".status-light-dot") as HTMLElement;
        expect(dot).toBeTruthy();
        expect(dot.getAttribute("aria-hidden")).toBe("true");
    });

    test("default variant is neutral", () => {
        render(Subject, { props: { label: "Active" } });

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("data-variant")).toBe("neutral");
    });

    test("variant is exposed via data-variant", () => {
        render(Subject, { props: { variant: "positive", label: "Active" } });

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("data-variant")).toBe("positive");
    });

    test("supports negative variant", () => {
        render(Subject, { props: { variant: "negative", label: "Down" } });

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("data-variant")).toBe("negative");
    });

    test("supports inactive variant", () => {
        render(Subject, { props: { variant: "inactive", label: "Idle" } });

        const status: HTMLElement = screen.getByRole("status");
        expect(status.getAttribute("data-variant")).toBe("inactive");
    });
});
