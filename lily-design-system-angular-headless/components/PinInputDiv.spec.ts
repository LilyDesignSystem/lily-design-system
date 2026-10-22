import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PinInputDiv } from "./PinInputDiv";

describe("PinInputDiv", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(PinInputDiv);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.pin-input-div");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PinInputDiv);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.pin-input-div");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
  const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(event);
  return event;
}

describe("PinInputDiv — boxes, digits and keys", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(PinInputDiv);
    for (const [k, v] of Object.entries({ label: "PIN", ...inputs })) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const boxes = () => Array.from(fixture.nativeElement.querySelectorAll("input")) as HTMLInputElement[];
    const type = (i: number, v: string) => {
      const b = boxes()[i];
      b.value = v;
      b.dispatchEvent(new Event("input", { bubbles: true }));
      fixture.detectChanges();
    };
    return { fixture, boxes, type };
  }

  test("is a labelled group with `length` numeric single-character boxes", () => {
    const { fixture, boxes } = create({ length: 6 });
    expect(fixture.nativeElement.querySelector("[role='group']").getAttribute("aria-label")).toBe("PIN");
    expect(boxes()).toHaveLength(6);
    expect(boxes()[0].getAttribute("inputmode")).toBe("numeric");
    expect(boxes()[0].getAttribute("maxlength")).toBe("1");
  });

  test("each box is named by digitLabel(position, length), else by label", () => {
    const a = create({ length: 3 });
    expect(a.boxes()[1].getAttribute("aria-label")).toBe("PIN");
    const b = create({ length: 3, digitLabel: (n: number, total: number) => `Digit ${n} of ${total}` });
    expect(b.boxes()[1].getAttribute("aria-label")).toBe("Digit 2 of 3");
  });

  test("typing a digit stores it, moves focus to the next box and updates value", () => {
    const { fixture, boxes, type } = create({ length: 4 });
    document.body.appendChild(fixture.nativeElement);
    boxes()[0].focus();
    type(0, "4");
    expect(document.activeElement).toBe(boxes()[1]);
    type(1, "2");
    expect(fixture.componentInstance.value()).toBe("42");
    fixture.nativeElement.remove();
  });

  test("a non-digit is rejected and the box keeps its previous content", () => {
    const { fixture, boxes, type } = create();
    type(0, "7");
    type(0, "x");
    expect(boxes()[0].value).toBe("7");
    expect(fixture.componentInstance.value()).toBe("7");
  });

  test("an initial value fills the boxes (digits only)", () => {
    const { boxes } = create({ value: "12a4", length: 4 });
    expect(boxes().map((b) => b.value)).toEqual(["1", "2", "", "4"]);
  });

  test("Backspace on an empty box moves back and clears the previous digit", () => {
    const { fixture, boxes, type } = create({ length: 3 });
    document.body.appendChild(fixture.nativeElement);
    type(0, "1");
    boxes()[1].focus();
    key(boxes()[1], "Backspace");
    fixture.detectChanges();
    expect(document.activeElement).toBe(boxes()[0]);
    expect(fixture.componentInstance.value()).toBe("");
    fixture.nativeElement.remove();
  });

  test("ArrowLeft/ArrowRight move between boxes and stop at the ends", () => {
    const { fixture, boxes } = create({ length: 3 });
    document.body.appendChild(fixture.nativeElement);
    boxes()[1].focus();
    key(boxes()[1], "ArrowRight");
    expect(document.activeElement).toBe(boxes()[2]);
    key(boxes()[2], "ArrowRight");
    expect(document.activeElement).toBe(boxes()[2]);
    key(boxes()[2], "ArrowLeft");
    key(boxes()[1], "ArrowLeft");
    expect(document.activeElement).toBe(boxes()[0]);
    key(boxes()[0], "ArrowLeft");
    expect(document.activeElement).toBe(boxes()[0]);
    fixture.nativeElement.remove();
  });

  test("disabled disables every box", () => {
    const { boxes } = create({ disabled: true });
    expect(boxes().every((b) => b.disabled)).toBe(true);
  });
});
