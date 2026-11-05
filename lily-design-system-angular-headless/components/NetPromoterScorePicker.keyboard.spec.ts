import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { NetPromoterScorePicker } from "./NetPromoterScorePicker";

@Component({
    imports: [NetPromoterScorePicker],
    template: `<lily-net-promoter-score-picker label="Score" name="nps"></lily-net-promoter-score-picker>`,
})
class Host0 {}

describe("NetPromoterScorePicker keyboard", () => {
    test("arrows walk the scores inside the named radio group", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement as HTMLInputElement;
        expect(first.closest('[role="radiogroup"]')?.getAttribute("aria-label")).toBe("Score");
        expect(first.getAttribute("aria-label")).toBe("0");
        await user.keyboard("{ArrowRight}");
        const next = document.activeElement as HTMLInputElement;
        expect(next.getAttribute("aria-label")).toBe("1");
        expect(next.checked).toBe(true);
    });
});
