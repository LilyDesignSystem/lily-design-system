import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./DownloadButton";

describe("DownloadButton", () => {
    test("renders as an anchor with the required href", () => {
        render(
            <Subject href="/files/report.pdf" label="Download report" />,
        );

        const link: HTMLAnchorElement = screen.getByRole("link") as HTMLAnchorElement;
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/files/report.pdf");
    });

    test("applies the download-button root class", () => {
        render(<Subject href="/f.pdf" label="Download" />);

        const link: HTMLElement = screen.getByRole("link");
        expect(link.className.includes("download-button")).toBe(true);
    });

    test("uses label as aria-label", () => {
        render(<Subject href="/f.pdf" label="Download report" />);

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("aria-label")).toBe("Download report");
    });

    test("falls back to label as visible text when no children", () => {
        render(<Subject href="/f.pdf" label="Download report" />);

        const link: HTMLElement = screen.getByRole("link");
        expect(link.textContent).toBe("Download report");
    });

    test("renders children when provided", () => {
        render(
            <Subject href="/f.pdf" label="Download report">
                Get file
            </Subject>,
        );

        const link: HTMLElement = screen.getByRole("link");
        expect(link.textContent).toBe("Get file");
    });

    test("renders the native download attribute by default", () => {
        render(<Subject href="/f.pdf" label="Download" />);

        const link: HTMLElement = screen.getByRole("link");
        expect(link.hasAttribute("download")).toBe(true);
    });

    test("supports a string download filename", () => {
        render(
            <Subject href="/f.pdf" label="Download" download="report.pdf" />,
        );

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("download")).toBe("report.pdf");
    });

    test("exposes fileSize as data attribute", () => {
        render(<Subject href="/f.pdf" label="Download" fileSize="2.4 MB" />);

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("data-file-size")).toBe("2.4 MB");
    });

    test("exposes fileFormat as data attribute", () => {
        render(<Subject href="/f.pdf" label="Download" fileFormat="PDF" />);

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("data-file-format")).toBe("PDF");
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject href="/f.pdf" label="Download" id="dl-1" />);

        const link = document.querySelector('[id="dl-1"]');
        expect(link).toBeTruthy();
    });
});
