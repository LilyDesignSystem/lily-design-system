// MedicationView: a medicine's name, strength, form, route and frequency, none truncated (spec/healthcare-ui item 3).
// Tall man letters come from the consumer as marked segments; Lily ships no list. Props: MedicationView.md.

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface MedicationNameSegment {
    text: string;
    tallMan?: boolean;
}

export interface MedicationViewProps {
    class?: string;
    label?: string;
    name?: string;
    /** The name in parts, tall man letters marked; used instead of name. */
    nameSegments?: MedicationNameSegment[];
    /** The strength, formatted by the consumer ("25 mg"). */
    strength?: string;
    form?: string;
    route?: string;
    frequency?: string;
    /** The dose as free text (FHIR Dosage.text), when the record has no structured parts. */
    dosageText?: string;
    [key: string]: unknown;
}

function Part({ name, text }: { name: string; text?: string }) {
    if (!text) return null;
    return (
        <>
            {" "}
            <span class={`medication-view-${name}`}>{text}</span>
        </>
    );
}

export default function MedicationView(props: MedicationViewProps) {
    const p = withDefaults({ class: "" as const, name: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "name",
        "nameSegments",
        "strength",
        "form",
        "route",
        "frequency",
        "dosageText",
    );
    return (
        <span
            class={`medication-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            <span class="medication-view-name">
                {p.nameSegments
                    ? p.nameSegments.map((segment, i) =>
                          segment.tallMan ? (
                              <span class="medication-view-tall-man">{segment.text}</span>
                          ) : (
                              <>{segment.text}</>
                          ),
                      )
                    : p.name}
            </span>
            <Part
                name="strength"
                text={p.strength}
            />
            <Part
                name="form"
                text={p.form}
            />
            <Part
                name="route"
                text={p.route}
            />
            <Part
                name="frequency"
                text={p.frequency}
            />
            <Part
                name="dosage"
                text={p.dosageText}
            />
        </span>
    );
}
