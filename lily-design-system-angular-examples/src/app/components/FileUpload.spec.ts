import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FileUpload } from "./FileUpload";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(FileUpload);
    for (const [key, value] of Object.entries({ label: "Choose", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("FileUpload", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.file-upload");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the button opens the hidden input", () => {
        const root = make({ accept: ".pdf", multiple: true }).nativeElement;
        const picker = root.querySelector("input[type=file]");
        expect(picker.hidden).toBe(true);
        expect(picker.getAttribute("accept")).toBe(".pdf");
        expect(picker.multiple).toBe(true);
        let clicks = 0;
        picker.click = () => clicks++;
        root.querySelector("button").click();
        expect(clicks).toBe(1);
    });

    test("disabled reaches the button", () => {
        expect(make({ disabled: true }).nativeElement.querySelector("button").disabled).toBe(true);
    });

    test("a choice reports, and the status is the consumer's words", async () => {
        const fixture = make({ selectedLabel: (count: number) => `${count} chosen` });
        const seen: unknown[] = [];
        fixture.componentInstance.filesChange.subscribe((files: unknown) => seen.push(files));
        const status = fixture.nativeElement.querySelector("span");
        expect(status.getAttribute("data-file-count")).toBe("0");
        expect(status.textContent).toBe("");
        const picker = fixture.nativeElement.querySelector("input");
        Object.defineProperty(picker, "files", { value: [{ name: "a" }, { name: "b" }] });
        picker.dispatchEvent(new Event("change"));
        await fixture.whenStable();
        expect(seen.length).toBe(1);
        expect(status.getAttribute("data-file-count")).toBe("2");
        expect(status.textContent).toBe("2 chosen");
    });

    test("with no label for the count, the status has no English", async () => {
        const fixture = make();
        const picker = fixture.nativeElement.querySelector("input");
        Object.defineProperty(picker, "files", { value: [{ name: "a" }] });
        picker.dispatchEvent(new Event("change"));
        await fixture.whenStable();
        expect(fixture.nativeElement.querySelector("span").textContent).toBe("");
    });
});
