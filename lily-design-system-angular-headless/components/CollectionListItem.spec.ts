import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CollectionListItem } from "./CollectionListItem";

// CollectionListItem is an attribute-selector component (`li[lily-collection-list-item]`): its host is the
// native <li> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(CollectionListItem)` directly (the
// latter has no <li> to attach to and falls back to a bare <div>).
@Component({
    standalone: true,
    imports: [CollectionListItem],
    template: `<li lily-collection-list-item [className]="className"></li>`,
})
class TestHost {
    className = "";
}

describe("CollectionListItem", () => {
    test("the host is the li itself — no wrapper element — with the base class", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("li");
        expect(el.tagName).toBe("LI");
        expect(el.classList.contains("collection-list-item")).toBe(true);
    });

    test("appends the className input to the host class list", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.className = "extra";
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("li");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders its content", () => {
        const fixture = TestBed.createComponent(CollectionListItem);
        fixture.componentRef.setInput("heading", "Spring");
        fixture.componentRef.setInput("href", "/s");
        fixture.componentRef.setInput("meta", "2026");
        fixture.componentRef.setInput("description", "Bulbs");
        fixture.componentRef.setInput("imageUrl", "/a.png");
        fixture.componentRef.setInput("imageAlt", "A tulip");
        fixture.detectChanges();
        const el = fixture.nativeElement;
        expect(el.querySelector(".collection-list-item-heading a").getAttribute("href")).toBe("/s");
        expect(el.querySelector(".collection-list-item-meta").textContent).toBe("2026");
        expect(el.querySelector(".collection-list-item-description").textContent).toBe("Bulbs");
        expect(el.querySelector(".collection-list-item-image").getAttribute("alt")).toBe("A tulip");
    });
});
