import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { TabPanel } from "./TabPanel";

@Component({
    imports: [TabPanel],
    template: `<lily-tab-panel label="Details" [selected]="true">Panel text</lily-tab-panel>`,
})
class Host0 {}

describe("TabPanel keyboard", () => {
    test("Tab moves focus into the selected panel", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const el = document.activeElement as HTMLElement;
        expect(el.matches(".tab-panel")).toBe(true);
        expect(el.getAttribute("role")).toBe("tabpanel");
        expect(el.getAttribute("aria-label")).toBe("Details");
    });
});
