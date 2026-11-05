import { describe, expect, test } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ErrorMessage } from "./ErrorMessage";

@Component({
    imports: [ErrorMessage],
    template: `<lily-error-message label="Error">Enter your name</lily-error-message>`,
})
class Host0 {}

describe("ErrorMessage keyboard", () => {
    test("is announced as an alert", async () => {
        TestBed.createComponent(Host0).detectChanges();

        expect(document.querySelector(".error-message")?.getAttribute("role")).toBe("alert");
    });
});
