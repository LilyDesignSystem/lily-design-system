// zhongguo-jumin-shenfenzheng-haoma-input.test.js
// ZhongguoJuminShenfenzhengHaomaInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.zhongguo-jumin-shenfenzheng-haoma-input");


describe("ZhongguoJuminShenfenzhengHaomaInput", () => {
  it("renders the element with its base class", async () => {
    await mount("zhongguo-jumin-shenfenzheng-haoma-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("zhongguo-jumin-shenfenzheng-haoma-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("zhongguo-jumin-shenfenzheng-haoma-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
