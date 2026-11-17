import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./SignaturePad";

describe("SignaturePad", () => {
    test("is a named group, not an application, so a screen reader keeps its own keys", () => {
        render(<Subject label="Signature">canvas</Subject>);
        expect(screen.getByRole("group", { name: "Signature" })).toBeTruthy();
        expect(screen.queryByRole("application")).toBeNull();
    });

    test("passes through attributes", () => {
        render(
            <Subject
                label="S"
                data-testid="sp"
            />,
        );
        expect(screen.getByTestId("sp")).toBeTruthy();
    });

    test("the attestation is shown first and is the group's description", () => {
        render(
            <Subject
                label="Consent signature"
                attestation="I confirm I have read and understood the information."
            >
                canvas
            </Subject>,
        );
        const group = screen.getByRole("group", { name: "Consent signature" });
        const attestation = group.firstElementChild as HTMLElement;
        expect(attestation.className).toBe("signature-pad-attestation");
        expect(group.getAttribute("aria-describedby")).toBe(attestation.id);
    });

    test("a signature can be completed by keyboard alone, by typing a name", async () => {
        const user = userEvent.setup();
        const onTypedNameChange = vi.fn();
        render(
            <Subject
                label="Consent signature"
                typedNameLabel="Type your full name"
                name="signature"
                onTypedNameChange={onTypedNameChange}
            />,
        );
        await user.tab();
        const field = screen.getByRole("textbox", { name: "Type your full name" });
        expect(document.activeElement).toBe(field);
        await user.keyboard("Ada Lovelace");
        expect((field as HTMLInputElement).value).toBe("Ada Lovelace");
        expect(onTypedNameChange).toHaveBeenLastCalledWith("Ada Lovelace");
        expect(field.getAttribute("name")).toBe("signature");
    });

    test("an outcome other than signed is a notice in the consumer's words, and data-outcome", () => {
        const { container } = render(
            <Subject
                label="Consent signature"
                outcome="declined"
                outcomeLabel="Declined to sign"
            />,
        );
        expect(screen.getByRole("group").getAttribute("data-outcome")).toBe("declined");
        expect(container.querySelector(".signature-pad-outcome")?.textContent).toBe(
            "Declined to sign",
        );
    });
});
