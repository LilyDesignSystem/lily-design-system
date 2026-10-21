// newsletter-signup.test.js
// NewsletterSignup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("form.newsletter-signup");
import { snippet } from "../test/mount.js";
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};
const email = () => el().querySelector(".newsletter-signup-email");
const submit = () => el().querySelector(".newsletter-signup-submit");
const success = () => el().querySelector(".newsletter-signup-success");
const error = () => el().querySelector(".newsletter-signup-error");
const inState = (state) => snippet("newsletter-signup").replace("lilyNewsletterSignup()", "lilyNewsletterSignup('" + state + "')");

describe("NewsletterSignup", () => {
  it("renders the element with its base class", async () => {
    await mount("newsletter-signup");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("newsletter-signup")).toBe(true);
  });

  it("starts idle with both messages hidden and the controls enabled", async () => {
    await mount("newsletter-signup");
    expect(el().getAttribute("data-state")).toBe("idle");
    expect(success().hidden).toBe(true);
    expect(error().hidden).toBe(true);
    expect(email().disabled).toBe(false);
    expect(submit().disabled).toBe(false);
  });
  it("submitting disables the field and the button", async () => {
    await mount("newsletter-signup", inState("submitting"));
    expect(el().getAttribute("data-state")).toBe("submitting");
    expect(email().disabled).toBe(true);
    expect(submit().disabled).toBe(true);
  });
  it("success shows the polite status only; error shows the alert only", async () => {
    await mount("newsletter-signup", inState("success"));
    expect(success().hidden).toBe(false);
    expect(error().hidden).toBe(true);
    expect(success().getAttribute("role")).toBe("status");
    await mount("newsletter-signup", inState("error"));
    expect(error().hidden).toBe(false);
    expect(success().hidden).toBe(true);
    expect(error().getAttribute("role")).toBe("alert");
  });
  it("submit is prevented and announces the email so the consumer can move the state on", async () => {
    await mount("newsletter-signup");
    const seen = vi.fn();
    el().addEventListener("lily:submit", (e) => seen(e.detail));
    email().value = "a@example.com";
    const event = new Event("submit", { bubbles: true, cancelable: true });
    el().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(seen).toHaveBeenCalledWith({ email: "a@example.com" });
  });
});
