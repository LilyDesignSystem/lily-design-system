import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";


import type { ReactNode } from "react";
import CheckListItem from "./CheckListItem";

// Wrap CheckListItem in an <ol> for valid HTML context
function renderInList(props: { children?: ReactNode; [key: string]: unknown }) {
    const { children, ...rest } = props;
    return render(
        <ol>
            <CheckListItem {...rest}>{children}</CheckListItem>
        </ol>
    );
}

describe("CheckListItem", () => {
    test("renders an li element", () => {
        renderInList({ children: "Task" });
        const li = document.querySelector("li");
        expect(li).toBeTruthy();
    });

    test("renders a checkbox input", () => {
        renderInList({ children: "Task" });
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeTruthy();
    });

    test("renders children as label text", () => {
        renderInList({ children: "Buy groceries" });
        const label = document.querySelector("label");
        expect(label?.textContent).toContain("Buy groceries");
    });

    test("is unchecked by default", () => {
        renderInList({ children: "Task" });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });

    test("supports checked prop", () => {
        renderInList({ children: "Done", checked: true });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    test("supports disabled prop", () => {
        renderInList({ children: "Locked", disabled: true });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);
    });

    test("spreads additional attributes onto li", () => {
        renderInList({ children: "Task", "data-testid": "item-1" });
        const li = document.querySelector("[data-testid='item-1']");
        expect(li).toBeTruthy();
        expect(li?.tagName).toBe("LI");
    });
});
