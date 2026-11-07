import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { resetDevWarnings } from "./dev-warning";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
    test("renders the button root with the base class", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button.icon-button");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button.icon-button");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("baseClass replaces the default class token outright", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.componentRef.setInput("baseClass", "theme-picker-button");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button");
        expect(el.className.trim()).toBe("theme-picker-button");
        expect(fixture.nativeElement.querySelector(".icon-button")).toBeNull();
    });

    test("the host tag is display: contents", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.detectChanges();
        expect(fixture.nativeElement.style.display).toBe("contents");
    });

    test("aria-haspopup / aria-expanded / aria-controls pass through to the real button", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.componentRef.setInput("ariaHaspopup", "listbox");
        fixture.componentRef.setInput("ariaExpanded", false);
        fixture.componentRef.setInput("ariaControls", "some-list");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button");
        expect(el.getAttribute("aria-haspopup")).toBe("listbox");
        expect(el.getAttribute("aria-expanded")).toBe("false");
        expect(el.getAttribute("aria-controls")).toBe("some-list");
    });

    test("focus() focuses the real button", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.detectChanges();
        document.body.appendChild(fixture.nativeElement);
        fixture.componentInstance.focus();
        const el = fixture.nativeElement.querySelector("button");
        expect(document.activeElement).toBe(el);
        fixture.nativeElement.remove();
    });

    test("element getter exposes the real button", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector("button");
        expect(fixture.componentInstance.element).toBe(button);
    });
});

describe("IconButton — development warnings", () => {
    beforeEach(() => resetDevWarnings());

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
        resetDevWarnings();
    });

    test("a missing label warns", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(IconButton).detectChanges();
        expect(warn).toHaveBeenCalledOnce();
    });

    test("a label does not warn", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const fixture = TestBed.createComponent(IconButton);
        fixture.componentRef.setInput("label", "Close");
        fixture.detectChanges();
        expect(warn).not.toHaveBeenCalled();
    });

    test("production is silent", () => {
        vi.stubEnv("NODE_ENV", "production");
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        TestBed.createComponent(IconButton).detectChanges();
        expect(warn).not.toHaveBeenCalled();
    });

    test("reflects type and pressed", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.componentRef.setInput("label", "Play");
        fixture.componentRef.setInput("type", "submit");
        fixture.componentRef.setInput("pressed", false);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button");
        expect(el.getAttribute("type")).toBe("submit");
        expect(el.getAttribute("aria-pressed")).toBe("false");
    });

    test("is not a toggle by default", () => {
        const fixture = TestBed.createComponent(IconButton);
        fixture.componentRef.setInput("label", "Play");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button");
        expect(el.hasAttribute("aria-pressed")).toBe(false);
    });
});
