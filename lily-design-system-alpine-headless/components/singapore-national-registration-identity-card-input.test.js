// singapore-national-registration-identity-card-input.test.js
// SingaporeNationalRegistrationIdentityCardInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.singapore-national-registration-identity-card-input");


describe("SingaporeNationalRegistrationIdentityCardInput", () => {
  it("renders the element with its base class", async () => {
    await mount("singapore-national-registration-identity-card-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("singapore-national-registration-identity-card-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("singapore-national-registration-identity-card-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});
