import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AvatarImage } from "./AvatarImage";

describe("AvatarImage", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(AvatarImage);
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }

    test("appends the className input to the root class list", () => {
        const el = render({ className: "extra" }).nativeElement.querySelector("img.avatar-image");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders an <img> with src and alt, hidden from assistive technology", () => {
        const el = render({ src: "/a.png", alt: "Ada" }).nativeElement.querySelector(
            "img.avatar-image",
        );
        expect(el.getAttribute("src")).toBe("/a.png");
        expect(el.getAttribute("alt")).toBe("Ada");
        expect(el.getAttribute("aria-hidden")).toBe("true");
    });

    test("keeps an empty alt by default", () => {
        const el = render().nativeElement.querySelector("img.avatar-image");
        expect(el.getAttribute("alt")).toBe("");
    });
});
