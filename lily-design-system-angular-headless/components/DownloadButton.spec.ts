import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DownloadButton } from "./DownloadButton";

describe("DownloadButton", () => {
    test("renders the <a> root with the base class", () => {
        const fixture = TestBed.createComponent(DownloadButton);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.download-button");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(DownloadButton);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.download-button");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a download link with href and file metadata", () => {
        const fixture = TestBed.createComponent(DownloadButton);
        fixture.componentRef.setInput("href", "/report.pdf");
        fixture.componentRef.setInput("fileSize", "2 MB");
        fixture.componentRef.setInput("fileFormat", "PDF");
        fixture.componentRef.setInput("download", "annual-report.pdf");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.download-button");
        expect(el.getAttribute("href")).toBe("/report.pdf");
        expect(el.getAttribute("data-file-size")).toBe("2 MB");
        expect(el.getAttribute("data-file-format")).toBe("PDF");
        expect(el.getAttribute("download")).toBe("annual-report.pdf");
    });

    test("download true is an empty download attribute; false omits it", () => {
        const fixture = TestBed.createComponent(DownloadButton);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.download-button");
        expect(el.hasAttribute("download")).toBe(false);
        fixture.componentRef.setInput("download", true);
        fixture.detectChanges();
        expect(el.getAttribute("download")).toBe("");
    });
});
