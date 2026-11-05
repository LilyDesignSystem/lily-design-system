import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ErrorSummary } from "./ErrorSummary";

@Component({
    imports: [ErrorSummary],
    template: `<lily-error-summary title="There is a problem"><a href="#name">Enter your name</a></lily-error-summary>`,
})
class Host0 {}

describe("ErrorSummary keyboard", () => {
    test("Tab reaches its links, and it can take focus itself", async () => {
        TestBed.createComponent(Host0).detectChanges();
        const user = userEvent.setup();
        await user.tab();
        const link = document.activeElement as HTMLElement;
        expect(link.textContent).toBe("Enter your name");
        const root = link.closest(".error-summary") as HTMLElement;
        expect(root.getAttribute("role")).toBe("alert");
        expect(root.getAttribute("aria-labelledby")).toBe(root.querySelector("h2")?.id);
        expect(root.getAttribute("tabindex")).toBe("-1");
        root.focus();
        expect(document.activeElement).toBe(root);
    });
});
