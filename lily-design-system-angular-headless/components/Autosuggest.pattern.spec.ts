import { TestBed } from "@angular/core/testing";
import { test } from "vitest";

import { autosuggestFixture, runPattern } from "../../shared/pattern-tester";
import { Autosuggest as Subject } from "./Autosuggest";

test("meets the autosuggest contract", async () => {
    const fixture = TestBed.createComponent(Subject);
    fixture.componentRef.setInput("label", "Fruit");
    fixture.componentRef.setInput("suggestions", autosuggestFixture.suggestions);
    fixture.detectChanges();
    await runPattern("autosuggest", {
        root: fixture.nativeElement,
        hook: "autosuggest",
        settle: async () => {
            fixture.detectChanges();
            await fixture.whenStable();
        },
    });
});
