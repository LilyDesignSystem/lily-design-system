import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("summary-list-item", () => {
  it("renders a <div> grouping with <dt> and <dd>", () => {
    const { document } = render("summary-list-item", {
      key: "Name",
      value: "Jane",
    });
    const el = document.querySelector("div.summary-list-item");
    expect(el).toBeTruthy();
    const dt = el.querySelector("dt.summary-list-item-key");
    const dd = el.querySelector("dd.summary-list-item-value");
    expect(dt.textContent.trim()).toBe("Name");
    expect(dd.textContent.trim()).toBe("Jane");
  });

  it("escapes key and value", () => {
    const { document } = render("summary-list-item", {
      key: "A & B",
      value: "<X>",
    });
    expect(document.querySelector("dt.summary-list-item-key").textContent.trim())
      .toBe("A & B");
    expect(document.querySelector("dd.summary-list-item-value").textContent.trim())
      .toBe("<X>");
  });

  it("renders keyHtml and valueHtml raw", () => {
    const { document } = render("summary-list-item", {
      keyHtml: "<strong>Name</strong>",
      valueHtml: "<em>Jane</em>",
    });
    expect(document.querySelector("dt.summary-list-item-key strong")).toBeTruthy();
    expect(document.querySelector("dd.summary-list-item-value em")).toBeTruthy();
  });

  it("omits actions <dd> when no actions are given", () => {
    const { document } = render("summary-list-item", {
      key: "K",
      value: "V",
    });
    expect(document.querySelector("dd.summary-list-item-actions")).toBeNull();
  });

  it("renders actions as links", () => {
    const { document } = render("summary-list-item", {
      key: "Date of birth",
      value: "1985-04-27",
      actions: [
        { text: "Change", href: "/dob" },
        { text: "Remove", href: "/dob/remove" },
      ],
    });
    const links = document.querySelectorAll(
      "dd.summary-list-item-actions a",
    );
    expect(links.length).toBe(2);
    expect(links[0].getAttribute("href")).toBe("/dob");
    expect(links[0].textContent.trim()).toBe("Change");
    expect(links[1].getAttribute("href")).toBe("/dob/remove");
  });

  it("adds a visually-hidden action disambiguation when provided", () => {
    const { document } = render("summary-list-item", {
      key: "Date of birth",
      value: "1985-04-27",
      actions: [
        { text: "Change", href: "/dob", visuallyHiddenText: "date of birth" },
      ],
    });
    const a = document.querySelector("dd.summary-list-item-actions a");
    expect(a.getAttribute("aria-label")).toBe("Change date of birth");
    expect(a.querySelector("span.visually-hidden").textContent.trim())
      .toBe("date of birth");
  });

  it("appends params.classes", () => {
    const { document } = render("summary-list-item", {
      key: "K",
      value: "V",
      classes: "dense",
    });
    expect(document.querySelector("div.summary-list-item.dense")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("summary-list-item", { key: "K", value: "V" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
