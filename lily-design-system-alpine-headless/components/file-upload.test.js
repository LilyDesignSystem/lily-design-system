// file-upload.test.js
// FileUpload component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.file-upload");
const button = () => el().querySelector("button");
const input = () => el().querySelector("input");
const status = () => el().querySelector(".file-upload-status");
const choose = async (files) => {
  Object.defineProperty(input(), "files", { value: files, configurable: true });
  input().dispatchEvent(new Event("change", { bubbles: true }));
  await tick();
};

describe("FileUpload", () => {
  it("renders the element with its base class", async () => {
    await mount("file-upload");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("file-upload")).toBe(true);
  });

  it("is a button, a hidden file input and a polite status", async () => {
    await mount("file-upload");
    expect(button().type).toBe("button");
    expect(input().type).toBe("file");
    expect(input().hidden).toBe(true);
    expect(input().getAttribute("aria-hidden")).toBe("true");
    expect(input().getAttribute("tabindex")).toBe("-1");
    expect(status().getAttribute("aria-live")).toBe("polite");
    expect(status().getAttribute("data-file-count")).toBe("0");
  });
  it("the button opens the chooser by clicking the input, without submitting", async () => {
    await mount("file-upload");
    const clicked = vi.fn();
    input().addEventListener("click", clicked);
    button().click(); await tick();
    expect(clicked).toHaveBeenCalledTimes(1);
  });
  it("choosing files updates the count and announces them", async () => {
    await mount("file-upload");
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail.files.length));
    await choose([new File(["a"], "a.txt"), new File(["b"], "b.txt")]);
    expect(status().getAttribute("data-file-count")).toBe("2");
    expect(status().textContent).toBe("2");
    expect(seen).toHaveBeenCalledWith(2);
    await choose([]);
    expect(status().getAttribute("data-file-count")).toBe("0");
    expect(status().textContent).toBe("");
  });
});
