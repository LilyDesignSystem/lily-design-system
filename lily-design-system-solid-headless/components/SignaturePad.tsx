// SignaturePad component
//
// A headless container for capturing handwritten signatures using mouse, touch,
// or stylus input. Renders a <div> with role="application" and an accessible
// label. Commonly used in contract signing workflows, consent forms, delivery
// confirmations, and legal document processing. The consumer provides the actual
// drawing implementation (HTML canvas, SVG paths, or a third-party library).
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible description of the signature field via aria-label.
//   children — ReactNode, required. Drawing surface (canvas, SVG, or other input mechanism).
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <SignaturePad label="Sign here">
//     <canvas width="400" height="200"></canvas>
//   </SignaturePad>
//
// Examples:
//
//   <SignaturePad label="Sign to accept terms">
//     <canvas width="400" height="200"></canvas>
//   </SignaturePad>
//
//
//   <SignaturePad label="Your signature">
//     <svg viewBox="0 0 400 200"><path d="" /></svg>
//   </SignaturePad>
//
// Keyboard:
//   - None — pointer-based interactions are handled by the consumer-provided drawing surface.
//
// Accessibility:
//   - role="application" indicates a complex widget with custom pointer interactions
//   - aria-label provides an accessible description of the signature pad purpose
//   - Assistive technologies pass keyboard events through to the application
//
// Internationalization:
//   - The label prop externalizes the accessible description for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal drawing logic — consumer provides canvas/SVG implementation
//   - role="application" is intentional for complex pointer interaction widgets
//
// References:
//   - WAI-ARIA application role: https://www.w3.org/TR/wai-aria-1.2/#application

import type { JSX } from "@solidjs/web";
import { omit, createSignal, createUniqueId } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingName, warnMissingProp } from "./dev-warning";

export interface SignaturePadProps {
    class?: string;
    /** The group's accessible name. */
    label: string;
    /** What the signer confirms, in the consumer's words; shown first and the group's accessible description. */
    attestation?: string;
    /** The signature's outcome; rendered as data-outcome, with outcomeLabel as its words. */
    outcome?: "signed" | "declined" | "unable" | "verbal" | "on-paper" | "pending" | "revoked";
    /** The outcome in the consumer's words; required with outcome. */
    outcomeLabel?: string;
    /** Adds a typed-name field with this label, so a signature can be given by keyboard alone (WCAG 2.1.1). */
    typedNameLabel?: string;
    /** The typed name (controlled), with onTypedNameChange. */
    typedName?: string;
    onTypedNameChange?: (value: string) => void;
    /** The typed-name field's form name. */
    name?: string;
    /** The drawing surface (canvas, SVG), the consumer's. */
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function SignaturePad(props: SignaturePadProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "attestation",
        "outcome",
        "outcomeLabel",
        "typedNameLabel",
        "typedName",
        "onTypedNameChange",
        "name",
        "children",
    );
    warnMissingName("SignaturePad", p.label, p["aria-label"], p["aria-labelledby"]);
    const uid = createUniqueId();
    const [ownName, setOwnName] = createSignal("");
    const value = () => p.typedName ?? ownName();
    if (p.outcome)
        warnMissingProp(
            "SignaturePad",
            "outcomeLabel",
            p.outcomeLabel,
            "a signature's outcome needs words, never an empty line.",
        );
    return (
        <div
            class={`signature-pad ${p.class}`}
            role="group"
            aria-label={p.label}
            aria-describedby={p.attestation ? `signature-pad-attestation-${uid}` : undefined}
            data-outcome={attr(p.outcome)}
            {...restProps}
        >
            {p.attestation ? (
                <p
                    class="signature-pad-attestation"
                    id={`signature-pad-attestation-${uid}`}
                >
                    {p.attestation}
                </p>
            ) : null}
            {p.children}
            {p.typedNameLabel ? (
                <p class="signature-pad-typed">
                    <label for={`signature-pad-typed-${uid}`}>{p.typedNameLabel}</label>
                    <input
                        id={`signature-pad-typed-${uid}`}
                        type="text"
                        autocomplete="name"
                        name={p.name}
                        value={value()}
                        onInput={(event) => {
                            setOwnName(event.target.value);
                            p.onTypedNameChange?.(event.target.value);
                        }}
                    />
                </p>
            ) : null}
            {p.outcome && p.outcomeLabel ? (
                <p class="signature-pad-outcome">{p.outcomeLabel}</p>
            ) : null}
        </div>
    );
}
