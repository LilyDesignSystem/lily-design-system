import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("statistic", () => {
  it("renders a <div> with the base class and role='group'", () => {
    const { document } = render("statistic", {
      title: "Active users",
      value: "1,128",
    });
    const el = document.querySelector("div.statistic");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
  });

  it("computes aria-label as '{title}: {value}' by default", () => {
    const { document } = render("statistic", {
      title: "Active users",
      value: "1,128",
    });
    expect(document.querySelector("div.statistic").getAttribute("aria-label"))
      .toBe("Active users: 1,128");
  });

  it("uses params.label as aria-label override", () => {
    const { document } = render("statistic", {
      title: "Active users",
      value: "1,128",
      label: "Active users this month",
    });
    expect(document.querySelector("div.statistic").getAttribute("aria-label"))
      .toBe("Active users this month");
  });

  it("renders the title", () => {
    const { document } = render("statistic", {
      title: "Active users",
      value: "1,128",
    });
    expect(document.querySelector("div.statistic-title").textContent)
      .toBe("Active users");
  });

  it("renders the value", () => {
    const { document } = render("statistic", {
      title: "Active users",
      value: "1,128",
    });
    expect(document.querySelector("div.statistic-value").textContent.trim())
      .toBe("1,128");
  });

  it("renders a prefix when provided", () => {
    const { document } = render("statistic", {
      title: "Revenue",
      value: "1,234",
      prefix: "$",
    });
    expect(document.querySelector("span.statistic-prefix").textContent)
      .toBe("$");
  });

  it("renders a suffix when provided", () => {
    const { document } = render("statistic", {
      title: "Growth",
      value: "12.5",
      suffix: "%",
    });
    expect(document.querySelector("span.statistic-suffix").textContent)
      .toBe("%");
  });

  it("renders prefixHtml as raw HTML", () => {
    const { document } = render("statistic", {
      title: "Revenue",
      value: "1,234",
      prefixHtml: "<svg class='dollar'></svg>",
    });
    expect(
      document.querySelector("span.statistic-prefix svg.dollar"),
    ).toBeTruthy();
  });

  it("renders suffixHtml as raw HTML", () => {
    const { document } = render("statistic", {
      title: "Growth",
      value: "12.5",
      suffixHtml: "<i class='unit'>%</i>",
    });
    expect(document.querySelector("span.statistic-suffix i.unit").textContent)
      .toBe("%");
  });

  it("omits prefix/suffix spans when not provided", () => {
    const { document } = render("statistic", {
      title: "Active users",
      value: "1,128",
    });
    expect(document.querySelector("span.statistic-prefix")).toBeNull();
    expect(document.querySelector("span.statistic-suffix")).toBeNull();
  });

  it("appends params.classes", () => {
    const { document } = render("statistic", {
      title: "X",
      value: "1",
      classes: "extra",
    });
    expect(document.querySelector("div.statistic.extra")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("statistic", {
      title: "X",
      value: "1",
      attributes: { "data-test": "y" },
    });
    expect(document.querySelector("div.statistic").getAttribute("data-test"))
      .toBe("y");
  });

  it("contains no <style> tag", () => {
    const { html } = render("statistic", { title: "X", value: "1" });
    expect(html).not.toContain("<style");
  });
});
