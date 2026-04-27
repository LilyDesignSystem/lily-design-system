import { render, screen } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Cascader.vue";


describe("Cascader", () => {
    test("renders with cascader class and combobox role", () => {
        const { container } = render(Subject, { props: { label: "Region" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.classList.contains("cascader")).toBe(true);
        expect(root.getAttribute("role")).toBe("combobox");
    });

    test("sets aria-haspopup tree and aria-label", () => {
        const { container } = render(Subject, { props: { label: "Region" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-haspopup")).toBe("tree");
        expect(root.getAttribute("aria-label")).toBe("Region");
    });

    test("aria-expanded false by default", () => {
        const { container } = render(Subject, { props: { label: "Region" } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-expanded")).toBe("false");
    });

    test("aria-expanded true when expanded", () => {
        const { container } = render(Subject, { props: { label: "Region", expanded: true } });

        const root: HTMLElement = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("aria-expanded")).toBe("true");
    });

    test("renders trigger button with placeholder when no value", () => {
        render(Subject, { props: { label: "Region", placeholder: "Select…" } });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.classList.contains("cascader-trigger")).toBe(true);
        expect(trigger.textContent).toContain("Select…");
    });

    test("renders trigger button with value when provided", () => {
        render(Subject, { props: { label: "Region", value: "USA / California", placeholder: "Select…" } });

        const trigger: HTMLElement = screen.getByRole("button");
        expect(trigger.textContent).toContain("USA / California");
    });

    test("trigger respects disabled prop", () => {
        render(Subject, { props: { label: "Region", disabled: true } });

        const trigger: HTMLButtonElement = screen.getByRole("button") as HTMLButtonElement;
        expect(trigger.disabled).toBe(true);
    });

    test("renders panel content from default slot", () => {
        const { container } = render(Subject, {
            props: { label: "Region", expanded: true },
            slots: { default: "<ul role=\"tree\"><li>Item</li></ul>" },
        });

        expect(container.textContent).toContain("Item");
    });

    test("panel is hidden when not expanded", () => {
        const { container } = render(Subject, { props: { label: "Region" } });

        const panel: HTMLElement = container.querySelector(".cascader-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("panel is not hidden when expanded", () => {
        const { container } = render(Subject, { props: { label: "Region", expanded: true } });

        const panel: HTMLElement = container.querySelector(".cascader-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("emits click when trigger activated", async () => {
        const user: UserEvent = userEvent.setup();
        const onClick = vi.fn();
        render(Subject, { props: { label: "Region", onClick } });

        const trigger: HTMLElement = screen.getByRole("button");
        await user.click(trigger);
        expect(onClick).toHaveBeenCalledOnce();
    });
});
