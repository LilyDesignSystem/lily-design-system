import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./DownloadButton.vue";


describe("DownloadButton", () => {
    test("renders as an anchor element", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download" },
        });

        const link: HTMLElement = screen.getByRole("link", { name: "Download" });
        expect(link).toBeTruthy();
        expect(link.tagName).toBe("A");
    });

    test("has download-button class on root", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download" },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.classList.contains("download-button")).toBe(true);
    });

    test("applies href attribute", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download" },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("href")).toBe("/file.pdf");
    });

    test("applies aria-label from label prop", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download report PDF" },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("aria-label")).toBe("Download report PDF");
    });

    test("renders default slot content", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download" },
            slots: { default: "Get the file" },
        });

        expect(screen.getByText("Get the file")).toBeTruthy();
    });

    test("falls back to label as text when slot is omitted", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download" },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.textContent?.trim()).toBe("Download");
    });

    test("exposes fileSize as data-file-size", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download", fileSize: "2.4 MB" },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("data-file-size")).toBe("2.4 MB");
    });

    test("exposes fileFormat as data-file-format", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download", fileFormat: "PDF" },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("data-file-format")).toBe("PDF");
    });

    test("applies download attribute when string is provided", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download", download: "report.pdf" },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("download")).toBe("report.pdf");
    });

    test("applies empty download attribute when boolean true is provided", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download", download: true },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.hasAttribute("download")).toBe(true);
    });

    test("does not apply data-file-size when omitted", () => {
        render(Subject, {
            props: { href: "/file.pdf", label: "Download" },
        });

        const link: HTMLElement = screen.getByRole("link");
        expect(link.getAttribute("data-file-size")).toBeNull();
    });
});
