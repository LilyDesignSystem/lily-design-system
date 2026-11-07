import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Option } from "./Option";

// Option is an attribute-selector component (`option[lily-option]`): its host is the
// native <option> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(Option)` directly (the
// latter has no <option> to attach to and falls back to a bare <div>).
@Component({
    standalone: true,
    imports: [Option],
    template: `<option lily-option [className]="className" [value]="value"></option>`,
})
class TestHost {
    className = "";
    value = "";
}

@Component({
    standalone: true,
    imports: [Option],
    template: `<select multiple>
        <option lily-option value="a" [selected]="true" [disabled]="true"></option>
        <option lily-option value="b"></option>
    </select>`,
})
class TestHostStates {}

describe("Option", () => {
    test("the host is the option itself — no wrapper element — with the base class", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("option");
        expect(el.tagName).toBe("OPTION");
        expect(el.classList.contains("option")).toBe(true);
    });

    test("appends the className input to the host class list", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.className = "extra";
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("option");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("reflects selected and disabled, and leaves the others alone", () => {
        const fixture = TestBed.createComponent(TestHostStates);
        fixture.detectChanges();
        const [a, b] = fixture.nativeElement.querySelectorAll("option");
        expect(a.selected).toBe(true);
        expect(a.disabled).toBe(true);
        expect(b.selected).toBe(false);
        expect(b.hasAttribute("selected")).toBe(false);
    });
});
