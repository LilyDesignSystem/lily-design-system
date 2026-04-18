import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("alert", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("alert", { text: "Saved" });
    const el = document.querySelector("div");
    expect(el).toBeTruthy();
    expect(el.classList.contains("alert")).toBe(true);
  });

  it("defaults role to 'alert'", () => {
    const { document } = render("alert", { text: "x" });
    expect(document.querySelector("div").getAttribute("role")).toBe("alert");
  });

  it("respects a custom role", () => {
    const { document } = render("alert", { text: "x", role: "status" });
    expect(document.querySelector("div").getAttribute("role")).toBe("status");
  });

  it("escapes params.text", () => {
    const { document } = render("alert", { text: "Saved & closed" });
    expect(document.querySelector("div").textContent.trim()).toBe("Saved & closed");
  });

  it("renders params.html raw", () => {
    const { document } = render("alert", { html: "<strong>Error</strong>" });
    expect(document.querySelector("div strong")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("alert", { text: "x", classes: "alert-success" });
    expect(document.querySelector("div.alert.alert-success")).toBeTruthy();
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("alert", { text: "x", label: "Success" });
    expect(document.querySelector("div").getAttribute("aria-label")).toBe("Success");
  });

  it("renders params.attributes", () => {
    const { document } = render("alert", {
      text: "x",
      attributes: { "data-dismissable": "true" },
    });
    expect(document.querySelector("div").getAttribute("data-dismissable")).toBe("true");
  });

  it("renders caller block content", () => {
    const { document } = render("alert", {}, "<em>Call</em>");
    expect(document.querySelector("div em").textContent).toBe("Call");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("alert", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
