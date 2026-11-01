import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DescriptionListItem } from "./DescriptionListItem";

// DescriptionListItem is an attribute-selector component (`div[lily-description-list-item]`): its host is the
// native <div> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(DescriptionListItem)` directly (the
// latter has no <div> host to and falls back to a bare <div>).
@Component({
    standalone: true,
    imports: [DescriptionListItem],
    template: `<div lily-description-list-item [className]="className"></div>`,
})
class TestHost {
    className = "";
}

describe("DescriptionListItem", () => {
    test("the host is the div itself — no wrapper element — with the base class", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".description-list-item");
        expect(el.tagName).toBe("DIV");
        expect(el.classList.contains("description-list-item")).toBe(true);
    });

    test("appends the className input to the host class list", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.className = "extra";
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.description-list-item");
        expect(el.classList.contains("extra")).toBe(true);
    });
});
