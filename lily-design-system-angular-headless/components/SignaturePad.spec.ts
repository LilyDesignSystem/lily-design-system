import { TestBed } from "@angular/core/testing";
import { describe, expect, test } from "vitest";

import { SignaturePad } from "./SignaturePad";

function make(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(SignaturePad);
    for (const [key, value] of Object.entries(inputs)) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("SignaturePad", () => {
    test("is a named group, not an application, so a screen reader keeps its own keys", () => {
        const fixture = make({ label: "Signature" });
        const root = (fixture.nativeElement as HTMLElement).querySelector(
            "div.signature-pad",
        ) as HTMLElement;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Signature");
    });

    test("the attestation is shown first and is the group's description", () => {
        const fixture = make({ label: "Consent signature", attestation: "I confirm." });
        const root = (fixture.nativeElement as HTMLElement).querySelector(
            "div.signature-pad",
        ) as HTMLElement;
        const attestation = root.firstElementChild as HTMLElement;
        expect(attestation.className).toBe("signature-pad-attestation");
        expect(root.getAttribute("aria-describedby")).toBe(attestation.id);
    });

    test("a signature can be completed by keyboard alone, by typing a name", () => {
        const fixture = make({
            label: "Consent signature",
            typedNameLabel: "Type your full name",
            name: "signature",
        });
        const seen: string[] = [];
        fixture.componentInstance.typedName.subscribe((v) => seen.push(v));
        const input = (fixture.nativeElement as HTMLElement).querySelector(
            ".signature-pad-typed input",
        ) as HTMLInputElement;
        const label = (fixture.nativeElement as HTMLElement).querySelector(
            ".signature-pad-typed label",
        )!;
        expect(label.getAttribute("for")).toBe(input.id);
        expect(input.getAttribute("autocomplete")).toBe("name");
        expect(input.getAttribute("name")).toBe("signature");
        input.value = "Ada Lovelace";
        input.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(seen.at(-1)).toBe("Ada Lovelace");
    });

    test("an outcome other than signed is a notice in the consumer's words, and data-outcome", () => {
        const fixture = make({
            label: "Consent signature",
            outcome: "declined",
            outcomeLabel: "Declined to sign",
        });
        const root = (fixture.nativeElement as HTMLElement).querySelector(
            "div.signature-pad",
        ) as HTMLElement;
        expect(root.getAttribute("data-outcome")).toBe("declined");
        expect(root.querySelector(".signature-pad-outcome")?.textContent).toBe("Declined to sign");
    });
});
