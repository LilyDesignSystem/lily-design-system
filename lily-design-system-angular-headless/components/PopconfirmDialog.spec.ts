import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PopconfirmDialog } from "./PopconfirmDialog";

describe("PopconfirmDialog", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(PopconfirmDialog);
        const all = {
            title: "Delete file?",
            confirmLabel: "Delete",
            cancelLabel: "Keep",
            ...inputs,
        };
        for (const [k, v] of Object.entries(all)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }
    const root = (f: ReturnType<typeof render>) =>
        f.nativeElement.querySelector("div.popconfirm-dialog");

    test("renders a non-modal alertdialog div with the base class and className", () => {
        const el = root(render({ className: "extra" }));
        expect(el.getAttribute("role")).toBe("alertdialog");
        expect(el.getAttribute("aria-modal")).toBe("false");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is hidden while closed and shown while open", () => {
        expect(root(render()).hidden).toBe(true);
        expect(root(render({ open: true })).hidden).toBe(false);
    });

    test("is named by its title and described by its description", () => {
        const el = root(render({ description: "This cannot be undone." }));
        const title = el.querySelector("h2.popconfirm-dialog-title");
        expect(title.textContent.trim()).toBe("Delete file?");
        expect(el.getAttribute("aria-labelledby")).toBe(title.id);
        const description = el.querySelector("p.popconfirm-dialog-description");
        expect(description.textContent.trim()).toBe("This cannot be undone.");
        expect(el.getAttribute("aria-describedby")).toBe(description.id);
    });

    test("has no description or aria-describedby without one", () => {
        const el = root(render());
        expect(el.querySelector(".popconfirm-dialog-description")).toBeNull();
        expect(el.hasAttribute("aria-describedby")).toBe(false);
    });

    test("two dialogs get different ids", () => {
        const a = root(render()).getAttribute("aria-labelledby");
        const b = root(render()).getAttribute("aria-labelledby");
        expect(a).not.toBe(b);
    });

    test("the buttons show their labels and emit cancelled and confirmed", () => {
        const fixture = render({ open: true });
        const events: string[] = [];
        fixture.componentInstance.cancelled.subscribe(() => events.push("cancel"));
        fixture.componentInstance.confirmed.subscribe(() => events.push("confirm"));
        const cancel = root(fixture).querySelector("button.popconfirm-dialog-cancel");
        const confirm = root(fixture).querySelector("button.popconfirm-dialog-confirm");
        expect(cancel.textContent.trim()).toBe("Keep");
        expect(confirm.textContent.trim()).toBe("Delete");
        expect(cancel.getAttribute("type")).toBe("button");
        expect(confirm.getAttribute("type")).toBe("button");
        cancel.click();
        confirm.click();
        expect(events).toEqual(["cancel", "confirm"]);
    });
});
