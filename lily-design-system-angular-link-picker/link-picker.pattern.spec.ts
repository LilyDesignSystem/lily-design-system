import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { runPattern } from "../shared/pattern-tester";
import { LinkPicker } from "./link-picker.component";

test("meets the picker-disclosure contract", async () => {
    const fixture = TestBed.createComponent(LinkPicker);
    fixture.componentRef.setInput("label", "Picker");
    fixture.componentRef.setInput("links", [{ label: "Home", href: "/" }]);
    document.body.appendChild(fixture.nativeElement);
    const settle = async (): Promise<void> => {
        fixture.detectChanges();
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
    };
    await settle();
    try {
        await runPattern("picker-disclosure", {
            root: fixture.nativeElement,
            hook: "link-picker",
            settle,
        });
    } finally {
        fixture.destroy();
    }
});
