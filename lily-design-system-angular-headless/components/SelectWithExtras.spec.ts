import { Component, signal } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SelectWithExtras } from "./SelectWithExtras";

@Component({
    standalone: true,
    imports: [SelectWithExtras],
    template: `<lily-select-with-extras label="Pick" className="extra" [(value)]="value" [disabled]="disabled">
        <span before>Before</span>
        <option value="a">A</option>
        <option value="b">B</option>
        <span after>After</span>
    </lily-select-with-extras>`,
})
class TestHost {
    readonly value = signal("b");
    disabled = false;
}

function make() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    return fixture;
}

describe("SelectWithExtras", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make().nativeElement.querySelector("div.select-with-extras");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the extras sit around the select, the options inside it", () => {
        const root = make().nativeElement.querySelector("div");
        expect([...root.children].map((el: any) => el.tagName)).toEqual(["SPAN", "SELECT", "SPAN"]);
        expect(root.querySelectorAll("select option").length).toBe(2);
        expect(root.querySelector("select").getAttribute("aria-label")).toBe("Pick");
    });

    test("value is two-way", () => {
        const fixture = make();
        const select = fixture.nativeElement.querySelector("select");
        expect(select.value).toBe("b");
        select.value = "a";
        select.dispatchEvent(new Event("change"));
        expect(fixture.componentInstance.value()).toBe("a");
    });
});
