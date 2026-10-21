// singapore-national-registration-identity-card-view.test.js
// SingaporeNationalRegistrationIdentityCardView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.singapore-national-registration-identity-card-view");


describe("SingaporeNationalRegistrationIdentityCardView", () => {
  it("renders the element with its base class", async () => {
    await mount("singapore-national-registration-identity-card-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("singapore-national-registration-identity-card-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("singapore-national-registration-identity-card-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});
