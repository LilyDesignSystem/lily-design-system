import { afterEach, describe, expect, test, vi } from "vitest";
import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { AccordionCheckbox } from "./AccordionCheckbox";

@Component({
    standalone: true,
    imports: [AccordionCheckbox],
    template: `<form>
        <lily-accordion-checkbox label="Updates" [(checked)]="on" [id]="id">
            <p id="content">Topics</p>
        </lily-accordion-checkbox>
    </form>`,
})
class Host {
    on = signal(false);
    id: string | undefined = undefined;
}

function mount(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(AccordionCheckbox);
    fixture.componentRef.setInput("label", "Updates");
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    return {
        fixture,
        root: el.querySelector<HTMLElement>("div.accordion-checkbox")!,
        box: el.querySelector<HTMLInputElement>("input.accordion-checkbox-input")!,
        label: el.querySelector<HTMLLabelElement>("label.accordion-checkbox-label")!,
        panel: el.querySelector<HTMLElement>("div.accordion-checkbox-panel")!,
    };
}

afterEach(() => vi.restoreAllMocks());

describe("AccordionCheckbox", () => {
    test("renders the div root with the base class", () => {
        expect(mount().root).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        expect(mount({ className: "extra" }).root.classList.contains("extra")).toBe(true);
    });

    test("renders a real checkbox with its label, linked by for", () => {
        const { box, label } = mount();
        expect(box.type).toBe("checkbox");
        expect(box.id).toBeTruthy();
        expect(label.htmlFor).toBe(box.id);
        expect(label.textContent!.trim()).toBe("Updates");
    });

    test("names no element with aria-label on the plain div root", () => {
        expect(mount().root.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-controls on the checkbox links to the panel", () => {
        const { box, panel } = mount();
        expect(panel.id).toBeTruthy();
        expect(box.getAttribute("aria-controls")).toBe(panel.id);
    });

    test("the panel is a region labelled by the checkbox", () => {
        const { box, panel } = mount();
        expect(panel.getAttribute("role")).toBe("region");
        expect(panel.getAttribute("aria-labelledby")).toBe(box.id);
    });

    test("the panel is hidden and aria-expanded false by default", () => {
        const { box, panel } = mount();
        expect(panel.hidden).toBe(true);
        expect(box.getAttribute("aria-expanded")).toBe("false");
    });

    test("the panel shows when initially checked", () => {
        const { box, panel } = mount({ checked: true });
        expect(panel.hidden).toBe(false);
        expect(box.checked).toBe(true);
        expect(box.getAttribute("aria-expanded")).toBe("true");
    });

    test("toggling the checkbox reveals and hides the panel", () => {
        const { fixture, box, panel } = mount();
        box.click();
        fixture.detectChanges();
        expect(panel.hidden).toBe(false);
        expect(box.getAttribute("aria-expanded")).toBe("true");
        box.click();
        fixture.detectChanges();
        expect(panel.hidden).toBe(true);
        expect(box.getAttribute("aria-expanded")).toBe("false");
    });

    test("two ids do not collide when none is given", () => {
        expect(mount().box.id).not.toBe(mount().box.id);
    });

    test("uses the id input as the base for the checkbox and panel ids", () => {
        const { box, panel } = mount({ id: "topic" });
        expect(box.id).toBe("topic-checkbox");
        expect(panel.id).toBe("topic-panel");
    });

    test("warns when it has no name", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const fixture = TestBed.createComponent(AccordionCheckbox);
        fixture.detectChanges();
        expect(warn).toHaveBeenCalled();
    });
});

describe("AccordionCheckbox in a host", () => {
    function hosted() {
        const fixture = TestBed.createComponent(Host);
        document.body.appendChild(fixture.nativeElement);
        fixture.detectChanges();
        const el = fixture.nativeElement as HTMLElement;
        return { fixture, el, box: el.querySelector<HTMLInputElement>("input")! };
    }

    test("[(checked)] is two-way", () => {
        const { fixture, box } = hosted();
        box.click();
        expect(fixture.componentInstance.on()).toBe(true);
        fixture.detectChanges();
        fixture.componentInstance.on.set(false);
        fixture.detectChanges();
        expect(box.checked).toBe(false);
        fixture.nativeElement.remove();
    });

    test("projects the content into the panel", () => {
        const { fixture, el } = hosted();
        expect(el.querySelector(".accordion-checkbox-panel #content")).toBeTruthy();
        fixture.nativeElement.remove();
    });

    test("a form reset closes the panel and clears the bound state", async () => {
        const { fixture, el, box } = hosted();
        await fixture.whenStable();
        box.click();
        fixture.detectChanges();
        el.querySelector("form")!.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
        expect(fixture.componentInstance.on()).toBe(false);
        expect(box.checked).toBe(false);
        expect(el.querySelector<HTMLElement>(".accordion-checkbox-panel")!.hidden).toBe(true);
        fixture.nativeElement.remove();
    });
});
