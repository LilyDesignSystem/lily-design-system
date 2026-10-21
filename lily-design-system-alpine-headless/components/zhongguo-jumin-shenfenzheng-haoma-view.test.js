// zhongguo-jumin-shenfenzheng-haoma-view.test.js
// ZhongguoJuminShenfenzhengHaomaView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.zhongguo-jumin-shenfenzheng-haoma-view");


describe("ZhongguoJuminShenfenzhengHaomaView", () => {
  it("renders the element with its base class", async () => {
    await mount("zhongguo-jumin-shenfenzheng-haoma-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("zhongguo-jumin-shenfenzheng-haoma-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("zhongguo-jumin-shenfenzheng-haoma-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
