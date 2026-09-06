import { afterEach, describe, expect, test } from "vitest";

import { DownloadButton } from "./download-button.js";

if (!customElements.get("lily-download-button")) {
    customElements.define("lily-download-button", DownloadButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DownloadButton", () => {
    test("renders a native anchor with href and aria-label", () => {
        const host = render(
            '<lily-download-button href="/files/report.pdf" label="Download report (PDF, 2.4 MB)"></lily-download-button>',
        );

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("download-button");
        expect(a.getAttribute("href")).toBe("/files/report.pdf");
        expect(a.getAttribute("aria-label")).toBe("Download report (PDF, 2.4 MB)");
    });

    test("renders data-file-size and data-file-format when provided", () => {
        const host = render(
            '<lily-download-button href="/x" label="Download" file-size="2.4 MB" file-format="PDF"></lily-download-button>',
        );

        const a = host.querySelector("a")!;
        expect(a.getAttribute("data-file-size")).toBe("2.4 MB");
        expect(a.getAttribute("data-file-format")).toBe("PDF");
    });

    test("omits data-file-size and data-file-format when not provided", () => {
        const host = render('<lily-download-button href="/x" label="Download"></lily-download-button>');

        const a = host.querySelector("a")!;
        expect(a.hasAttribute("data-file-size")).toBe(false);
        expect(a.hasAttribute("data-file-format")).toBe(false);
    });

    test("defaults to a bare download attribute", () => {
        const host = render('<lily-download-button href="/x" label="Download"></lily-download-button>');

        const a = host.querySelector("a")!;
        expect(a.hasAttribute("download")).toBe(true);
        expect(a.getAttribute("download")).toBe("");
    });

    test("renders download as a bare attribute when download=true", () => {
        const host = render('<lily-download-button href="/x" label="Download" download="true"></lily-download-button>');

        expect(host.querySelector("a")!.getAttribute("download")).toBe("");
    });

    test("renders download as a filename when download is a string", () => {
        const host = render(
            '<lily-download-button href="/x" label="Download" download="report.pdf"></lily-download-button>',
        );

        expect(host.querySelector("a")!.getAttribute("download")).toBe("report.pdf");
    });

    test("omits download entirely when download=false", () => {
        const host = render('<lily-download-button href="/x" label="Download" download="false"></lily-download-button>');

        expect(host.querySelector("a")!.hasAttribute("download")).toBe(false);
    });

    test("defaults visible content to the label when no children are provided", () => {
        const host = render('<lily-download-button href="/x" label="Download report"></lily-download-button>');

        expect(host.querySelector("a")!.textContent).toBe("Download report");
    });

    test("uses provided children over the label default", () => {
        const host = render(
            '<lily-download-button href="/x" label="Download report">Get the PDF</lily-download-button>',
        );

        expect(host.querySelector("a")!.textContent).toBe("Get the PDF");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-download-button href="/x" label="Download" class="extra"></lily-download-button>');

        expect(host.querySelector("a")!.className).toBe("download-button extra");
    });

    test("passes through rest attributes", () => {
        const host = render(
            '<lily-download-button href="/x" label="Download" data-testid="dl"></lily-download-button>',
        );

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("dl");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-download-button href="/x" label="Download"></lily-download-button>');

        (host as unknown as DownloadButton).connectedCallback();

        expect(host.querySelectorAll("a.download-button").length).toBe(1);
    });
});
