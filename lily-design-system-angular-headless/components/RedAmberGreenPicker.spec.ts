import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RedAmberGreenPicker } from "./RedAmberGreenPicker";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(RedAmberGreenPicker);
    for (const [key, value] of Object.entries({
        label: "Status",
        redLabel: "RED",
        amberLabel: "AMBER",
        greenLabel: "GREEN",
        ...inputs,
    }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("RedAmberGreenPicker", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector(
            "div.red-amber-green-picker",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the option names are the consumer's", () => {
        const root = make().nativeElement;
        const select = root.querySelector("select");
        expect(select.getAttribute("aria-label")).toBe("Status");
        const options = [...select.querySelectorAll("option:not([hidden])")] as HTMLOptionElement[];
        expect(options.map((option) => option.value)).toEqual(["red", "amber", "green"]);
        expect(options.map((option) => option.textContent)).toEqual(["RED", "AMBER", "GREEN"]);
    });

    test("an empty value shows no status", () => {
        expect(make().nativeElement.querySelector("select").value).toBe("");
    });

    test("value is two-way", () => {
        const fixture = make({ value: "green" });
        const select = fixture.nativeElement.querySelector("select");
        expect(select.value).toBe("green");
        select.value = "red";
        select.dispatchEvent(new Event("change"));
        expect(fixture.componentInstance.value()).toBe("red");
    });
});
