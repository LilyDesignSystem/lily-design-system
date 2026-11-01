// P10-T9: a form reset puts the textarea back to the text it started with.
// The textarea shows the component's model, which the browser's own reset knows nothing about.
import { TestBed } from "@angular/core/testing";
import { describe, expect, test, vi } from "vitest";

import { MarkdownEditor } from "./markdown-editor.component";

const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

async function inForm() {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const fixture = TestBed.createComponent(MarkdownEditor);
    fixture.componentRef.setInput("label", "Message");
    fixture.componentRef.setInput("toolbarLabel", "Formatting");
    fixture.componentRef.setInput("labels", {});
    fixture.componentRef.setInput("name", "body");
    fixture.componentRef.setInput("value", "hello");
    form.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    await fixture.whenStable();
    const textarea = form.querySelector("textarea")!;
    const changed = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    const type = (text: string) => {
        textarea.value = text;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        fixture.detectChanges();
    };
    return { form, fixture, textarea, changed, type };
}

describe("MarkdownEditor form reset", () => {
    test("restores the initial text and tells the consumer", async () => {
        const { form, fixture, textarea, changed, type } = await inForm();
        type("typed");
        form.reset();
        await tick();
        fixture.detectChanges();
        expect(textarea.value).toBe("hello");
        expect(fixture.componentInstance.value()).toBe("hello");
        expect(changed).toHaveBeenLastCalledWith("hello");
        form.remove();
    });

    test("a cancelled reset changes nothing", async () => {
        const { form, fixture, textarea, type } = await inForm();
        type("typed");
        form.addEventListener("reset", (event) => event.preventDefault());
        form.reset();
        await tick();
        expect(textarea.value).toBe("typed");
        expect(fixture.componentInstance.value()).toBe("typed");
        form.remove();
    });
});
