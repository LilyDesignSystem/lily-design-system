// password-input-or-text-input-div.test.js
// PasswordInputOrTextInputDiv component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.password-input-or-text-input-div");
const input = () => el().querySelector("input");
const toggle = () => el().querySelector("button");

describe("PasswordInputOrTextInputDiv", () => {
  it("renders the element with its base class", async () => {
    await mount("password-input-or-text-input-div");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("password-input-or-text-input-div")).toBe(true);
  });

  it("starts masked with the password-manager hint", async () => {
    await mount("password-input-or-text-input-div");
    expect(input().type).toBe("password");
    expect(input().getAttribute("autocomplete")).toBe("current-password");
    expect(toggle().getAttribute("aria-pressed")).toBe("false");
  });
  it("the toggle switches the input between password and text", async () => {
    await mount("password-input-or-text-input-div");
    input().value = "secret";
    toggle().click(); await tick();
    expect(input().type).toBe("text");
    expect(input().value).toBe("secret");
    expect(toggle().getAttribute("aria-pressed")).toBe("true");
    toggle().click(); await tick();
    expect(input().type).toBe("password");
  });
});
