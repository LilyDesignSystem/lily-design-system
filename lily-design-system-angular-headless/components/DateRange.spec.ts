import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DateRange } from "./DateRange";

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(DateRange);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}

describe("DateRange", () => {
  test("renders a fieldset root with the base class", () => {
    const el = render().nativeElement.querySelector("fieldset.date-range");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const el = render({ className: "extra" }).nativeElement.querySelector("fieldset.date-range");
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("renders two date inputs, each with its own accessible name", () => {
    const f = render({ label: "Trip dates", startLabel: "Departure", endLabel: "Return" });
    const root = f.nativeElement.querySelector("fieldset");
    expect(root.getAttribute("aria-label")).toBe("Trip dates");
    const inputs = f.nativeElement.querySelectorAll("input.date-input[type=date]");
    expect(inputs.length).toBe(2);
    expect(inputs[0].getAttribute("aria-label")).toBe("Departure");
    expect(inputs[1].getAttribute("aria-label")).toBe("Return");
  });

  test("omits aria-label attributes when no label is given", () => {
    const f = render();
    expect(f.nativeElement.querySelector("fieldset").hasAttribute("aria-label")).toBe(false);
  });

  test("reflects start and end and writes typed values back to the model", () => {
    const f = render({ start: "2026-01-02", end: "2026-01-09" });
    const [s, e] = Array.from(f.nativeElement.querySelectorAll("input")) as HTMLInputElement[];
    expect(s.value).toBe("2026-01-02");
    expect(e.value).toBe("2026-01-09");
    e.value = "2026-02-01";
    e.dispatchEvent(new Event("input"));
    expect(f.componentInstance.end()).toBe("2026-02-01");
    expect(f.componentInstance.start()).toBe("2026-01-02");
  });
});
