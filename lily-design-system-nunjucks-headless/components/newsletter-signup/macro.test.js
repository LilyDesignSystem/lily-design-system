import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const baseParams = {
  label: "Subscribe",
  emailLabel: "Email address",
  submitLabel: "Subscribe",
};

describe("newsletter-signup", () => {
  it("renders a <form> with the base class", () => {
    const { document } = render("newsletter-signup", baseParams);
    expect(document.querySelector("form.newsletter-signup")).toBeTruthy();
  });

  it("renders aria-label on the form", () => {
    const { document } = render("newsletter-signup", baseParams);
    expect(document.querySelector("form").getAttribute("aria-label"))
      .toBe("Subscribe");
  });

  it("defaults data-state to 'idle'", () => {
    const { document } = render("newsletter-signup", baseParams);
    expect(document.querySelector("form").getAttribute("data-state"))
      .toBe("idle");
  });

  it("renders the email input as type='email'", () => {
    const { document } = render("newsletter-signup", baseParams);
    expect(document.querySelector("form input").getAttribute("type"))
      .toBe("email");
  });

  it("links the visible label to the input via for/id", () => {
    const { document } = render("newsletter-signup", baseParams);
    const label = document.querySelector("form label");
    const input = document.querySelector("form input[type='email']");
    expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
  });

  it("renders the email placeholder when provided", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      emailPlaceholder: "you@example.com",
    });
    expect(document.querySelector("form input").getAttribute("placeholder"))
      .toBe("you@example.com");
  });

  it("renders the submit button with the submitLabel", () => {
    const { document } = render("newsletter-signup", baseParams);
    expect(document.querySelector("form button[type='submit']").textContent)
      .toBe("Subscribe");
  });

  it("disables input and button when state is 'submitting'", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      state: "submitting",
    });
    expect(document.querySelector("form input").hasAttribute("disabled"))
      .toBe(true);
    expect(document.querySelector("form button").hasAttribute("disabled"))
      .toBe(true);
  });

  it("renders heading and description when provided", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      heading: "Stay in the loop",
      description: "Monthly updates.",
    });
    expect(document.querySelector("form h3").textContent)
      .toBe("Stay in the loop");
    expect(document.querySelector("form .newsletter-signup-description")
      .textContent).toBe("Monthly updates.");
  });

  it("renders the success message with role='status' and aria-live='polite'", () => {
    const { document } = render("newsletter-signup", baseParams);
    const success = document.querySelector(".newsletter-signup-success");
    expect(success.getAttribute("role")).toBe("status");
    expect(success.getAttribute("aria-live")).toBe("polite");
  });

  it("renders the error message with role='alert'", () => {
    const { document } = render("newsletter-signup", baseParams);
    const error = document.querySelector(".newsletter-signup-error");
    expect(error.getAttribute("role")).toBe("alert");
  });

  it("hides the success message when state is not 'success'", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      state: "idle",
      successMessage: "Subscribed!",
    });
    expect(document.querySelector(".newsletter-signup-success")
      .hasAttribute("hidden")).toBe(true);
  });

  it("shows the success message when state is 'success'", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      state: "success",
      successMessage: "Subscribed!",
    });
    const success = document.querySelector(".newsletter-signup-success");
    expect(success.hasAttribute("hidden")).toBe(false);
    expect(success.textContent).toBe("Subscribed!");
  });

  it("hides the error message when state is not 'error'", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      state: "idle",
      errorMessage: "Failed",
    });
    expect(document.querySelector(".newsletter-signup-error")
      .hasAttribute("hidden")).toBe(true);
  });

  it("shows the error message when state is 'error'", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      state: "error",
      errorMessage: "Try again",
    });
    const error = document.querySelector(".newsletter-signup-error");
    expect(error.hasAttribute("hidden")).toBe(false);
    expect(error.textContent).toBe("Try again");
  });

  it("appends params.classes", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      classes: "compact",
    });
    expect(document.querySelector("form.newsletter-signup.compact"))
      .toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("newsletter-signup", {
      ...baseParams,
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("form").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("newsletter-signup", baseParams);
    expect(html).not.toContain("<style");
  });
});
