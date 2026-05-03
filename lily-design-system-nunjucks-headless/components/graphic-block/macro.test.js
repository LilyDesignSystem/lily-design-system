import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("graphic-block", () => {
  it("renders a <figure> with class graphic-block", () => {
    const { document } = render("graphic-block", { label: "Sales" }, "<svg></svg>");
    expect(document.querySelector("figure.graphic-block")).toBeTruthy();
  });

  it("applies role=img with aria-label", () => {
    const { document } = render("graphic-block", { label: "Sales" }, "<svg></svg>");
    const root = document.querySelector(".graphic-block");
    expect(root.getAttribute("role")).toBe("img");
    expect(root.getAttribute("aria-label")).toBe("Sales");
  });

  it("renders content inside graphic-block-content", () => {
    const { document } = render("graphic-block", { label: "x" }, "chart");
    expect(document.querySelector(".graphic-block-content").textContent.trim()).toBe("chart");
  });

  it("omits figcaption when no title/description/notes", () => {
    const { document } = render("graphic-block", { label: "x" }, "<svg></svg>");
    expect(document.querySelector("figcaption")).toBeNull();
  });

  it("renders title, description, notes when provided", () => {
    const { document } = render("graphic-block", {
      label: "x", title: "T", description: "D", notes: "N",
    }, "<svg></svg>");
    expect(document.querySelector(".graphic-block-title").textContent).toBe("T");
    expect(document.querySelector(".graphic-block-description").textContent).toBe("D");
    expect(document.querySelector(".graphic-block-notes").textContent).toBe("N");
  });
});
