import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { TransferList } from "./TransferList";

@Component({
    standalone: true,
    imports: [TransferList],
    template: `<lily-transfer-list label="Team members" sourceLabel="Available" targetLabel="Selected" className="extra">
        <ul source role="listbox" aria-label="Available people"><li role="option">Ada</li></ul>
        <p>stray</p>
        <button actions type="button">Add</button>
        <ul target role="listbox" aria-label="Selected people"><li role="option">Grace</li></ul>
    </lily-transfer-list>`,
})
class TestHost {}

describe("TransferList", () => {
    function root() {
        const fixture = TestBed.createComponent(TestHost);
        fixture.detectChanges();
        return fixture.nativeElement.querySelector("div.transfer-list");
    }

    test("renders a labelled group div with the base class and className", () => {
        const el = root();
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Team members");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("source, actions and target, in order, each projecting its own content", () => {
        const el = root();
        expect([...el.children].map((c: Element) => c.className)).toEqual([
            "transfer-list-source",
            "transfer-list-actions",
            "transfer-list-target",
        ]);
        expect(el.querySelector(".transfer-list-source").textContent.trim()).toBe("Ada");
        expect(el.querySelector(".transfer-list-actions button").textContent.trim()).toBe("Add");
        expect(el.querySelector(".transfer-list-target").textContent.trim()).toBe("Grace");
        expect(el.textContent).not.toContain("stray");
    });

    test("the two sections are named by sourceLabel and targetLabel", () => {
        const el = root();
        expect(el.querySelector("section.transfer-list-source").getAttribute("aria-label")).toBe(
            "Available",
        );
        expect(el.querySelector("section.transfer-list-target").getAttribute("aria-label")).toBe(
            "Selected",
        );
    });
});
