import { describe, expect, test } from "vitest";
import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { SplitView } from "./SplitView";

@Component({
    standalone: true,
    imports: [SplitView],
    template: `<lily-split-view label="Editor and preview" [splitPercent]="percent()" orientation="vertical" className="extra">
        <div primary>Editor</div>
        <p>stray</p>
        <div secondary>Preview</div>
    </lily-split-view>`,
})
class TestHost {
    percent = signal(30);
}

@Component({
    standalone: true,
    imports: [SplitView],
    template: `<lily-split-view label="Panes">
        <div primary>A</div>
        <p>stray</p>
        <hr divider class="custom-divider" />
        <div secondary>B</div>
    </lily-split-view>`,
})
class CustomDividerHost {}

describe("SplitView", () => {
    function render() {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        return fixture;
    }

    test("renders a labelled div root with the base class, className and data attributes", () => {
        const el = render().nativeElement.querySelector("div.split-view");
        expect(el.getAttribute("aria-label")).toBe("Editor and preview");
        expect(el.classList.contains("extra")).toBe(true);
        expect(el.getAttribute("data-orientation")).toBe("vertical");
        expect(el.getAttribute("data-split-percent")).toBe("30");
    });

    test("projects the two panels into sections, divider between them", () => {
        const el = render().nativeElement.querySelector("div.split-view");
        const children = [...el.children].map((c: Element) => c.className);
        expect(children).toEqual([
            "split-view-primary",
            "split-view-divider",
            "split-view-secondary",
        ]);
        expect(el.querySelector("section.split-view-primary").textContent.trim()).toBe("Editor");
        expect(el.querySelector("section.split-view-secondary").textContent.trim()).toBe("Preview");
        expect(el.textContent).not.toContain("stray");
    });

    test("the default divider is a focusable window-splitter separator", () => {
        const fixture = render();
        const divider = fixture.nativeElement.querySelector(".split-view-divider");
        expect(divider.getAttribute("role")).toBe("separator");
        expect(divider.getAttribute("tabindex")).toBe("0");
        expect(divider.getAttribute("aria-orientation")).toBe("vertical");
        expect(divider.getAttribute("aria-valuenow")).toBe("30");
        expect(divider.getAttribute("aria-valuemin")).toBe("0");
        expect(divider.getAttribute("aria-valuemax")).toBe("100");
        fixture.componentInstance.percent.set(70);
        fixture.detectChanges();
        expect(divider.getAttribute("aria-valuenow")).toBe("70");
    });

    test("an element marked divider replaces the default divider", () => {
        const fixture = TestBed.createComponent(CustomDividerHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.split-view");
        expect(el.querySelector(".split-view-divider")).toBeNull();
        expect(el.children[1].classList.contains("custom-divider")).toBe(true);
        expect(el.textContent).not.toContain("stray");
    });
});
