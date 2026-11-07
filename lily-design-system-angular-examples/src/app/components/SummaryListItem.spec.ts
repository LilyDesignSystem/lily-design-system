import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SummaryListItem } from "./SummaryListItem";

// SummaryListItem is an attribute-selector component (`div[lily-summary-list-item]`): its host is the
// native <div> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(SummaryListItem)` directly (the
// latter has no host template to attach to).
@Component({
    standalone: true,
    imports: [SummaryListItem],
    template: `<div lily-summary-list-item [className]="className" term="Name">Ada</div>`,
})
class TestHost {
    className = "";
}

describe("SummaryListItem", () => {
    test("the host is the div itself — no wrapper element — with the base class", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.summary-list-item");
        expect(el.tagName).toBe("DIV");
        expect(el.classList.contains("summary-list-item")).toBe(true);
    });

    test("appends the className input to the host class list", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.className = "extra";
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.summary-list-item");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("holds the term in a dt and the value in a dd", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.summary-list-item");
        expect(el.querySelector("dt").textContent).toBe("Name");
        expect(el.querySelector("dd").textContent).toBe("Ada");
    });
});
