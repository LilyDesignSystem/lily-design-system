import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TreeSelect.vue";


describe("TreeSelect", () => {
    test("renders root with tree-select class and combobox role", () => {
        const { container } = render(Subject, { props: { label: "Department" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.classList.contains("tree-select")).toBe(true);
        expect(root.getAttribute("role")).toBe("combobox");
    });

    test("aria-haspopup tree and aria-label", () => {
        const { container } = render(Subject, { props: { label: "Department" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-haspopup")).toBe("tree");
        expect(root.getAttribute("aria-label")).toBe("Department");
    });

    test("aria-expanded false by default", () => {
        const { container } = render(Subject, { props: { label: "Department" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-expanded")).toBe("false");
    });

    test("aria-expanded true when expanded", () => {
        const { container } = render(Subject, { props: { label: "Department", expanded: true } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-expanded")).toBe("true");
    });

    test("aria-multiselectable true when multiple", () => {
        const { container } = render(Subject, { props: { label: "Department", multiple: true } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-multiselectable")).toBe("true");
    });

    test("no aria-multiselectable when not multiple", () => {
        const { container } = render(Subject, { props: { label: "Department" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-multiselectable")).toBeNull();
    });

    test("renders trigger with placeholder when no value", () => {
        render(Subject, { props: { label: "Department", placeholder: "Choose…" } });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.classList.contains("tree-select-trigger")).toBe(true);
        expect(trigger.textContent).toContain("Choose…");
    });

    test("renders trigger with value when provided", () => {
        render(Subject, { props: { label: "Department", value: "Engineering / Web", placeholder: "Choose…" } });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.textContent).toContain("Engineering / Web");
    });

    test("trigger respects disabled prop", () => {
        render(Subject, { props: { label: "Department", disabled: true } });

        const trigger: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(trigger.disabled).toBe(true);
    });

    test("renders panel slot content", () => {
        const { container } = render(Subject, {
            props: { label: "Department", expanded: true },
            slots: { default: "<ul role=\"tree\"><li>Engineering</li></ul>" },
        });

        expect(container.textContent).toContain("Engineering");
    });

    test("panel hidden when not expanded", () => {
        const { container } = render(Subject, { props: { label: "Department" } });

        const panel: HTMLElement = container.querySelector(".tree-select-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("emits click when trigger activated", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(Subject, { props: { label: "Department", onClick } });

        const trigger: HTMLElement = screen.getByRole("button");
        await user.click(trigger);
        expect(onClick).toHaveBeenCalledOnce();
    });
});
