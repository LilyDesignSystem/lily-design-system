import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./SignaturePad.vue";

describe("SignaturePad", () => {
    test("is a named group, not an application, so a screen reader keeps its own keys", () => {
        render(Subject, { props: { label: "Signature" }, slots: { default: "canvas" } });
        expect(screen.getByRole("group", { name: "Signature" })).toBeTruthy();
        expect(screen.queryByRole("application")).toBeNull();
    });

    test("the attestation is shown first and is the group's description", () => {
        render(Subject, {
            props: {
                label: "Consent signature",
                attestation: "I confirm I have read and understood the information.",
            },
        });
        const group = screen.getByRole("group", { name: "Consent signature" });
        const attestation = group.firstElementChild as HTMLElement;
        expect(attestation.className).toBe("signature-pad-attestation");
        expect(group.getAttribute("aria-describedby")).toBe(attestation.id);
    });

    test("a signature can be completed by keyboard alone, by typing a name", async () => {
        const user = userEvent.setup();
        const { emitted } = render(Subject, {
            props: {
                label: "Consent signature",
                typedNameLabel: "Type your full name",
                name: "signature",
            },
        });
        await user.tab();
        const field = screen.getByRole("textbox", { name: "Type your full name" });
        expect(document.activeElement).toBe(field);
        await user.keyboard("Ada Lovelace");
        expect((field as HTMLInputElement).value).toBe("Ada Lovelace");
        const updates = emitted()["update:typedName"] as string[][];
        expect(updates.at(-1)).toEqual(["Ada Lovelace"]);
        expect(field.getAttribute("name")).toBe("signature");
    });

    test("an outcome other than signed is a notice in the consumer's words, and data-outcome", () => {
        const { container } = render(Subject, {
            props: {
                label: "Consent signature",
                outcome: "declined",
                outcomeLabel: "Declined to sign",
            },
        });
        expect(screen.getByRole("group").getAttribute("data-outcome")).toBe("declined");
        expect(container.querySelector(".signature-pad-outcome")?.textContent?.trim()).toBe(
            "Declined to sign",
        );
    });
});
