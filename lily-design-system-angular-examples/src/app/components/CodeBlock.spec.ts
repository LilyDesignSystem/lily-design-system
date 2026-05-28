import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(CodeBlock);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.code-block");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(CodeBlock);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.code-block");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
