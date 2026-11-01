import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ChatMessage } from "./ChatMessage";

describe("ChatMessage", () => {
    test("renders the <article> root with the base class", () => {
        const fixture = TestBed.createComponent(ChatMessage);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.chat-message");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ChatMessage);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.chat-message");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});
