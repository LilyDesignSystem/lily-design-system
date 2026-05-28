import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContentBlock } from "./ContentBlock";

describe("ContentBlock", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ContentBlock);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.content-block");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ContentBlock);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.content-block");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
