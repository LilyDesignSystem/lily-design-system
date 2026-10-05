import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "chat-composer";
const base = { label: "Message", sendLabel: "Send", stopLabel: "Stop" };
const doc = (extra = {}) => render(name, { ...base, ...extra }).document;

describe("chat-composer", () => {
  it("renders a <form> with the base class, a named textarea and one button", () => {
    const d = doc();
    expect(d.querySelector("form.chat-composer")).toBeTruthy();
    expect(d.querySelector("textarea.chat-composer-input").getAttribute("aria-label")).toBe("Message");
    expect(d.querySelectorAll("button").length).toBe(1);
  });

  it("the button is the send button by default", () => {
    const b = doc().querySelector("button");
    expect(b.getAttribute("type")).toBe("submit");
    expect(b.getAttribute("data-state")).toBe("send");
    expect(b.textContent.trim()).toBe("Send");
  });

  it("the send button is disabled, not hidden, when the value is empty or whitespace, and enabled otherwise", () => {
    expect(doc().querySelector("button").hasAttribute("disabled")).toBe(true);
    expect(doc({ value: "   " }).querySelector("button").hasAttribute("disabled")).toBe(true);
    expect(doc({ value: "hi" }).querySelector("button").hasAttribute("disabled")).toBe(false);
  });

  it("busy renders the button as stop: type=button, data-state=stop, stopLabel, enabled", () => {
    const b = doc({ busy: true, value: "x" }).querySelector("button");
    expect(b.getAttribute("type")).toBe("button");
    expect(b.getAttribute("data-state")).toBe("stop");
    expect(b.textContent.trim()).toBe("Stop");
    expect(b.hasAttribute("disabled")).toBe(false);
  });

  it("the value is the textarea content", () => {
    expect(doc({ value: "hello" }).querySelector("textarea").textContent).toBe("hello");
  });

  it("rows follow the line count, clamped to minRows and maxRows", () => {
    expect(doc({ minRows: 2, maxRows: 4 }).querySelector("textarea").getAttribute("rows")).toBe("2");
    expect(doc({ minRows: 2, maxRows: 4, value: "a\nb\nc" }).querySelector("textarea").getAttribute("rows")).toBe("3");
    expect(doc({ minRows: 2, maxRows: 4, value: "a\nb\nc\nd\ne\nf" }).querySelector("textarea").getAttribute("rows")).toBe("4");
  });

  it("disabled disables the textarea and the button", () => {
    const d = doc({ disabled: true, value: "x" });
    expect(d.querySelector("textarea").hasAttribute("disabled")).toBe(true);
    expect(d.querySelector("button").hasAttribute("disabled")).toBe(true);
  });

  it("passes placeholder and name to the textarea", () => {
    const t = doc({ placeholder: "Ask", name: "msg" }).querySelector("textarea");
    expect(t.getAttribute("placeholder")).toBe("Ask");
    expect(t.getAttribute("name")).toBe("msg");
  });

  it("puts the base class first, then the consumer class, and sets id and attributes", () => {
    const f = doc({ classes: "mine", id: "cc1", attributes: { "data-x": "1" } }).querySelector("form");
    expect(f.getAttribute("class")).toBe("chat-composer mine");
    expect(f.getAttribute("id")).toBe("cc1");
    expect(f.getAttribute("data-x")).toBe("1");
  });

  it("renders params.html before the textarea", () => {
    const f = doc({ html: '<span data-testid="extra">E</span>' }).querySelector("form");
    expect(f.firstElementChild.getAttribute("data-testid")).toBe("extra");
  });

  it("contains no <style> or <script> tags or inline styles", () => {
    const { html } = render(name, { ...base, busy: true });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});
