import { render } from "@testing-library/vue";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./AccordionCheckbox.vue";

describe("AccordionCheckbox", () => {
    test("renders the root div with class accordion-checkbox", () => {
        const { container } = render(Subject, {
            props: { label: "Show" },
            slots: { default: "Body" },
        });
        expect(container.querySelector(".accordion-checkbox")).toBeTruthy();
    });

    test("renders an input.accordion-checkbox-input of type checkbox", () => {
        const { container } = render(Subject, {
            props: { label: "Show" },
            slots: { default: "Body" },
        });
        const input = container.querySelector(
            ".accordion-checkbox-input"
        ) as HTMLInputElement;
        expect(input).toBeTruthy();
        expect(input.type).toBe("checkbox");
    });

    test("renders the label with for matching the checkbox id", () => {
        const { container } = render(Subject, {
            props: { label: "Show options" },
            slots: { default: "Body" },
        });
        const input = container.querySelector(".accordion-checkbox-input") as HTMLInputElement;
        const label = container.querySelector(".accordion-checkbox-label") as HTMLLabelElement;
        expect(label.textContent?.trim()).toBe("Show options");
        expect(label.htmlFor).toBe(input.id);
    });

    test("links aria-controls to the panel id", () => {
        const { container } = render(Subject, {
            props: { label: "Show" },
            slots: { default: "Body" },
        });
        const input = container.querySelector(".accordion-checkbox-input") as HTMLInputElement;
        const panel = container.querySelector(".accordion-checkbox-panel") as HTMLElement;
        expect(input.getAttribute("aria-controls")).toBe(panel.id);
    });

    test("the panel has role=region and aria-labelledby pointing at the checkbox", () => {
        const { container } = render(Subject, {
            props: { label: "Show" },
            slots: { default: "Body" },
        });
        const input = container.querySelector(".accordion-checkbox-input") as HTMLInputElement;
        const panel = container.querySelector(".accordion-checkbox-panel") as HTMLElement;
        expect(panel.getAttribute("role")).toBe("region");
        expect(panel.getAttribute("aria-labelledby")).toBe(input.id);
    });

    test("the panel is hidden by default", () => {
        const { container } = render(Subject, {
            props: { label: "Show" },
            slots: { default: "Hidden body" },
        });
        const input = container.querySelector(".accordion-checkbox-input") as HTMLInputElement;
        const panel = container.querySelector(".accordion-checkbox-panel") as HTMLElement;
        expect(input.checked).toBe(false);
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hidden).toBe(true);
    });

    test("the panel is visible when initially checked", () => {
        const { container } = render(Subject, {
            props: { label: "Show", checked: true },
            slots: { default: "Visible body" },
        });
        const input = container.querySelector(".accordion-checkbox-input") as HTMLInputElement;
        const panel = container.querySelector(".accordion-checkbox-panel") as HTMLElement;
        expect(input.checked).toBe(true);
        expect(input.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hidden).toBe(false);
    });

    test("toggling reveals and hides the panel", async () => {
        const user: UserEvent = userEvent.setup();
        const { container } = render(Subject, {
            props: { label: "Show" },
            slots: { default: "Body" },
        });
        const input = container.querySelector(".accordion-checkbox-input") as HTMLInputElement;
        const panel = container.querySelector(".accordion-checkbox-panel") as HTMLElement;

        await user.click(input);
        expect(input.checked).toBe(true);
        expect(panel.hidden).toBe(false);

        await user.click(input);
        expect(input.checked).toBe(false);
        expect(panel.hidden).toBe(true);
    });

    test("Space key toggles the checkbox", async () => {
        const user: UserEvent = userEvent.setup();
        const { container } = render(Subject, {
            props: { label: "Show" },
            slots: { default: "Body" },
        });
        const input = container.querySelector(".accordion-checkbox-input") as HTMLInputElement;
        input.focus();
        await user.keyboard(" ");
        expect(input.checked).toBe(true);
    });

    test("renders panel slot content", () => {
        const { container } = render(Subject, {
            props: { label: "Show", checked: true },
            slots: { default: "Inner content" },
        });
        const panel = container.querySelector(".accordion-checkbox-panel") as HTMLElement;
        expect(panel.textContent).toContain("Inner content");
    });

    test("uses provided id as base for the checkbox and panel ids", () => {
        const { container } = render(Subject, {
            props: { label: "Show", id: "custom" },
            slots: { default: "Body" },
        });
        const input = container.querySelector(".accordion-checkbox-input") as HTMLInputElement;
        const panel = container.querySelector(".accordion-checkbox-panel") as HTMLElement;
        expect(input.id).toBe("custom-checkbox");
        expect(panel.id).toBe("custom-panel");
    });
});
