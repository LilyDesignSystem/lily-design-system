import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";

import CheckListItem from "./CheckListItem.vue";

// Wrap CheckListItem in an <ol> for valid HTML context
function renderInList(props: Record<string, unknown>, slotContent?: string) {
    const container = document.createElement("div");
    const ol = document.createElement("ol");
    container.appendChild(ol);
    document.body.appendChild(container);
    const result = render(CheckListItem, {
        props,
        ...(slotContent != null ? { slots: { default: slotContent } } : {}),
        target: ol,
    });
    return { ...result, container };
}

describe("CheckListItem", () => {
    it("renders an li element", () => {
        renderInList({}, "Task");
        const li = document.querySelector("li");
        expect(li).toBeTruthy();
    });

    it("renders a checkbox input", () => {
        renderInList({}, "Task");
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeTruthy();
    });

    it("renders children as label text", () => {
        renderInList({}, "Buy groceries");
        const label = document.querySelector("label");
        expect(label?.textContent).toContain("Buy groceries");
    });

    it("is unchecked by default", () => {
        renderInList({}, "Task");
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });

    it("supports checked prop", () => {
        renderInList({ checked: true }, "Done");
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    it("supports disabled prop", () => {
        renderInList({ disabled: true }, "Locked");
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);
    });

    it("spreads additional attributes onto li", () => {
        renderInList({ "data-testid": "item-1" }, "Task");
        const li = document.querySelector("[data-testid='item-1']");
        expect(li).toBeTruthy();
        expect(li?.tagName).toBe("LI");
    });
});
