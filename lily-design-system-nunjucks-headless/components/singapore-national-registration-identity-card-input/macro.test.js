import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("singapore-national-registration-identity-card-input", () => {
  it("renders an <input type=text> with the base class", () => {
    const { document } = render("singapore-national-registration-identity-card-input", { id: "subject" });
    const el = document.querySelector("input");
    expect(el.getAttribute("type")).toBe("text");
    expect(el.classList.contains("singapore-national-registration-identity-card-input")).toBe(true);
  });

  it("sets autocomplete=off", () => {
    const { document } = render("singapore-national-registration-identity-card-input", { id: "subject" });
    const el = document.querySelector("input");
    expect(el.getAttribute("autocomplete")).toBe("off");
  });

  it("renders the value", () => {
    const { document } = render("singapore-national-registration-identity-card-input", { id: "subject", value: "test-value" });
    expect(document.querySelector("input").getAttribute("value")).toBe("test-value");
  });

  it("supports aria-invalid and aria-errormessage", () => {
    const { document } = render("singapore-national-registration-identity-card-input", { id: "subject", invalid: true, errormessage: "subject-err" });
    const el = document.querySelector("input");
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("subject-err");
  });

  it("appends params.classes", () => {
    const { document } = render("singapore-national-registration-identity-card-input", { id: "subject", classes: "wide" });
    expect(document.querySelector("input.singapore-national-registration-identity-card-input.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("singapore-national-registration-identity-card-input", { id: "subject" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
