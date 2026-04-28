import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("action-group", () => {
  it("renders a <div role=group> with the base class and aria-label", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      html: "<button>Save</button>",
    });
    const el = document.querySelector("div.action-group");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("Document actions");
  });

  it("renders the visible action buttons", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      html: '<button class="a">Save</button><button class="b">Print</button>',
    });
    expect(document.querySelector("button.a")).toBeTruthy();
    expect(document.querySelector("button.b")).toBeTruthy();
  });

  it("does not render the overflow trigger when overflowHtml is not provided", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      html: "<button>Save</button>",
    });
    expect(document.querySelector(".action-group-overflow-trigger")).toBeNull();
    expect(document.querySelector(".action-group-overflow-menu")).toBeNull();
  });

  it("renders the overflow trigger when overflowHtml is provided", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      overflowLabel: "More actions",
      overflowHtml: "<button>Export</button>",
    });
    const trigger = document.querySelector(".action-group-overflow-trigger");
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-label")).toBe("More actions");
  });

  it("renders aria-expanded='false' by default", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      overflowLabel: "More actions",
      overflowHtml: "<button>Export</button>",
    });
    expect(document.querySelector(".action-group-overflow-trigger")
      .getAttribute("aria-expanded")).toBe("false");
    expect(document.querySelector(".action-group-overflow-menu")
      .hasAttribute("hidden")).toBe(true);
  });

  it("renders aria-expanded='true' and unhidden menu when overflowOpen is true", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      overflowLabel: "More actions",
      overflowOpen: true,
      overflowHtml: '<button class="export">Export</button>',
    });
    expect(document.querySelector(".action-group-overflow-trigger")
      .getAttribute("aria-expanded")).toBe("true");
    expect(document.querySelector(".action-group-overflow-menu")
      .hasAttribute("hidden")).toBe(false);
    expect(document.querySelector(".action-group-overflow-menu .export"))
      .toBeTruthy();
  });

  it("links the trigger to the panel via aria-controls when overflowId is set", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      overflowLabel: "More actions",
      overflowId: "more-1",
      overflowHtml: "<button>Export</button>",
    });
    expect(document.querySelector(".action-group-overflow-trigger")
      .getAttribute("aria-controls")).toBe("more-1");
    expect(document.querySelector(".action-group-overflow-menu")
      .getAttribute("id")).toBe("more-1");
  });

  it("appends params.classes", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      classes: "compact",
    });
    expect(document.querySelector("div.action-group.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("action-group", {
      label: "Document actions",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.action-group").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("action-group", { label: "Document actions" });
    expect(html).not.toContain("<style");
  });
});
