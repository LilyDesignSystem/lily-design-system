import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("date-field", () => {
  it("renders a <fieldset> with day, month, year inputs", () => {
    const { document } = render("date-field", {
      id: "dob",
      name: "dob",
      legend: "Date of birth",
      day: 20,
      month: 4,
      year: 1990,
    });
    expect(document.querySelector("fieldset.date-field")).toBeTruthy();
    expect(document.querySelector(".date-field-legend").textContent.trim())
      .toBe("Date of birth");
    expect(document.querySelector("#dob-day").getAttribute("value")).toBe("20");
    expect(document.querySelector("#dob-month").getAttribute("value")).toBe("4");
    expect(document.querySelector("#dob-year").getAttribute("value"))
      .toBe("1990");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("date-field", { id: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
