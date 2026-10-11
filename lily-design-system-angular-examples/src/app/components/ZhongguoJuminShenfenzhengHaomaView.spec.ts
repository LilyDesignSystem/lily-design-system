import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ZhongguoJuminShenfenzhengHaomaView } from "./ZhongguoJuminShenfenzhengHaomaView";

describe("ZhongguoJuminShenfenzhengHaomaView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(ZhongguoJuminShenfenzhengHaomaView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.zhongguo-jumin-shenfenzheng-haoma-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ZhongguoJuminShenfenzhengHaomaView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.zhongguo-jumin-shenfenzheng-haoma-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});
