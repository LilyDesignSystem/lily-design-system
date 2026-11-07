import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GraphicBlock } from "./GraphicBlock";

describe("GraphicBlock", () => {
    test("renders the <figure> root with the base class", () => {
        const fixture = TestBed.createComponent(GraphicBlock);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("figure.graphic-block");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(GraphicBlock);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("figure.graphic-block");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders its caption", () => {
        const fixture = TestBed.createComponent(GraphicBlock);
        fixture.componentRef.setInput("title", "T");
        fixture.componentRef.setInput("description", "D");
        fixture.componentRef.setInput("notes", "N");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".graphic-block");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.querySelector(".graphic-block-title").textContent).toBe("T");
        expect(el.querySelector(".graphic-block-description").textContent).toBe("D");
        expect(el.querySelector(".graphic-block-notes").textContent).toBe("N");
        expect(fixture.nativeElement.hasAttribute("title")).toBe(false);
    });

    test("has no caption by default", () => {
        const fixture = TestBed.createComponent(GraphicBlock);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".graphic-block");
        expect(el.querySelector("figcaption")).toBeNull();
    });
});
