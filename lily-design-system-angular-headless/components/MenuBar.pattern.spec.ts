import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { MenuBar } from "./MenuBar";

test("meets the menubar contract", async () => {
    const fixture = TestBed.createComponent(MenuBar);
    fixture.componentRef.setInput("label", "Sections");
    fixture.detectChanges();
    await runPattern("menubar", {
        root: fixture.nativeElement.querySelector("[role='menubar']") ?? fixture.nativeElement,
        hook: "menu-bar",
    });
});

test("meets the menubar-submenu contract", async () => {
    const fixture = TestBed.createComponent(MenuBar);
    fixture.componentRef.setInput("label", "Sections");
    fixture.detectChanges();
    await runPattern("menubar-submenu", {
        root: fixture.nativeElement.querySelector("[role='menubar']") ?? fixture.nativeElement,
        hook: "menu-bar",
    });
});
