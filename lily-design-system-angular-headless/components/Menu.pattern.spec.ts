import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../../shared/pattern-tester";
import { Menu } from "./Menu";

test("meets the menu contract", async () => {
    const fixture = TestBed.createComponent(Menu);
    fixture.componentRef.setInput("label", "Sections");
    fixture.detectChanges();
    await runPattern("menu", {
        root: fixture.nativeElement.querySelector("[role='menu']") ?? fixture.nativeElement,
        hook: "menu",
    });
});

test("meets the menu-submenu contract", async () => {
    const fixture = TestBed.createComponent(Menu);
    fixture.componentRef.setInput("label", "Sections");
    fixture.detectChanges();
    await runPattern("menu-submenu", {
        root: fixture.nativeElement.querySelector("[role='menu']") ?? fixture.nativeElement,
        hook: "menu",
    });
});
