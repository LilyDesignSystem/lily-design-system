import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("task-list-item", () => {
  it("renders an <li> with the base class and default status", () => {
    const { document } = render("task-list-item", { title: "Step 1" });
    const el = document.querySelector("li.task-list-item");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-status")).toBe("not-started");
  });

  it("respects a custom status", () => {
    const { document } = render("task-list-item", {
      title: "x",
      status: "completed",
    });
    expect(document.querySelector("li.task-list-item").getAttribute("data-status"))
      .toBe("completed");
  });

  it("renders title as a link when href is present", () => {
    const { document } = render("task-list-item", {
      title: "Personal details",
      href: "/personal",
    });
    const a = document.querySelector("li.task-list-item .task-list-item-title a");
    expect(a).toBeTruthy();
    expect(a.getAttribute("href")).toBe("/personal");
    expect(a.textContent).toBe("Personal details");
  });

  it("renders title as plain text when href is absent", () => {
    const { document } = render("task-list-item", {
      title: "Cannot start yet",
      status: "cannot-start-yet",
    });
    const title = document.querySelector("li.task-list-item .task-list-item-title");
    expect(title.querySelector("a")).toBeNull();
    expect(title.textContent.trim()).toBe("Cannot start yet");
  });

  it("omits the status <strong> when statusText is absent", () => {
    const { document } = render("task-list-item", { title: "x" });
    expect(document.querySelector(".task-list-item-status")).toBeNull();
  });

  it("renders the status as <strong> with its own data-status", () => {
    const { document } = render("task-list-item", {
      title: "x",
      status: "completed",
      statusText: "Completed",
      id: "t1",
    });
    const s = document.querySelector("strong.task-list-item-status");
    expect(s).toBeTruthy();
    expect(s.getAttribute("data-status")).toBe("completed");
    expect(s.textContent.trim()).toBe("Completed");
  });

  it("links the link to the status via aria-describedby when id is set", () => {
    const { document } = render("task-list-item", {
      title: "x",
      href: "/x",
      status: "in-progress",
      statusText: "In progress",
      id: "t1",
    });
    const a = document.querySelector(".task-list-item-title a");
    const s = document.querySelector("strong.task-list-item-status");
    expect(a.getAttribute("aria-describedby")).toBe("t1-status");
    expect(s.getAttribute("id")).toBe("t1-status");
  });

  it("appends params.classes", () => {
    const { document } = render("task-list-item", {
      title: "x",
      classes: "highlight",
    });
    expect(document.querySelector("li.task-list-item.highlight")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("task-list-item", {
      title: "x",
      attributes: { "data-index": "3" },
    });
    expect(document.querySelector("li.task-list-item").getAttribute("data-index"))
      .toBe("3");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("task-list-item", { title: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
