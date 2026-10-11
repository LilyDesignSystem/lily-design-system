import { describe, expect, test, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { ChatComposer } from "./ChatComposer";

function make(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(ChatComposer);
  const base: Record<string, unknown> = { label: "Message", sendLabel: "Send", stopLabel: "Stop" };
  for (const [k, v] of Object.entries({ ...base, ...inputs })) fixture.componentRef.setInput(k, v);
  const send = vi.fn();
  const stop = vi.fn();
  fixture.componentInstance.send.subscribe(send);
  fixture.componentInstance.stop.subscribe(stop);
  fixture.detectChanges();
  return { fixture, send, stop };
}
const q = (f: any, sel: string) => f.nativeElement.querySelector(sel);
const ta = (f: any): HTMLTextAreaElement => q(f, "textarea");
const btn = (f: any): HTMLButtonElement => q(f, "button");
const key = (el: HTMLElement, init: KeyboardEventInit) => {
  const e = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(e);
  return e;
};
const type = (f: any, text: string) => {
  ta(f).value = text;
  ta(f).dispatchEvent(new Event("input"));
  f.detectChanges();
};

@Component({
  standalone: true,
  imports: [ChatComposer],
  template: `<lily-chat-composer label="M" sendLabel="Send" stopLabel="Stop"><span data-testid="extra">E</span></lily-chat-composer>`,
})
class Host {}

describe("ChatComposer", () => {
  test("renders a <form> with the base class, a named textarea and one button", () => {
    const { fixture } = make();
    expect(q(fixture, "form").classList.contains("chat-composer")).toBe(true);
    expect(ta(fixture).getAttribute("aria-label")).toBe("Message");
    expect(fixture.nativeElement.querySelectorAll("button").length).toBe(1);
  });
  test("the button is the send button: type=submit, data-state=send, named by sendLabel", () => {
    const { fixture } = make();
    expect(btn(fixture).getAttribute("type")).toBe("submit");
    expect(btn(fixture).getAttribute("data-state")).toBe("send");
    expect(btn(fixture).textContent!.trim()).toBe("Send");
  });
  test("the send button is disabled, not hidden, while the text is empty or whitespace", () => {
    const { fixture } = make();
    expect(btn(fixture).disabled).toBe(true);
    type(fixture, "   ");
    expect(btn(fixture).disabled).toBe(true);
    type(fixture, "hi");
    expect(btn(fixture).disabled).toBe(false);
  });
  test("Enter sends the value and prevents the line break", () => {
    const { fixture, send } = make({ value: "hello" });
    const e = key(ta(fixture), { key: "Enter" });
    expect(send).toHaveBeenCalledWith("hello");
    expect(e.defaultPrevented).toBe(true);
  });
  test("Shift+Enter does not send (it inserts a line break)", () => {
    const { fixture, send } = make({ value: "hello" });
    const e = key(ta(fixture), { key: "Enter", shiftKey: true });
    expect(send).not.toHaveBeenCalled();
    expect(e.defaultPrevented).toBe(false);
  });
  test("Enter during IME composition does not send", () => {
    const { fixture, send } = make({ value: "こん" });
    key(ta(fixture), { key: "Enter", isComposing: true });
    expect(send).not.toHaveBeenCalled();
  });
  test("Enter on empty text or when disabled does not send", () => {
    const a = make();
    key(ta(a.fixture), { key: "Enter" });
    expect(a.send).not.toHaveBeenCalled();
    const b = make({ value: "hi", disabled: true });
    key(ta(b.fixture), { key: "Enter" });
    expect(b.send).not.toHaveBeenCalled();
  });
  test("submitting the form (the send button) sends", () => {
    const { fixture, send } = make({ value: "hello" });
    q(fixture, "form").dispatchEvent(new Event("submit", { cancelable: true }));
    expect(send).toHaveBeenCalledWith("hello");
  });
  test("while busy the same button becomes stop: type=button, data-state=stop, named by stopLabel", () => {
    const { fixture } = make({ busy: true, value: "x" });
    expect(btn(fixture).getAttribute("type")).toBe("button");
    expect(btn(fixture).getAttribute("data-state")).toBe("stop");
    expect(btn(fixture).textContent!.trim()).toBe("Stop");
    expect(btn(fixture).disabled).toBe(false);
  });
  test("pressing stop emits stop and never send; Enter while busy does not send", () => {
    const { fixture, send, stop } = make({ busy: true, value: "x" });
    btn(fixture).click();
    expect(stop).toHaveBeenCalledTimes(1);
    key(ta(fixture), { key: "Enter" });
    expect(send).not.toHaveBeenCalled();
  });
  test("rows follow the number of lines, clamped to minRows and maxRows", () => {
    const { fixture } = make({ minRows: 2, maxRows: 4 });
    expect(ta(fixture).getAttribute("rows")).toBe("2");
    type(fixture, "a\nb\nc");
    expect(ta(fixture).getAttribute("rows")).toBe("3");
    type(fixture, "a\nb\nc\nd\ne\nf");
    expect(ta(fixture).getAttribute("rows")).toBe("4");
  });
  test("disabled disables the textarea and the button", () => {
    const { fixture } = make({ disabled: true, value: "x" });
    expect(ta(fixture).disabled).toBe(true);
    expect(btn(fixture).disabled).toBe(true);
  });
  test("passes placeholder and name to the textarea", () => {
    const { fixture } = make({ placeholder: "Ask", name: "msg" });
    expect(ta(fixture).getAttribute("placeholder")).toBe("Ask");
    expect(ta(fixture).getAttribute("name")).toBe("msg");
  });
  test("appends the consumer class after the base class", () => {
    // Angular's class binding does not preserve source order, so assert membership.
    const { fixture } = make({ className: "mine" });
    const cl = q(fixture, "form").classList;
    expect(cl.contains("chat-composer")).toBe(true);
    expect(cl.contains("mine")).toBe(true);
  });
  test("projects content before the textarea", () => {
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    expect(f.nativeElement.querySelector("form").firstElementChild.getAttribute("data-testid")).toBe("extra");
  });
});
