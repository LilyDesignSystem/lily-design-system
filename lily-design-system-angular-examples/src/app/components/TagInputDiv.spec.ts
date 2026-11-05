import { Component, signal } from "@angular/core";
import { describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TagInputDiv } from "./TagInputDiv";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TagInputDiv);
    fixture.componentRef.setInput("label", "Tags");
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const field = root.querySelector("input.tag-input-div-field") as HTMLInputElement;
    return { fixture, root, field };
}

function enter(field: HTMLInputElement, init: KeyboardEventInit = {}) {
    const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
        ...init,
    });
    field.dispatchEvent(event);
    return event;
}

@Component({
    standalone: true,
    imports: [TagInputDiv],
    template: `<lily-tag-input-div label="Tags" [(value)]="text" (added)="tags.push($event)">
      <span class="tag">one</span>
    </lily-tag-input-div>`,
})
class Host {
    readonly text = signal("  two  ");
    readonly tags: string[] = [];
}

describe("TagInputDiv", () => {
    test("the root is a named group with the base class", () => {
        const { root } = make({ className: "extra" });
        const group = root.querySelector("div.tag-input-div") as HTMLElement;
        expect(group.getAttribute("role")).toBe("group");
        expect(group.getAttribute("aria-label")).toBe("Tags");
        expect(group.classList.contains("extra")).toBe(true);
    });

    test("holds a named text field", () => {
        const { field } = make();
        expect(field.type).toBe("text");
        expect(field.getAttribute("aria-label")).toBe("Tags");
    });

    test("the field takes disabled, placeholder, name and required", () => {
        const { field } = make({ disabled: true, placeholder: "P", name: "n", required: true });
        expect(field.disabled).toBe(true);
        expect(field.placeholder).toBe("P");
        expect(field.name).toBe("n");
        expect(field.required).toBe(true);
    });

    test("projects the consumer's tags before the field, and Enter adds and clears", async () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        await fixture.whenStable();
        const root: HTMLElement = fixture.nativeElement;
        const field = root.querySelector("input") as HTMLInputElement;
        expect(root.querySelector("div.tag-input-div > span.tag")?.nextElementSibling).toBe(field);

        const event = enter(field);
        fixture.detectChanges();
        expect(fixture.componentInstance.tags).toEqual(["two"]);
        expect(fixture.componentInstance.text()).toBe("");
        expect(event.defaultPrevented).toBe(true);
    });

    test("Enter on blank text adds nothing and stays a normal Enter", () => {
        const { fixture, field } = make({ value: "   " });
        const added = vi.fn();
        fixture.componentInstance.added.subscribe(added);
        const event = enter(field);
        expect(added).not.toHaveBeenCalled();
        expect(event.defaultPrevented).toBe(false);
    });

    test("Enter during an IME composition adds nothing", () => {
        const { fixture, field } = make({ value: "one" });
        const added = vi.fn();
        fixture.componentInstance.added.subscribe(added);
        enter(field, { isComposing: true });
        expect(added).not.toHaveBeenCalled();
        expect(fixture.componentInstance.value()).toBe("one");
    });
});
