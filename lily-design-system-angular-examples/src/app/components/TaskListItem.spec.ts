import { Component, signal } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TaskListItem } from "./TaskListItem";

@Component({
    standalone: true,
    imports: [TaskListItem],
    template: `<li lily-task-list-item className="extra" label="Write" [(checked)]="checked" [disabled]="disabled()">
        <b>now</b>
    </li>`,
})
class TestHost {
    readonly checked = signal(false);
    readonly disabled = signal(false);
}

function make() {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    return fixture;
}

describe("TaskListItem", () => {
    test("the host is the li itself, with the base class", () => {
        const li = make().nativeElement.querySelector("li");
        expect(li.classList.contains("task-list-item")).toBe(true);
        expect(li.classList.contains("extra")).toBe(true);
    });

    test("the checkbox is labelled by the text and the content", () => {
        const label = make().nativeElement.querySelector("li > label");
        expect(label.querySelector("input[type=checkbox]")).toBeTruthy();
        expect(label.textContent).toContain("Write");
        expect(label.querySelector("b")).toBeTruthy();
    });

    test("checking is two-way and reflected", () => {
        const fixture = make();
        const li = fixture.nativeElement.querySelector("li");
        expect(li.getAttribute("data-checked")).toBe("false");
        li.querySelector("input").click();
        fixture.detectChanges();
        expect(fixture.componentInstance.checked()).toBe(true);
        expect(li.getAttribute("data-checked")).toBe("true");
    });

    test("disabled reaches the checkbox and the li", () => {
        const fixture = make();
        fixture.componentInstance.disabled.set(true);
        fixture.detectChanges();
        const li = fixture.nativeElement.querySelector("li");
        expect(li.querySelector("input").disabled).toBe(true);
        expect(li.getAttribute("data-disabled")).toBe("true");
    });
});
