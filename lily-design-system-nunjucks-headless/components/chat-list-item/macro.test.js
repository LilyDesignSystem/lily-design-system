import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("chat-list-item", () => {
  it("renders an <li> with the base class", () => {
    const { document } = render("chat-list-item", { text: "Hi" });
    expect(document.querySelector("li.chat-list-item")).toBeTruthy();
  });

  it("escapes text", () => {
    const { document } = render("chat-list-item", { text: "A & B" });
    expect(document.querySelector("li").textContent.trim()).toBe("A & B");
  });

  it("renders html raw", () => {
    const { document } = render("chat-list-item", {
      html: '<article class="chat-message"></article>',
    });
    expect(document.querySelector("li article.chat-message")).toBeTruthy();
  });

  it("renders caller content", () => {
    const { document } = render(
      "chat-list-item",
      {},
      '<article class="chat-message"></article>',
    );
    expect(document.querySelector("li article.chat-message")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("chat-list-item", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
