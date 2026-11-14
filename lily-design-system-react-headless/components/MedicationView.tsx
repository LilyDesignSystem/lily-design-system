// MedicationView: a medicine's name, strength, form, route and frequency, none truncated (spec/healthcare-ui item 3).
// Tall man letters come from the consumer as marked segments; Lily ships no list. Props: MedicationView.md.
import React from "react";

export interface MedicationNameSegment {
    text: string;
    tallMan?: boolean;
}

export interface MedicationViewProps {
    className?: string;
    label?: string;
    name?: string;
    /** The name in parts, tall man letters marked; used instead of name. */
    nameSegments?: MedicationNameSegment[];
    /** The strength, formatted by the consumer ("25 mg"). */
    strength?: string;
    form?: string;
    route?: string;
    frequency?: string;
    [key: string]: unknown;
}

function Part({ name, text }: { name: string; text?: string }) {
    if (!text) return null;
    return (
        <>
            {" "}
            <span className={`medication-view-${name}`}>{text}</span>
        </>
    );
}

export default function MedicationView({
    className = "",
    label,
    name = "",
    nameSegments,
    strength,
    form,
    route,
    frequency,
    ...restProps
}: MedicationViewProps) {
    return (
        <span
            className={`medication-view ${className}`}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            <span className="medication-view-name">
                {nameSegments
                    ? nameSegments.map((segment, i) =>
                          segment.tallMan ? (
                              <span
                                  key={i}
                                  className="medication-view-tall-man"
                              >
                                  {segment.text}
                              </span>
                          ) : (
                              <React.Fragment key={i}>{segment.text}</React.Fragment>
                          ),
                      )
                    : name}
            </span>
            <Part
                name="strength"
                text={strength}
            />
            <Part
                name="form"
                text={form}
            />
            <Part
                name="route"
                text={route}
            />
            <Part
                name="frequency"
                text={frequency}
            />
        </span>
    );
}
