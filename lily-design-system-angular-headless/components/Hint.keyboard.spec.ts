import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Hint } from "./Hint";

@Component({
    imports: [Hint],
    template: `<lily-hint id="name-hint" label="Hint">Use your full name</lily-hint>`,
})
class Host0 {}

describe("Hint keyboard", () => {
    test("aria-describedby can point a control at it", async () => {
        TestBed.createComponent(Host0).detectChanges();

        document.body.insertAdjacentHTML("beforeend", '<input aria-describedby="name-hint" />');
        const input = document.querySelector("[aria-describedby]");
        const target = document.getElementById(input?.getAttribute("aria-describedby") ?? "");
        expect(target?.textContent).toContain("Use your full name");
    });
});
