import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { PLATFORM_ID } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { TimerButton } from "./TimerButton";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TimerButton);
    for (const [key, value] of Object.entries({ label: "Continue", duration: 3, ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("TimerButton", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("button.timer-button");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    const started = async (inputs: Record<string, unknown> = {}) => {
        const fixture = make(inputs);
        await vi.advanceTimersByTimeAsync(0);
        fixture.detectChanges();
        return fixture;
    };

    test("counts down, then fires once", async () => {
        const fixture = await started();
        let fired = 0;
        fixture.componentInstance.fired.subscribe(() => fired++);
        const button = fixture.nativeElement.querySelector("button");
        expect(button.getAttribute("aria-live")).toBe("polite");
        expect(button.getAttribute("data-remaining-seconds")).toBe("3");
        await vi.advanceTimersByTimeAsync(1000);
        fixture.detectChanges();
        expect(button.getAttribute("data-remaining-seconds")).toBe("2");
        await vi.advanceTimersByTimeAsync(5000);
        expect(fired).toBe(1);
    });

    test("pressing fires at once, and the countdown does not fire again", async () => {
        const fixture = await started();
        let fired = 0;
        fixture.componentInstance.fired.subscribe(() => fired++);
        fixture.nativeElement.querySelector("button").click();
        await vi.advanceTimersByTimeAsync(5000);
        expect(fired).toBe(1);
    });

    test("disabled has no countdown", async () => {
        const fixture = await started({ disabled: true });
        let fired = 0;
        fixture.componentInstance.fired.subscribe(() => fired++);
        expect(fixture.nativeElement.querySelector("button").disabled).toBe(true);
        await vi.advanceTimersByTimeAsync(5000);
        expect(fired).toBe(0);
    });

    test("prerendering does not count down", async () => {
        TestBed.configureTestingModule({
            providers: [{ provide: PLATFORM_ID, useValue: "server" }],
        });
        const fixture = make();
        await vi.advanceTimersByTimeAsync(0);
        let fired = 0;
        fixture.componentInstance.fired.subscribe(() => fired++);
        await vi.advanceTimersByTimeAsync(5000);
        expect(fired).toBe(0);
    });

    test("destroying it stops the countdown", async () => {
        const fixture = await started();
        let fired = 0;
        fixture.componentInstance.fired.subscribe(() => fired++);
        fixture.destroy();
        await vi.advanceTimersByTimeAsync(5000);
        expect(fired).toBe(0);
    });
});
