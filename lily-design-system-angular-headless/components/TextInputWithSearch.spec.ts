import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TextInputWithSearch } from "./TextInputWithSearch";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TextInputWithSearch);
    for (const [key, value] of Object.entries({
        label: "Site",
        inputLabel: "Terms",
        searchLabel: "Search",
        ...inputs,
    }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

const type = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    el.value = value;
    el.dispatchEvent(new Event("input"));
};

describe("TextInputWithSearch", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector(
            "div.text-input-with-search",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named search landmark with a field and a button", () => {
        const root = make().nativeElement;
        expect(root.querySelector("div").getAttribute("role")).toBe("search");
        expect(root.querySelector("div").getAttribute("aria-label")).toBe("Site");
        expect(root.querySelector("input").getAttribute("aria-label")).toBe("Terms");
        expect(root.querySelector("button").textContent.trim()).toBe("Search");
    });

    test("the button and Enter search with the value", () => {
        const fixture = make();
        const seen: string[] = [];
        fixture.componentInstance.search.subscribe((value: string) => seen.push(value));
        const field = fixture.nativeElement.querySelector("input");
        type(field, "lily");
        fixture.nativeElement.querySelector("button").click();
        const enter = new KeyboardEvent("keydown", {
            key: "Enter",
            cancelable: true,
            bubbles: true,
        });
        field.dispatchEvent(enter);
        expect(enter.defaultPrevented).toBe(true);
        expect(seen).toEqual(["lily", "lily"]);
    });

    test("Enter confirming an IME composition does nothing", () => {
        const fixture = make();
        let searches = 0;
        fixture.componentInstance.search.subscribe(() => searches++);
        const enter = new KeyboardEvent("keydown", {
            key: "Enter",
            cancelable: true,
            isComposing: true,
        });
        fixture.nativeElement.querySelector("input").dispatchEvent(enter);
        expect(enter.defaultPrevented).toBe(false);
        expect(searches).toBe(0);
    });

    test("disabled reaches both controls", () => {
        const root = make({ disabled: true }).nativeElement;
        expect(root.querySelector("input").disabled).toBe(true);
        expect(root.querySelector("button").disabled).toBe(true);
    });
});
