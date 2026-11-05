import { Component, signal } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AccordionListItem } from "./AccordionListItem";

// AccordionListItem is an attribute-selector component (`li[lily-accordion-list-item]`): its host is the
// native <li> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(AccordionListItem)` directly (the
// latter has no <li> to attach to and falls back to a bare <div>).
@Component({
    standalone: true,
    imports: [AccordionListItem],
    template: `<li lily-accordion-list-item [className]="className" [summary]="summary" [(open)]="open">
        <p>body</p>
    </li>`,
})
class TestHost {
    className = "";
    summary = "Head";
    readonly open = signal(false);
}

@Component({
    standalone: true,
    imports: [AccordionListItem],
    template: `<li lily-accordion-list-item><summary>Own</summary></li>`,
})
class OwnSummaryHost {}

describe("AccordionListItem", () => {
    test("the host is the li itself — no wrapper element — with the base class", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.className = "extra";
        fixture.detectChanges();
        const li = fixture.nativeElement.querySelector("li");
        expect(li.classList.contains("accordion-list-item")).toBe(true);
        expect(li.classList.contains("extra")).toBe(true);
        expect(li.parentElement).toBe(fixture.nativeElement);
    });

    test("the li holds a native details with the summary and the content", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector("li > details > summary").textContent.trim(),
        ).toBe("Head");
        expect(fixture.nativeElement.querySelector("li > details > p")).toBeTruthy();
    });

    test("the content can bring its own summary", () => {
        const fixture = TestBed.createComponent(OwnSummaryHost);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll("summary").length).toBe(1);
    });

    test("open is two-way with the details", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const details = fixture.nativeElement.querySelector("details");
        details.open = true;
        details.dispatchEvent(new Event("toggle"));
        expect(fixture.componentInstance.open()).toBe(true);
        fixture.detectChanges();
        fixture.componentInstance.open.set(false);
        fixture.detectChanges();
        expect(details.open).toBe(false);
    });
});
