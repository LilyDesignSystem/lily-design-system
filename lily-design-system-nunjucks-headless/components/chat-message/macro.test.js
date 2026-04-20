import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("chat-message", () => {
  it("renders an <article> with the base class and default data-origin", () => {
    const { document } = render("chat-message", { text: "Hello" });
    const el = document.querySelector("article.chat-message");
    expect(el).toBeTruthy();
    expect(el.getAttribute("data-origin")).toBe("peer");
  });

  it("sets data-origin from params.origin", () => {
    const { document } = render("chat-message", {
      origin: "self",
      text: "Hi",
    });
    expect(document.querySelector("article").getAttribute("data-origin"))
      .toBe("self");
  });

  it("renders the author when provided", () => {
    const { document } = render("chat-message", {
      author: "Dr Patel",
      text: "Hi",
    });
    expect(document.querySelector(".chat-message-author").textContent.trim())
      .toBe("Dr Patel");
  });

  it("renders a <time> with datetime when params.time is provided", () => {
    const { document } = render("chat-message", {
      time: "2026-04-20T09:30:00Z",
      timeText: "9:30am",
      text: "Hi",
    });
    const t = document.querySelector("time.chat-message-time");
    expect(t.getAttribute("datetime")).toBe("2026-04-20T09:30:00Z");
    expect(t.textContent.trim()).toBe("9:30am");
  });

  it("renders the text body", () => {
    const { document } = render("chat-message", { text: "Hello" });
    expect(document.querySelector(".chat-message-body").textContent.trim())
      .toBe("Hello");
  });

  it("renders raw html body when provided", () => {
    const { document } = render("chat-message", {
      html: "<p>Hi</p>",
    });
    expect(document.querySelector(".chat-message-body p").textContent).toBe("Hi");
  });

  it("renders avatarHtml in its slot", () => {
    const { document } = render("chat-message", {
      avatarHtml: '<span class="avatar"></span>',
      text: "Hi",
    });
    expect(
      document.querySelector(".chat-message-avatar .avatar"),
    ).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("chat-message", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
