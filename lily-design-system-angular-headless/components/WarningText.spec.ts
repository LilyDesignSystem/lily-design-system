import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { WarningText } from "./WarningText";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(WarningText);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture;
}
const root = (f: any): HTMLElement => f.nativeElement.querySelector("div.warning-text");

@Component({
    standalone: true,
    imports: [WarningText],
    template: `<lily-warning-text><span icon>!</span><span class="visually-hidden">Warning</span> You can be fined if you do not register.</lily-warning-text>`,
})
class Host {}

describe("WarningText", () => {
    test("renders a <div> with the base class", () => {
        expect(root(make()).classList.contains("warning-text")).toBe(true);
    });

    test("appends the consumer class after the base class", () => {
        // Angular's class binding does not preserve source order, so assert membership.
        const cl = root(make({ className: "mine" })).classList;
        expect(cl.contains("warning-text")).toBe(true);
        expect(cl.contains("mine")).toBe(true);
    });

    test("projects the content, hidden prefix included, into strong.warning-text-text", () => {
        const f = TestBed.createComponent(Host);
        f.detectChanges();
        const strong = f.nativeElement.querySelector(".warning-text > strong.warning-text-text");
        expect(strong.querySelector(".visually-hidden").textContent).toBe("Warning");
        expect(strong.textContent).toContain("You can be fined");
        expect(strong.textContent).not.toContain("!");
    });

    test("projects [icon] first, inside an aria-hidden wrapper", () => {
        const f = TestBed.createComponent(Host);
        f.detectChanges();
        const wrap = f.nativeElement.querySelector(".warning-text > .warning-text-icon");
        expect(wrap.getAttribute("aria-hidden")).toBe("true");
        expect(wrap.textContent).toBe("!");
        expect(root(f).firstElementChild).toBe(wrap);
    });

    test("the icon wrapper is empty when nothing is projected", () => {
        expect(root(make()).querySelector(".warning-text-icon")!.children.length).toBe(0);
    });

    test("adds no role and no text of its own", () => {
        const el = root(make());
        expect(el.getAttribute("role")).toBeNull();
        expect(el.textContent).toBe("");
    });
});
