import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("email-link", () => {
  it("renders an <a> with mailto href and the base class", () => {
    const { document } = render("email-link", { address: "help@example.com" });
    const el = document.querySelector("a.email-link");
    expect(el).toBeTruthy();
    expect(el.getAttribute("href")).toBe("mailto:help@example.com");
  });

  it("defaults text to the address", () => {
    const { document } = render("email-link", { address: "help@example.com" });
    expect(document.querySelector("a").textContent.trim())
      .toBe("help@example.com");
  });

  it("respects params.text", () => {
    const { document } = render("email-link", {
      address: "help@example.com",
      text: "Email the help desk",
    });
    expect(document.querySelector("a").textContent.trim())
      .toBe("Email the help desk");
  });

  it("adds subject to the mailto href", () => {
    const { document } = render("email-link", {
      address: "help@example.com",
      subject: "NHS number enquiry",
    });
    const href = document.querySelector("a").getAttribute("href");
    expect(href).toContain("mailto:help@example.com?");
    expect(href).toContain("subject=NHS%20number%20enquiry");
  });

  it("combines subject, cc, bcc, body in the query string", () => {
    const { document } = render("email-link", {
      address: "a@b",
      subject: "S",
      cc: "c@b",
      bcc: "d@b",
      body: "hi",
    });
    const href = document.querySelector("a").getAttribute("href");
    expect(href).toContain("subject=S");
    expect(href).toContain("cc=c%40b");
    expect(href).toContain("bcc=d%40b");
    expect(href).toContain("body=hi");
    expect(href.split("&").length).toBe(4);
  });

  it("sets aria-label from params.label", () => {
    const { document } = render("email-link", {
      address: "help@example.com",
      label: "Email the help desk",
    });
    expect(document.querySelector("a").getAttribute("aria-label"))
      .toBe("Email the help desk");
  });

  it("renders params.html raw", () => {
    const { document } = render("email-link", {
      address: "a@b",
      html: "<strong>Email us</strong>",
    });
    expect(document.querySelector("a strong").textContent).toBe("Email us");
  });

  it("appends params.classes", () => {
    const { document } = render("email-link", {
      address: "a@b",
      classes: "inline",
    });
    expect(document.querySelector("a.email-link.inline")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("email-link", { address: "a@b" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
