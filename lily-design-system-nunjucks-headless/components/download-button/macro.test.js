import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("download-button", () => {
  it("renders an <a> with the base class", () => {
    const { document } = render("download-button", {
      href: "/file.pdf",
      label: "Download file",
    });
    expect(document.querySelector("a.download-button")).toBeTruthy();
  });

  it("renders the href attribute", () => {
    const { document } = render("download-button", {
      href: "/files/report.pdf",
      label: "Download",
    });
    expect(document.querySelector("a").getAttribute("href"))
      .toBe("/files/report.pdf");
  });

  it("renders aria-label", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download annual report",
    });
    expect(document.querySelector("a").getAttribute("aria-label"))
      .toBe("Download annual report");
  });

  it("uses label as visible text by default", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download report",
    });
    expect(document.querySelector("a").textContent.trim())
      .toBe("Download report");
  });

  it("renders custom text content overriding the label", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download report",
      text: "Get it",
    });
    expect(document.querySelector("a").textContent.trim()).toBe("Get it");
  });

  it("renders raw html content", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
      html: "<span>PDF</span>",
    });
    expect(document.querySelector("a span").textContent).toBe("PDF");
  });

  it("renders data-file-size when fileSize is provided", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
      fileSize: "2.4 MB",
    });
    expect(document.querySelector("a").getAttribute("data-file-size"))
      .toBe("2.4 MB");
  });

  it("renders data-file-format when fileFormat is provided", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
      fileFormat: "PDF",
    });
    expect(document.querySelector("a").getAttribute("data-file-format"))
      .toBe("PDF");
  });

  it("renders bare download attribute when download is true", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
      download: true,
    });
    const a = document.querySelector("a");
    expect(a.hasAttribute("download")).toBe(true);
    expect(a.getAttribute("download")).toBe("");
  });

  it("renders download attribute with filename when string", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
      download: "report.pdf",
    });
    expect(document.querySelector("a").getAttribute("download"))
      .toBe("report.pdf");
  });

  it("omits download attribute when not provided", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
    });
    expect(document.querySelector("a").hasAttribute("download")).toBe(false);
  });

  it("appends params.classes", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
      classes: "primary",
    });
    expect(document.querySelector("a.download-button.primary")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("a").getAttribute("data-test")).toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("download-button", {
      href: "/x.pdf",
      label: "Download",
    });
    expect(html).not.toContain("<style");
  });
});
