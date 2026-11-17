import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TimelineListItem } from "./TimelineListItem";

// TimelineListItem is an attribute-selector component (`li[lily-timeline-list-item]`): its host is the
// native <li> the consumer writes, not a wrapper element, so tests mount it via a
// small host template rather than `TestBed.createComponent(TimelineListItem)` directly (the
// latter has no <li> to attach to and falls back to a bare <div>).
@Component({
    standalone: true,
    imports: [TimelineListItem],
    template: `<li lily-timeline-list-item [className]="className"></li>`,
})
class TestHost {
    className = "";
}

@Component({
    standalone: true,
    imports: [TimelineListItem],
    template: `<ul><li lily-timeline-list-item entryState="withheld" entryStateLabel="Restricted">Sensitive note</li><li lily-timeline-list-item entryState="entered-in-error" entryStateLabel="Entered in error">Sensitive note</li></ul>`,
})
class EntryStates {}

describe("TimelineListItem", () => {
    test("the host is the li itself — no wrapper element — with the base class", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("li");
        expect(el.tagName).toBe("LI");
        expect(el.classList.contains("timeline-list-item")).toBe(true);
    });

    test("appends the className input to the host class list", () => {
        const fixture = TestBed.createComponent(TestHost);
        fixture.componentInstance.className = "extra";
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("li");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("shows a time", () => {
        const fixture = TestBed.createComponent(TimelineListItem);
        fixture.componentRef.setInput("datetime", "2026-11-06");
        fixture.componentRef.setInput("heading", "6 November");
        fixture.detectChanges();
        const el = fixture.nativeElement;
        const time = el.querySelector("time");
        expect(time.getAttribute("datetime")).toBe("2026-11-06");
        expect(time.textContent).toBe("6 November");
    });

    test("has no time by default", () => {
        const fixture = TestBed.createComponent(TimelineListItem);
        fixture.detectChanges();
        const el = fixture.nativeElement;
        expect(el.querySelector("time")).toBeNull();
    });

    test("withheld shows only the consumer's words; entered-in-error keeps the content struck through", () => {
        const fixture = TestBed.createComponent(EntryStates);
        fixture.detectChanges();
        const [withheld, inError] = Array.from(
            (fixture.nativeElement as HTMLElement).querySelectorAll("li.timeline-list-item"),
        );
        expect(withheld.getAttribute("data-entry-state")).toBe("withheld");
        expect(withheld.textContent).not.toContain("Sensitive note");
        expect(withheld.querySelector(".timeline-list-item-entry-state")?.textContent).toBe("Restricted");
        expect(inError.querySelector("del.timeline-list-item-entry")?.textContent).toBe("Sensitive note");
        expect(inError.querySelector(".timeline-list-item-entry-state")?.textContent).toBe("Entered in error");
    });
});
