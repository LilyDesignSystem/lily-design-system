import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Combobox } from "./Combobox";

function mount(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Combobox);
    for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
    return fixture;
}

describe("Combobox", () => {
    test("renders the div root with the base class", () => {
        const el = mount().nativeElement.querySelector("div.combobox");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const el = mount({ className: "extra" }).nativeElement.querySelector("div.combobox");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the input is a labelled combobox that controls the listbox", () => {
        const root = mount({ label: "Fruit", open: true }).nativeElement as HTMLElement;
        const input = root.querySelector('input[role="combobox"]')!;
        const listbox = root.querySelector('[role="listbox"]')!;
        expect(input.getAttribute("aria-label")).toBe("Fruit");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(input.getAttribute("aria-controls")).toBe(listbox.id);
        expect(listbox.getAttribute("aria-label")).toBe("Fruit");
    });

    test("the listbox is shown (not hidden) only while open, and aria-expanded says so", () => {
        const closed = mount({ label: "Fruit" }).nativeElement as HTMLElement;
        expect(closed.querySelector('[role="listbox"]')!.hasAttribute("hidden")).toBe(true);
        expect(closed.querySelector("input")!.getAttribute("aria-expanded")).toBe("false");
        const open = mount({ label: "Fruit", open: true }).nativeElement as HTMLElement;
        expect(open.querySelector("input")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("Escape closes the listbox", () => {
        const fixture = mount({ label: "Fruit", open: true });
        const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        fixture.detectChanges();
        expect(fixture.componentInstance.open()).toBe(false);
        expect(fixture.nativeElement.querySelector('[role="listbox"]').hasAttribute("hidden")).toBe(
            true,
        );
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });

    test("typing updates the value model", () => {
        const fixture = mount({ label: "Fruit" });
        const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
        input.value = "app";
        input.dispatchEvent(new Event("input"));
        expect(fixture.componentInstance.value()).toBe("app");
    });
});
