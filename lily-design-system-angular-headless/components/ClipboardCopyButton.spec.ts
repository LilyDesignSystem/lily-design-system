import { afterEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ClipboardCopyButton } from "./ClipboardCopyButton";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ClipboardCopyButton);
    for (const [key, value] of Object.entries({ text: "copy me", label: "Copy", ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("ClipboardCopyButton", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector(
            "button.clipboard-copy-button",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    test("a copy writes the text, reports, and marks data-copied for two seconds", async () => {
        vi.useFakeTimers();
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal("navigator", { clipboard: { writeText } });
        const fixture = make();
        let success = 0;
        fixture.componentInstance.copySuccess.subscribe(() => success++);
        const button = fixture.nativeElement.querySelector("button");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("data-copied")).toBe("false");
        button.click();
        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();
        expect(writeText).toHaveBeenCalledWith("copy me");
        expect(success).toBe(1);
        expect(button.getAttribute("data-copied")).toBe("true");
        await vi.advanceTimersByTimeAsync(2000);
        fixture.detectChanges();
        expect(button.getAttribute("data-copied")).toBe("false");
    });

    test("a refused copy reports the error and marks nothing", async () => {
        const failure = new Error("denied");
        vi.stubGlobal("navigator", {
            clipboard: { writeText: vi.fn().mockRejectedValue(failure) },
        });
        const fixture = make();
        const errors: unknown[] = [];
        fixture.componentInstance.copyError.subscribe((error: unknown) => errors.push(error));
        const button = fixture.nativeElement.querySelector("button");
        button.click();
        await new Promise((resolve) => setTimeout(resolve));
        fixture.detectChanges();
        expect(errors).toEqual([failure]);
        expect(button.getAttribute("data-copied")).toBe("false");
    });
});
